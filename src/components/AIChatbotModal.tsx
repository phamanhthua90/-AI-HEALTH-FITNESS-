import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Minimize2,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, UserProfile, ProfileMetrics } from '../types';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  metrics: ProfileMetrics;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({
  isOpen,
  onClose,
  profile,
  metrics,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Xin chào ${profile.fullName}! Tôi là AI Health & Fitness Coach – Trợ lý sống khỏe cá nhân của bạn.

Tôi có thể giúp bạn:
• Tư vấn thực đơn thay thế theo nguyên liệu có sẵn
• Hướng dẫn chuẩn form các bài tập (Squat, Push-up, Lunge)
• Giải thích chỉ số TDEE, BMR và thâm hụt calo an toàn
• Bữa ăn nhẹ trước và sau buổi tập luyện

Hôm nay bạn cần giải đáp thắc mắc gì?`,
      timestamp: 'Ngay bây giờ',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Tư vấn bữa ăn nhẹ trước khi tập 30 phút?',
    'Đau gối nhẹ nên thay Squat bằng bài gì?',
    'Bí quyết uống đủ 2 - 2.5 lít nước mỗi ngày?',
    'Giải thích TDEE và cách thâm hụt calo an toàn?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            fullName: profile.fullName,
            age: profile.age,
            gender: profile.gender,
            goal: profile.goal,
            targetCalories: metrics.targetCalories,
            tdee: metrics.tdee,
            bmi: metrics.bmi,
            allergies: profile.allergies,
            dislikedFoods: profile.dislikedFoods,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Cảm ơn bạn đã đặt câu hỏi. Tôi luôn sẵn sàng hỗ trợ!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        fallbackChatResponse(messageContent);
      }
    } catch (err) {
      console.warn('Chat request failed, using local fallback:', err);
      fallbackChatResponse(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackChatResponse = (text: string) => {
    const lower = text.toLowerCase();
    let reply = `Chào bạn! Đối với câu hỏi về "${text}", hãy đảm bảo ăn đủ đạm (khoảng ${metrics.macros.protein}g/ngày) và giữ mức thâm hụt calo an toàn quanh ${metrics.targetCalories} kcal/ngày. Nếu bạn có bất kỳ cảm giác mệt mỏi hay đau cơ khớp kéo dài, hãy điều chỉnh giảm tải và lắng nghe cơ thể nhé!`;

    if (lower.includes('trước khi tập') || lower.includes('bữa ăn nhẹ')) {
      reply = `**Gợi ý bữa ăn nhẹ trước tập 30 - 45 phút:**\n\n1. **1 quả chuối chín + 1 thìa bơ đậu phộng**: Cung cấp carbohydrate hấp thu nhanh và kali chống chuột rút.\n2. **1 lát bánh mì nguyên cám + 1 quả trứng luộc lòng đào**.\n3. **1 hộp sữa chua không đường + 1 nắm nhỏ yến mạch**.\n\n*Tránh thức ăn nhiều dầu mỡ gây đầy bụng khi vận động.*`;
    } else if (lower.includes('đau gối') || lower.includes('squat')) {
      reply = `**Khi bị mỏi hoặc đau khớp gối nhẹ:**\n\n- Tạm thời thay thế Squat bằng: **Glute Bridge (Nâng hông sàn)**, **Step-ups thấp**, hoặc **Wall Sit (Tựa lưng vào tường)**.\n- Tập trung tăng sức mạnh cơ mông và đùi sau để giảm áp lực dồn lên khớp gối.\n- Nếu đau nhói kéo dài, bạn cần tạm dừng và tham khảo ý kiến bác sĩ chuyên khoa chấn thương chỉnh hình!`;
    } else if (lower.includes('nước') || lower.includes('uống nước')) {
      reply = `**Bí quyết uống đủ ${metrics.waterLiters} lít nước mỗi ngày:**\n\n- Uống 1 ly nước ấm (300ml) ngay sau khi thức dậy.\n- Chia chai nước 1L làm mốc: uống hết 1 chai trước giờ trưa, 1 chai trước buổi tối.\n- Uống từng ngụm nhỏ rải rác trong ngày, không đợi đến khi khát khô cổ mới uống dồn dập.`;
    } else if (lower.includes('tdee') || lower.includes('thâm hụt')) {
      reply = `**Chỉ số TDEE & Thâm hụt calo an toàn:**\n\n- TDEE của bạn hiện tại là **${metrics.tdee} kcal**.\n- Để ${profile.goal.toLowerCase()} hiệu quả, mức nạp khuyến nghị là **${metrics.targetCalories} kcal/ngày** (thâm hụt khoảng 450 kcal).\n- Mức này vừa giúp giảm mỡ vừa không làm giảm sút cơ bắp hay ảnh hưởng tới trao đổi chất.`;
    }

    const aiMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-restart',
        role: 'assistant',
        content: `Đã làm mới cuộc hội thoại. Hãy hỏi tôi bất cứ điều gì về dinh dưỡng hoặc tập luyện của bạn nhé!`,
        timestamp: 'Ngay bây giờ',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[420px] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Top Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-emerald-300 border border-white/15">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">AI Health Coach</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-emerald-200">Trợ lý đồng hành 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearHistory}
            title="Làm mới đoạn hội thoại"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            title="Đóng cửa sổ chat"
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition shrink-0 cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line">{m.content}</div>
                <div
                  className={`text-[10px] mt-1 text-right ${
                    isUser ? 'text-emerald-200' : 'text-slate-600'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  Bạn
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            <span>AI Coach đang suy nghĩ và tổng hợp thông tin...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi cho trợ lý AI..."
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition disabled:opacity-50 cursor-pointer flex items-center gap-1 shadow-xs"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Gửi</span>
        </button>
      </form>
    </div>
  );
};
