import ChatWindow from '@/components/ChatWindow';

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <ChatWindow />
      <script
        src="/widget.js"
        data-container="demo-chat"
        data-webhook="https://hooks.zapier.com/hooks/catch/XXX/YYY"
        data-prompt="You are a super-helpful assistant!"
      ></script>
      {/* The widget will mount into <div id="demo-chat"> automatically */}
    </main>
    
  );
}
