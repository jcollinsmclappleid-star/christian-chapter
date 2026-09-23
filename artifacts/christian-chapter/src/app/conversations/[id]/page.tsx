"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Message = {
  id: string;
  body: string;
  mine: boolean;
  createdAt: string;
};

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/conversations/${params.id}`);
    if (res.status === 401) {
      window.location.href = `/sign-in?next=/conversations/${params.id}`;
      return;
    }
    if (!res.ok) {
      setError("This conversation is not available.");
      return;
    }
    const json = await res.json();
    setMessages(json.messages ?? []);
  }

  useEffect(() => {
    load().catch(() => setError("This conversation is not available."));
  }, [params.id]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/conversations/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "That message could not be sent.");
      setBusy(false);
      return;
    }
    setBody("");
    setMessages((current) => [...(current ?? []), json]);
    setBusy(false);
  }

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-2xl px-6">
        <a href="/conversations" className="text-[14px] text-plum-muted underline underline-offset-4">
          All conversations
        </a>
        <h1 className="font-serif text-plum mt-4 mb-6">Conversation</h1>
        {error && <p className="text-oxblood mb-4">{error}</p>}
        <ul className="space-y-3 mb-8">
          {messages?.map((message) => (
            <li
              key={message.id}
              className={`max-w-[80%] rounded-md px-4 py-3 text-[15px] ${
                message.mine ? "ml-auto bg-life text-paper" : "bg-paper text-plum border border-border"
              }`}
            >
              {message.body}
            </li>
          ))}
        </ul>
        <form onSubmit={send} className="flex gap-3">
          <input
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write a message"
            className="min-h-[48px] flex-1 rounded-md border border-border bg-paper px-4"
          />
          <button type="submit" disabled={busy || !body.trim()} className="min-h-[48px] px-5 rounded-md bg-oxblood text-ivory disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
