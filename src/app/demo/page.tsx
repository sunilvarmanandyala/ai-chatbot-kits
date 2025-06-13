// src/app/demo/page.tsx
'use client';

import ChatWindow from "@/components/ChatWindow";

export default function DemoEmbedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
      <h1 className="text-2xl font-bold">Widget Embed Demo</h1>
      <ChatWindow />

      {/* Optionally create the container div */}
      <div id="demo-chat" />

      {/* This script will load your widget and mount into #demo-chat */}
      <script
        src="/widget.js"
        data-container="demo-chat"
        data-webhook="https://hooks.zapier.com/hooks/catch/XXX/YYY/"
        data-prompt="You are a friendly assistant that helps with support questions."
      ></script>
    </main>
  );
}
