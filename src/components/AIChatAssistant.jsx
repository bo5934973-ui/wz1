import React, { useMemo, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteKnowledge } from "../data/siteKnowledge.js";

const CHAT_FUNCTION_PATH = "/.netlify/functions/chat";
const starterPrompts = ["你擅长哪些设计？", "帮我想个海报方向", "怎么合作？"];

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "你好，我是 Jason 个人网站智能助理。可以向我了解 Jason 的设计服务，也可以问我设计、品牌、视觉和作品集相关问题。"
    }
  ]);
  const inputRef = useRef(null);

  const apiMessages = useMemo(
    () =>
      messages
        .filter((message) => ["user", "assistant"].includes(message.role))
        .map(({ role, content }) => ({ role, content })),
    [messages]
  );

  const sendMessage = async (text = input) => {
    const content = text.trim();
    if (!content || isLoading) return;

    const nextMessages = [...apiMessages, { role: "user", content }];
    setMessages((current) => [...current, { role: "user", content }]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_FUNCTION_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "聊天服务暂时不可用。");
      }
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.answer || siteKnowledge.fallback }
      ]);
    } catch (requestError) {
      setError(requestError.message || "聊天服务暂时不可用。");
    } finally {
      setIsLoading(false);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass mb-3 flex h-[min(74vh,620px)] w-[min(calc(100vw-2rem),390px)] flex-col overflow-hidden rounded-[1.6rem] shadow-soft"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/45 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white shadow-sm">
                  <Bot size={19} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{siteKnowledge.assistantName}</p>
                  <p className="text-xs text-mute">基于网站资料回答</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/68 text-ink transition hover:bg-white"
                aria-label="关闭 AI 助手"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <p
                    className={`max-w-[86%] whitespace-pre-wrap rounded-[1.1rem] px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-ink text-white"
                        : "border border-white/60 bg-white/72 text-ink"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-[1.1rem] border border-white/60 bg-white/72 px-4 py-3 text-sm text-mute">
                    <Loader2 className="animate-spin" size={16} />
                    正在整理网站资料...
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-[1.1rem] border border-red-200 bg-red-50/88 px-4 py-3 text-sm leading-6 text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="border-t border-white/45 p-3">
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    className="shrink-0 rounded-full border border-white/65 bg-white/66 px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-white disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="问问 Jason 的设计服务..."
                  className="max-h-28 min-h-11 flex-1 resize-none rounded-[1.1rem] border border-white/70 bg-white/78 px-4 py-3 text-sm leading-5 text-ink outline-none transition placeholder:text-mute focus:border-ink/35 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="发送消息"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="liquid-glass group flex h-14 items-center gap-3 rounded-full px-4 text-ink shadow-soft ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-white/82"
        aria-label="打开 Jason 个人网站智能助理"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
          {isOpen ? <X size={18} /> : <MessageCircle size={18} />}
        </span>
        <span className="hidden pr-1 text-sm font-semibold sm:inline-flex">
          AI 助手
        </span>
        <Sparkles className="hidden text-mute transition group-hover:text-ink sm:block" size={16} />
      </button>
    </div>
  );
}
