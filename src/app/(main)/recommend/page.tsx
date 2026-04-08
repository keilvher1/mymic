'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Music, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { QUICK_SITUATIONS } from '@/lib/constants';
import type { ChatMessage } from '@/types';

export default function RecommendPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '안녕하세요! 🎤 저는 마이마이크 AI예요.\n\n오늘 노래방에서 어떤 분위기를 원하시나요? 상황을 알려주시면 딱 맞는 곡을 추천해드릴게요!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ situation: text }),
      });

      if (res.ok) {
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            assistantContent += decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id ? { ...m, content: assistantContent } : m
              )
            );
          }
        }
      } else {
        // 데모 모드: API 미연결 시 고정 응답
        const demoResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `좋아요! "${text}" 느낌이시군요 🎶\n\n지금 분위기에 딱 맞는 곡들을 추천해드릴게요!\n\n🎵 **Hype Boy - NewJeans**\n   추천 이유: 신나고 트렌디한 곡! 분위기 띄우기 최고\n   팁: 후렴구 안무 포인트 넣으면 더 재밌어요\n   📍 TJ 50713 | KY 95478\n\n🎵 **Seven - 정국 (Jung Kook)**\n   추천 이유: 누구나 따라 부르기 쉽고 인기곡!\n   팁: 영어 파트 자연스럽게 불러보세요\n   📍 TJ 50589 | KY 95302\n\n🎵 **SPOT! - ZICO (feat. JENNIE)**\n   추천 이유: 요즘 핫한 곡! 다 같이 부르기 좋아요\n   팁: 제니 파트는 친구와 듀엣으로!\n   📍 TJ 51500 | KY 96100\n\n🎵 **사건의 지평선 - 윤하**\n   추천 이유: 시원하게 고음 지르기 좋은 명곡\n   팁: 마지막 고음은 무리하지 마세요 😂\n   📍 TJ 49825 | KY 93100\n\n🎵 **Love Lee - AKMU**\n   추천 이유: 새로 추가해볼 만한 감성 곡!\n   팁: 부드러운 톤으로 불러보세요\n   📍 TJ 50901 | KY 95600\n\n마음에 드는 곡이 있나요? 더 추천해드릴 수도 있어요! 🎤`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, demoResponse]);
      }
    } catch (error) {
      const demoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `좋아요! "${text}" 느낌이시군요 🎶\n\n🎵 **Hype Boy - NewJeans**\n   추천 이유: 신나고 트렌디한 곡!\n   📍 TJ 50713 | KY 95478\n\n🎵 **Seven - 정국**\n   추천 이유: 분위기 띄우기 좋은 곡!\n   📍 TJ 50589 | KY 95302\n\n🎵 **사건의 지평선 - 윤하**\n   추천 이유: 시원하게 지르기 좋은 명곡!\n   📍 TJ 49825 | KY 93100\n\n더 추천해드릴까요? 🎤`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, demoResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen pt-12">
      {/* 헤더 */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-neon flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg">MYMIC AI</h1>
            <p className="text-[10px] text-gray-500">당신의 노래방 DJ</p>
          </div>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'mb-4 animate-fade-in',
              msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'card-neon rounded-bl-sm'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="card-neon rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={16} className="text-primary animate-spin" />
              <span className="text-sm text-gray-400">추천 중...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 빠른 상황 태그 */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_SITUATIONS.map((sit) => (
              <button
                key={sit.label}
                onClick={() => sendMessage(sit.prompt)}
                className="tag-chip flex-shrink-0 text-xs"
              >
                {sit.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="px-4 pb-24 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="어떤 분위기? 상황을 말해주세요..."
            className="input-dark flex-1 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className={cn(
              'p-3 rounded-xl transition-all duration-200',
              input.trim() && !isLoading
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-surface-light text-gray-600'
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
