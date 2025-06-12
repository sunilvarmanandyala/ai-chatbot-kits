import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface RequestBody {
  messages: { role: string; text: string }[];
  webhookUrl?: string | null;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    if (!Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid payload: messages must be an array' },
        { status: 400 }
      );
    }

    // Prepare messages for OpenAI
    const chatMessages: ChatCompletionMessageParam[] = body.messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    // Call OpenAI Chat API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: chatMessages,
    });
    const reply = completion.choices[0].message?.content ?? '';

    // Forward to user-configured Zapier webhook if present
    if (body.webhookUrl) {
      const lastUser = body.messages.find(m => m.role === 'user');
      if (lastUser) {
        await fetch(body.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userMessage: lastUser.text,
            botReply: reply,
            timestamp: new Date().toISOString(),
          }),
        });
      }
    }

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error('API Error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
