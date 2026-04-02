"use client";

import { useState, useRef, useEffect } from "react";
import type { Coordinate, ChatMessage, Situation, GoalId } from "@/lib/types";
import { GOALS } from "@/lib/data";

interface Props {
  coordinate: Coordinate;
  situation: Situation;
  goal: GoalId;
  onComplete: (messages: ChatMessage[]) => void;
}

const MAX_TURNS = 10;

function getTimeString() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, "0");
  const period = h < 12 ? "오전" : "오후";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${period} ${hour}:${m}`;
}

export default function ChatUI({ coordinate, situation, goal, onComplete }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const goalData = GOALS.find((g) => g.id === goal) || GOALS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    if (userTurn >= MAX_TURNS) {
      onComplete(newMessages);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinate,
          situationId: situation.id,
          goal,
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
      {/* 카카오톡 헤더 */}
      <div className="bg-kakao-header text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => window.location.href = "/"}
          className="text-white/70 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5 flex-1">
          {/* 프로필 */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-base">
            😠
          </div>
          <div>
            <div className="font-medium text-sm leading-tight">상대방</div>
            <div className="text-[10px] text-white/50">
              ({coordinate.x},{coordinate.y}) · {goalData.emoji} {goalData.name}
            </div>
          </div>
        </div>
        {/* 턴 표시 */}
        <div className="text-xs text-white/60">
          {turnCount}/{MAX_TURNS}턴
        </div>
      </div>

      {/* 턴 프로그레스 바 */}
      <div className="h-0.5 bg-kakao-header">
        <div
          className="h-full bg-kakao-yellow transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 시작 전 브리핑 */}
      {!started && (
        <div className="flex-1 bg-kakao-bg flex flex-col items-center justify-center p-6 space-y-4">
          {/* 상황 카드 */}
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-sm">
            <div className="text-center mb-4">
              <div className="text-xs text-kakao-time mb-1">{situation.category}</div>
              <div className="text-lg font-bold text-kakao-text">{situation.title}</div>
            </div>
            <div className="space-y-3 text-sm text-kakao-text/80">
              <p>{situation.setup}</p>
              <p className="text-xs text-kakao-time">{situation.emotionalContext}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm">
                <span>{goalData.emoji}</span>
                <span className="text-kakao-text font-medium">{goalData.name}</span>
                <span className="text-kakao-time text-xs">— {goalData.description}</span>
              </div>
            </div>
          </div>
          <button
            onClick={startSimulation}
            className="px-8 py-3 bg-kakao-yellow text-kakao-text rounded-full font-bold text-sm shadow-sm hover:brightness-95 transition"
          >
            대화 시작
          </button>
        </div>
      )}

      {/* 채팅 영역 */}
      {started && (
        <>
          <div className="flex-1 overflow-y-auto bg-kakao-bg px-4 py-3 space-y-2">
            {/* 날짜 구분선 */}
            <div className="flex justify-center mb-3">
              <span className="text-[11px] text-kakao-time bg-black/10 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
              </span>
            </div>

            {/* 상황 안내 */}
            <div className="flex justify-center mb-2">
              <span className="text-[11px] text-kakao-time bg-black/10 px-3 py-1 rounded-full">
                {situation.title} · {goalData.emoji} {goalData.name} 모드
              </span>
            </div>

            {messages.map((msg, i) => {
              if (msg.role === "system") {
                return (
                  <div key={i} className="flex justify-center">
                    <span className="text-[11px] text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              if (msg.role === "opponent") {
                return (
                  <div key={i} className="flex items-start gap-2">
                    {/* 프로필 */}
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg shrink-0">
                      😠
                    </div>
                    <div>
                      <div className="text-[11px] text-kakao-text/60 mb-1 ml-1">상대방</div>
                      <div className="flex items-end gap-1.5">
                        <div className="relative bg-white text-kakao-text rounded-2xl rounded-tl-sm px-3 py-2 text-[13px] leading-relaxed shadow-sm max-w-[240px] bubble-left">
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-kakao-time shrink-0 mb-0.5">{getTimeString()}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              // 유저 메시지
              return (
                <div key={i} className="flex justify-end items-end gap-1.5">
                  <span className="text-[10px] text-kakao-time shrink-0 mb-0.5">{getTimeString()}</span>
                  <div className="relative bg-kakao-yellow text-kakao-text rounded-2xl rounded-tr-sm px-3 py-2 text-[13px] leading-relaxed shadow-sm max-w-[240px] bubble-right">
                    {msg.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg shrink-0">
                  😠
                </div>
                <div>
                  <div className="text-[11px] text-kakao-text/60 mb-1 ml-1">상대방</div>
                  <div className="bg-white text-kakao-text rounded-2xl rounded-tl-sm px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-kakao-time/40 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="w-1.5 h-1.5 bg-kakao-time/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <div className="w-1.5 h-1.5 bg-kakao-time/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 카카오톡 입력바 */}
          <div className="bg-white border-t border-kakao-input-border px-3 py-2">
            {turnCount >= MAX_TURNS ? (
              <div className="text-center text-xs text-kakao-time py-2">
                대화가 종료되었습니다. 채점 중...
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 border border-kakao-input-border">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="메시지를 입력하세요"
                    disabled={loading}
                    className="w-full bg-transparent text-kakao-text text-[13px] focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-kakao-yellow rounded-full flex items-center justify-center shrink-0 disabled:opacity-30 hover:brightness-95 transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-kakao-text">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
            {/* 남은 턴 표시 */}
            {turnCount < MAX_TURNS && (
              <div className="text-center mt-1.5">
                <span className="text-[10px] text-kakao-time">
                  내 응답 {userTurnsDone}/5
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
