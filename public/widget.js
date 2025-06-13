import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatWindow from '../src/components/ChatWindow';

function loadWidget() {
  const script = document.currentScript;
  const containerId = script.getAttribute('data-container') || 'ai-chatbot';
  const webhook     = script.getAttribute('data-webhook');
  const prompt      = script.getAttribute('data-prompt');

  // Ensure a mounting point exists
  let el = document.getElementById(containerId);
  if (!el) {
    el = document.createElement('div');
    el.id = containerId;
    script.parentNode.insertBefore(el, script.nextSibling);
  }

  const root = createRoot(el);
  root.render(
    <ChatWindow
      config={{
        webhookUrl: webhook || undefined,
        systemPrompt: prompt || undefined
      }}
    />
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadWidget);
} else {
  loadWidget();
}
