export interface LinkCheck {
  name: string;
  passed: boolean;
  detail: string;
}

export interface LinkAnalysis {
  url: string;
  domain: string;
  risk_score: number;
  risk_level: 'Safe' | 'Suspicious' | 'Likely Malicious';
  is_shortened: boolean;
  checks: LinkCheck[];
}

export interface AnalysisResult {
  risk_score: number;
  risk_level: 'Safe' | 'Likely Safe' | 'Suspicious' | 'High Risk';
  category: string;
  tactics: string[];
  flagged_messages: FlaggedMessage[];
  explanation: string;
  recommendations: string[];
  is_fallback?: boolean;
  confidence?: number;
  link_analysis?: LinkAnalysis[];
}

export interface FlaggedMessage {
  text: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'safe_context';
}

export interface Report extends AnalysisResult {
  id: number;
  conversation: string;
  created_at: string;
}

export interface DeveloperSettings {
  provider: string;
  api_key: string;
  selected_model: string;
  detection_mode: 'fast' | 'balanced' | 'deep';
  confidence_threshold: number;
  custom_prompt: string;
}

export interface DashboardStats {
  total_analyses: number;
  safe_count: number;
  suspicious_count: number;
  high_risk_count: number;
  recent_analyses: Report[];
}

export type TabType = 'email' | 'chat';
export type AnalysisStatus = 'idle' | 'analyzing' | 'complete' | 'error';


