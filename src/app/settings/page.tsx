// src/app/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function SettingsPage() {
  const { status } = useSession();
  const [webhook, setWebhook] = useState('');
  const [prompt, setPrompt] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // If not signed in, send them to the sign-in page
  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  // Once authenticated, load existing settings
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch('/api/settings')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setWebhook(data.webhookUrl ?? '');
        setPrompt(data.systemPrompt ?? '');
      })
      .catch(() => {
        // you could show an error here
      });
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl: webhook, systemPrompt: prompt }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (status !== 'authenticated') {
    return <p className="p-4">Redirecting to sign in…</p>;
  }

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
          disabled={saving}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">System Prompt</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="You are a helpful assistant…"
          className="w-full p-2 border rounded h-24"
          disabled={saving}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Settings'}
      </button>

      {saved && <p className="text-green-700">Settings saved!</p>}
    </div>
  );
}
