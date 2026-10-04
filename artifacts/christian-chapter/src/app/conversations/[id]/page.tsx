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
  const [selected, setSelected] = useState<string[]>([]);
  const [reported, setReported] = useState(false);

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

  async function report() {
    if (selected.length === 0) {
      setError("Select the messages you want to report.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/conversations/${params.id}/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageIds: selected }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(json.error ?? "That report could not be saved.");
      setBusy(false);
      return;
    }
    setReported(true);
    setBusy(false);
  }

  return (
    <section className="section bg-ivory">
      <div className="mx-auto max-w-2xl px-6">
        <a href="/conversations" className="text-[14px] text-plum-muted underline underline-offset-4">
          All conversations
        </a>
        <h1 className="font-serif text-plum mt-4 mb-3">Conversation</h1>
        <p className="mb-6 text-[14px] leading-6 text-plum-muted">
          Messages are deleted seven days after they are first read, or 30 days after sending if unread.
          A message you select below can be kept for 90 days if you report it.
        </p>
        {error && <p className="text-oxblood mb-4">{error}</p>}
        <ul className="space-y-3 mb-8">
          {messages?.map((message) => (
            <li
              key={message.id}
              className={`max-w-[80%] rounded-md px-4 py-3 text-[15px] ${
                message.mine ? "ml-auto bg-life text-paper" : "bg-paper text-plum border border-border"
              }`}
            >
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selected.includes(message.id)}
                  onChange={(event) => {
                    setSelected((current) =>
                      event.target.checked ? [...current, message.id] : current.filter((id) => id !== message.id),
                    );
                  }}
                />
                <span>{message.body}</span>
              </label>
            </li>
          ))}
        </ul>
        {reported ? (
          <p className="text-plum">The selected messages were saved for review, and this conversation is closed.</p>
        ) : (
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
          <button type="button" disabled={busy || selected.length === 0} onClick={report} className="min-h-[48px] px-5 rounded-md border border-border text-plum disabled:opacity-50">
            Report
          </button>
        </form>
        )}
      </div>
    </section>
  );
}
