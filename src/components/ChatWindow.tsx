'use client';

import { useState, useEffect } from 'react';
import { event } from '@/lib/gtag';

type Message = { role: string; text: string };

export default function ChatWindow( {
  config,
}: {
  config?: {
    webhookUrl?: string;
    systemPrompt?: string;
  };
} ) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Settings from localStorage
  const [webhookUrl, setWebhookUrl] = useState<string | null>(config?.webhookUrl ?? null);
  const [systemPrompt, setSystemPrompt] = useState<string | null>(config?.systemPrompt ?? null);

  useEffect(() => {
    if (!config) {
    setWebhookUrl(localStorage.getItem('webhookUrl'));
    setSystemPrompt(localStorage.getItem('systemPrompt'));
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Analytics event
    event({
      action: 'send_message',
      category: 'chat',
      label: input.length > 50 ? input.slice(0, 50) + '…' : input,
      value: input.length,
    });

    // Prepend system prompt if configured
    const initialMessages: Message[] = systemPrompt
      ? [{ role: 'bot', text: systemPrompt }]
      : [];
    const newMsg: Message = { role: 'user', text: input };
    const updated = [...initialMessages, ...messages, newMsg];

    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, webhookUrl }),
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error || res.statusText);
      }

      setMessages(prev => [...prev, { role: 'bot', text: payload.reply }]);
    } catch (e) {
      console.error('Fetch error:', e);
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-2xl shadow-lg bg-white flex flex-col">
      <div className="flex-1 h-80 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-sm ${
              msg.role === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-2 italic bg-gray-200 rounded-lg text-sm">
            …typing
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
