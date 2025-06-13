'use client';

import ChatWindow from '@/components/ChatWindow';
import Script from 'next/script';

export default function DemoEmbedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6">
      <h1 className="text-2xl font-bold">Widget Embed Demo</h1>
      <ChatWindow />


      {/* Container for the widget */}
      <div id="demo-chat" />

      {/* Use Next.js’s Script component */}
      <Script
        src="/widget.js"
        strategy="afterInteractive"
        data-container="demo-chat"
        data-webhook="https://hooks.zapier.com/hooks/catch/XXX/YYY/"
        data-prompt="You are a friendly assistant that helps with support questions."
      />
    </main>
  );
}
