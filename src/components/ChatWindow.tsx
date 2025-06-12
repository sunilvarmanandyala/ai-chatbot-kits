// src/components/ChatWindow.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { event } from '@/lib/gtag';

type Message = { role: string; text: string };

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hi! How can I help you today?' },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [webhookUrl, setWebhookUrl] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);

  // Load per-user settings from the API
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setWebhookUrl(data.webhookUrl);
        setSystemPrompt(data.systemPrompt);
      })
      .catch(() => {
        // ignore fetch errors
      });
  }, []);

  const handleSend = async (): Promise<void> => {
    if (!input.trim()) return;

    // Fire a GA4 custom event
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
    const userMsg: Message = { role: 'user', text: input };
    const updatedMessages = [...initialMessages, ...messages, userMsg];

    setMessages(updatedMessages as Message[]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, webhookUrl }),
      });
      const { reply } = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch {
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
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-lg text-sm ${
              m.role === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100'
            }`}
          >
            {m.text}
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
