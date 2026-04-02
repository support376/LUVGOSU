"use client";

import { useState, useRef, useEffect } from "react";
import type { Coordinate, ChatMessage, Situation } from "@/lib/types";

interface Props {
  coordinate: Coordinate;
  situation: Situation;
  onComplete: (messages: ChatMessage[]) => void;
}

const MAX_TURNS = 10; // 상대 5회 + 유저 5회

export default function ChatUI({ coordinate, situation, onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 시뮬레이션 시작 — 상대방 첫 메시지
  const startSimulation = async () => {
    setStarted(true);
    const firstMsg: ChatMessage = {
      role: "opponent",
      content: situation.opponentFirstMessage,
      turn: 1,
    };
    setMessages([firstMsg]);
    setTurnCount(1);
  };

  // 유저 메시지 전송
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userTurn = turnCount + 1;
    const userMsg: ChatMessage = {
      role: "user",
      content: input.trim(),
      turn: userTurn,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setTurnCount(userTurn);

    // 10턴 도달 시 완료
    if (userTurn >= MAX_TURNS) {
      onComplete(newMessages);
      return;
    }

    // AI 응답 요청
    setLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinate,
          situationId: situation.id,
          messages: newMessages,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        const opponentTurn = userTurn + 1;
        const opponentMsg: ChatMessage = {
          role: "opponent",
          content: data.reply,
          turn: opponentTurn,
        };
        setMessages((prev) => [...prev, opponentMsg]);
        setTurnCount(opponentTurn);

        // 상대방 응답 후 10턴이면 완료
        if (opponentTurn >= MAX_TURNS) {
          onComplete([...newMessages, opponentMsg]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "system", content: "오류가 발생했습니다. 다시 시도해주세요.", turn: userTurn },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const userTurnsDone = messages.filter((m) => m.role === "user").length;
  const progress = Math.min((turnCount / MAX_TURNS) * 100, 100);

  return (
    <div className="flex flex-col h-full">
      {/* 상황 브리핑 헤더 */}
      <div className="bg-card border-b border-card-border p-4">
        <div className="text-sm text-muted mb-1">{situation.category}</div>
        <div className="font-medium">{situation.title}</div>
        <div className="text-xs text-muted mt-1">{situation.emotionalContext}</div>
        {/* 턴 프로그레스 */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted mb-1">
            <span>턴 {turnCount}/{MAX_TURNS}</span>
            <span>내 응답 {userTurnsDone}/5</span>
          </div>
          <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 시작 전 */}
      {!started && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-6 max-w-sm text-center">
            <div className="text-lg font-medium mb-3">상황 브리핑</div>
            <p className="text-sm text-muted mb-2">{situation.setup}</p>
            <p className="text-xs text-accent-light">{situation.emotionalContext}</p>
          </div>
          <button
            onClick={startSimulation}
            className="px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent-light transition-colors"
          >
            시뮬레이션 시작
          </button>
        </div>
      )}

      {/* 채팅 메시지 영역 */}
      {started && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-accent text-white rounded-br-md"
                      : msg.role === "opponent"
                        ? "bg-card border border-card-border rounded-bl-md"
                        : "bg-red-900/30 text-red-300 text-xs text-center w-full"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-card border border-card-border rounded-2xl rounded-bl-md px-4 py-2.5">
                  <span className="animate-pulse text-muted">입력 중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력 영역 */}
          <div className="border-t border-card-border p-4">
            {turnCount >= MAX_TURNS ? (
              <div className="text-center text-sm text-muted">
                대화가 종료되었습니다. 채점 중...
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="메시지를 입력하세요..."
                  disabled={loading}
                  className="flex-1 bg-card border border-card-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="px-5 py-2.5 bg-accent text-white rounded-full text-sm font-medium disabled:opacity-50 hover:bg-accent-light transition-colors"
                >
                  전송
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
