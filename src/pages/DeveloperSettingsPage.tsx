import { useSettings } from '../hooks/useSettings';
import { DeveloperSettings } from '../components/settings/DeveloperSettings';

export function DeveloperSettingsPage() {
  const { settings, saveSettings, loading } = useSettings();

  if (loading) {
    return (
      <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-32 bg-scam-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        <DeveloperSettings settings={settings} onSave={saveSettings} />
      </div>
    </section>
  );
}
