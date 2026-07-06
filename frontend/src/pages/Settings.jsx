import { useEffect, useState } from 'react';
import { Bell, Moon, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export default function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('taskflow_settings')) || { darkMode: false, reminders: true, weeklySummary: true };
    } catch {
      return { darkMode: false, reminders: true, weeklySummary: true };
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode);
  }, [settings.darkMode]);

  function updateSetting(key) {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  }

  function saveSettings() {
    localStorage.setItem('taskflow_settings', JSON.stringify(settings));
    showToast('Settings saved.', 'success');
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Tune workspace preferences for focus and notifications.</p>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {[
            ['darkMode', 'Dark mode', 'Use a darker interface preference.', Moon],
            ['reminders', 'Due-date reminders', 'Receive reminders before tasks are due.', Bell],
            ['weeklySummary', 'Weekly summary', 'Get a weekly productivity digest.', Bell]
          ].map(([key, title, description, Icon]) => (
            <label key={key} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
              <span className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-indigo-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{title}</span>
                  <span className="block text-sm text-slate-500">{description}</span>
                </span>
              </span>
              <input className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={settings[key]} onChange={() => updateSetting(key)} type="checkbox" />
            </label>
          ))}
        </div>
        <button className="mt-6 inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700" onClick={saveSettings} type="button">
          <Save className="h-4 w-4" />
          Save settings
        </button>
      </section>
    </section>
  );
}
