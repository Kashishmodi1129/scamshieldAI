from .rule_engine import analyze_with_rules, get_risk_level
from .link_analysis import analyze_urls

def compute_final_score(
    conversation: str,
    llm_result: dict | None,
    detection_mode: str,
    confidence_threshold: int,
) -> dict:
    rule_score, rule_flags = analyze_with_rules(conversation)
    link_results = analyze_urls(conversation)
    is_fallback = False
    confidence = 0.0
    llm_flags = []

    if detection_mode == "fast":
        final_score = rule_score
        explanation = "Fast mode analysis based on rule engine only."
        recommendations = ["Enable Balanced or Deep mode for LLM-powered analysis."]
        tactics = []
        category = ""
        is_fallback = True
        confidence = 0.6

    elif detection_mode in ("balanced", "deep") and llm_result:
        llm_score = llm_result.get("risk_score", rule_score)
        llm_confidence = llm_result.get("confidence", 0.8)
        llm_weight = 0.6 if detection_mode == "balanced" else 0.8
        rule_weight = 1.0 - llm_weight

        # Weighted combination
        final_score = round(rule_score * rule_weight + llm_score * llm_weight)
        category = llm_result.get("category", "")
        tactics = llm_result.get("tactics", [])
        llm_flags = llm_result.get("flagged_messages", [])
        explanation = llm_result.get("explanation", "")
        recommendations = llm_result.get("recommendations", [])

        # Override: if LLM flagged critical risk, trust it
        if llm_score >= confidence_threshold and llm_confidence >= 0.7:
            final_score = max(final_score, llm_score)
        elif llm_score >= 60 and llm_confidence >= 0.8:
            final_score = max(final_score, llm_score)

        confidence = llm_confidence

    else:
        # API key missing / LLM unavailable
        final_score = rule_score
        explanation = "Limited Analysis Mode — LLM unavailable. Results are from rule engine only."
        recommendations = ["Configure an API key in Developer Settings for full AI analysis."]
        tactics = []
        category = ""
        is_fallback = True
        confidence = 0.5

    # ─── Apply rule engine overrides (even over LLM) ──────
    # If rule engine detected direct credential harvesting, floor score
    for flag in rule_flags:
        if flag["severity"] == "critical" and "credential" in flag["reason"].lower():
            final_score = max(final_score, 80)
            if "otp" in flag["reason"].lower() or "password" in flag["reason"].lower():
                final_score = max(final_score, 82)
        elif flag["severity"] == "critical":
            final_score = max(final_score, 60)

    # ─── Blend link analysis score ──────────────────────────
    if link_results and len(link_results) > 0:
        max_link_score = max(l["risk_score"] for l in link_results)
        has_suspicious = any(l["risk_level"] != "Safe" for l in link_results)
        if has_suspicious and max_link_score > 0:
            final_score = round(final_score * 0.7 + max_link_score * 0.3)
            final_score = max(final_score, rule_score)
        if has_suspicious and "Suspicious Link Detected" not in tactics:
            tactics.append("Suspicious Link Detected")

    # Deduplicate flagged messages
    seen = set()
    all_flags = []
    for m in rule_flags + llm_flags:
        key = m.get("text", "") + m.get("reason", "")
        if key not in seen:
            seen.add(key)
            all_flags.append(m)

    risk_level = get_risk_level(final_score, confidence_threshold)

    return {
        "risk_score": final_score,
        "risk_level": risk_level,
        "category": category,
        "tactics": tactics,
        "flagged_messages": all_flags,
        "explanation": explanation,
        "recommendations": recommendations,
        "is_fallback": is_fallback,
        "confidence": round(confidence, 2),
        "link_analysis": link_results if link_results else None,
    }
