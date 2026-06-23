import { useState, useEffect, useCallback } from 'react';
import type { DeveloperSettings } from '../types';
import { api } from '../services/api';

const DEFAULT_SETTINGS: DeveloperSettings = {
  provider: 'groq',
  api_key: '',
  selected_model: 'llama-3.3-70b-versatile',
  detection_mode: 'balanced',
  confidence_threshold: 70,
  custom_prompt: 'You are an expert cybersecurity analyst specializing in scam detection. Analyze conversations and return risk score, scam category, scam tactics, flagged messages, explanation, and prevention advice.',
};

export function useSettings() {
  const [settings, setSettings] = useState<DeveloperSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(() => {
        const stored = localStorage.getItem('scamshield_settings');
        if (stored) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = useCallback(async (partial: Partial<DeveloperSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    localStorage.setItem('scamshield_settings', JSON.stringify(updated));
    try {
      const server = await api.saveSettings(partial);
      setSettings((prev) => ({ ...prev, ...server }));
    } catch {
      // saved locally as fallback
    }
  }, [settings]);

  return { settings, saveSettings, loading };
}
