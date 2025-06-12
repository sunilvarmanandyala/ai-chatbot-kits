// src/app/page.tsx
import ChatWindow from '@/components/ChatWindow';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect('/api/auth/signin');

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.name || 'User'}!
      </h1> 
      <ChatWindow />
    </div>
  );
}
