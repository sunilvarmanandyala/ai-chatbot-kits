'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [webhook, setWebhook] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saved, setSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const w = localStorage.getItem('webhookUrl') || '';
    const p = localStorage.getItem('systemPrompt') || '';
    setWebhook(w);
    setSystemPrompt(p);
  }, []);

  const handleSave = () => {
    localStorage.setItem('webhookUrl', webhook.trim());
    localStorage.setItem('systemPrompt', systemPrompt.trim());
    setSaved(true);
    // Refresh ChatWindow if you’re on the main page:
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div>
        <label className="block mb-1 font-medium">Zapier Webhook URL</label>
        <input
          type="url"
          value={webhook}
          onChange={e => setWebhook(e.target.value)}
          placeholder="https://hooks.zapier.com/…"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">System Prompt</label>
        <textarea
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          placeholder="You are a helpful assistant…"
          className="w-full p-2 border rounded h-24"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Settings
      </button>

      {saved && <p className="text-green-700">Settings saved!</p>}
    </div>
  );
}
