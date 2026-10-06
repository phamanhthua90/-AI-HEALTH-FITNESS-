import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Download,
  Info,
  Scale,
  Flame,
  Droplets,
  Target,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, UserProfile, ProfileMetrics } from '../types';

interface AIChatbotFullViewProps {
  profile: UserProfile;
  metrics: ProfileMetrics;
  onNavigate: (tabId: string) => void;
}

export const AIChatbotFullView: React.FC<AIChatbotFullViewProps> = ({
  profile,
  metrics,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Xin chào **${profile.fullName}**! Tôi là **AI Health & Fitness Coach** – trợ lý trí tuệ nhân tạo chuyên sâu về dinh dưỡng cá nhân hóa và huấn luyện thể chất khoa học.

Tôi đã đồng bộ toàn bộ dữ liệu hồ sơ của bạn:
• **Mục tiêu:** ${profile.goal}
• **Năng lượng đích:** ${metrics.targetCalories} kcal/ngày (TDEE: ${metrics.tdee} kcal)
• **Lịch tập:** ${profile.workoutDaysPerWeek} buổi/tuần (${profile.workoutDuration} phút/buổi)
• **Đa lượng mục tiêu:** ${metrics.macros.protein}g Đạm · ${metrics.macros.carb}g Carb · ${metrics.macros.fat}g Béo
• **Nước uống:** Tối thiểu ${metrics.waterLiters} lít/ngày

Bạn có thắc mắc gì về thực đơn hôm nay, kỹ thuật bài tập hay cách điều chỉnh calo không? Hãy hỏi tôi nhé!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const topicCategories = [
    {
      title: '🍱 Dinh dưỡng & Thực đơn',
      questions: [
        'Gợi ý bữa ăn nhẹ trước khi tập 30 - 45 phút?',
        'Cách tăng đủ lượng đạm (protein) mà không bị đầy bụng?',
        'Đi ăn tiệc ngoài hàng thì nên chọn món thế nào để không lố calo?',
      ],
    },
    {
      title: '🏋️ Kỹ thuật & Tập luyện',
      questions: [
        'Đau khớp gối nhẹ thì nên thay Squat bằng bài tập nào?',
        'Hướng dẫn chuẩn form bài chống đẩy (Push-up) để không đau cổ tay?',
        'Nếu hôm nay bận chỉ có 20 phút thì tập bài gì hiệu quả nhất?',
      ],
    },
    {
      title: '⚡ Chỉ số sinh học & Giảm cân',
      questions: [
        'Giải thích chỉ số TDEE và mức thâm hụt calo an toàn?',
        'Làm thế nào để uống đủ 2 - 2.5 lít nước mỗi ngày dễ dàng?',
        'Hiện tượng chững cân (Weight Loss Plateau) và cách khắc phục?',
      ],
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({ role: m.role, content: m.content })),
          userContext: {
            fullName: profile.fullName,
            age: profile.age,
            gender: profile.gender,
            goal: profile.goal,
            height: profile.height,
            weight: profile.weight,
            bmi: metrics.bmi,
            bmr: metrics.bmr,
            tdee: metrics.tdee,
            targetCalories: metrics.targetCalories,
            macros: metrics.macros,
            allergies: profile.allergies,
            dislikedFoods: profile.dislikedFoods,
            workoutDaysPerWeek: profile.workoutDaysPerWeek,
            workoutDuration: profile.workoutDuration,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply || 'Cảm ơn câu hỏi của bạn. Hãy kiên trì theo đuổi lối sống lành mạnh nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        fallbackAiReply(text);
      }
    } catch (err) {
      console.warn('Chat request failed, fallbacking locally:', err);
      fallbackAiReply(text);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackAiReply = (query: string) => {
    const lower = query.toLowerCase();
    let reply = `Chào bạn! Về câu hỏi "${query}": Để đạt mục tiêu ${profile.goal}, bạn hãy duy trì mức thâm hụt quanh ${metrics.targetCalories} kcal/ngày và uống tối thiểu ${metrics.waterLiters}L nước. Luôn lắng nghe cơ thể và ngủ đủ 7-8 tiếng mỗi đêm nhé!`;

    if (lower.includes('trước khi tập') || lower.includes('bữa ăn nhẹ')) {
      reply = `**Gợi ý bữa ăn nhẹ trước khi tập 30 - 45 phút:**\n\n1. **1 quả chuối chín + 1 thìa bơ đậu phộng**: Cung cấp carbohydrate hấp thu nhanh và kali chống chuột rút cơ bắp.\n2. **1 lát bánh mì nguyên cám + 1 quả trứng luộc**.\n3. **1 hũ sữa chua không đường + 1 nắm nhỏ quả mọng hoặc yến mạch ngâm**.\n\n*Lưu ý:* Tránh thức ăn nhiều dầu mỡ hoặc quá nhiều chất xơ ngay sát giờ tập vì dễ gây nặng bụng.`;
    } else if (lower.includes('đau gối') || lower.includes('squat')) {
      reply = `**Khi bị mỏi hoặc đau khớp gối nhẹ:**\n\n- Tạm thời thay thế Back Squat sâu bằng:\n  • **Glute Bridge (Nâng hông sàn)**: Tác động cơ mông mà hoàn toàn không chịu tải lên đầu gối.\n  • **Wall Sit (Tựa lưng vào tường góc 45-60 độ)**: Rèn luyện sức chịu đựng cơ tứ đầu tĩnh.\n  • **Step-ups thấp (Bước lên bục 15-20cm)**.\n- Luôn kiểm tra mũi chân và đầu gối cùng hướng, không để gối chụm vào nhau (Knee Valgus).\n- Nếu cơn đau nhói kéo dài hoặc sưng, hãy dừng tập ngay và đến khám bác sĩ chuyên khoa chấn thương chỉnh hình!`;
    } else if (lower.includes('nước') || lower.includes('uống nước')) {
      reply = `**Bí quyết uống đủ ${metrics.waterLiters} lít nước mỗi ngày:**\n\n1. Uống 1 ly nước ấm (300ml) ngay sau khi thức dậy để đánh thức tiêu hóa.\n2. Chia chai nước 1L làm mốc: 1 chai trước 12h trưa, 1 chai trước 18h chiều.\n3. Uống từng ngụm nhỏ rải rác thay vì uống ừng ực một lượng lớn cùng lúc.\n4. Bổ sung thêm vài lát chanh tươi hoặc dưa leo nếu thấy nước lọc nhàm chán.`;
    } else if (lower.includes('tdee') || lower.includes('thâm hụt')) {
      reply = `**Chỉ số TDEE & Thâm hụt calo an toàn:**\n\n- **TDEE của bạn:** **${metrics.tdee} kcal/ngày**.\n- **Mục tiêu calo đề xuất:** **${metrics.targetCalories} kcal/ngày** (thâm hụt khoảng 450 kcal).\n- Đây là mức thâm hụt "vàng", giúp giảm mỡ đều đặn ~0.4kg/tuần mà không gây suy giảm chuyển hóa, không rụng tóc và không làm mất khối cơ nạc.`;
    }

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `restart-${Date.now()}`,
        role: 'assistant',
        content: `Đã làm mới cuộc trò chuyện. Hãy đặt bất kỳ câu hỏi nào cho AI Health Coach nhé!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleExportChat = () => {
    const textContent = messages
      .map((m) => `[${m.timestamp}] ${m.role === 'user' ? 'Bạn' : 'AI Health Coach'}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AI_Health_Chat_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <Bot className="w-3.5 h-3.5" />
          <span>Trợ lý Đàm thoại Gemini 3.8</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          TRỢ LÝ AI SỐNG KHỎE
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Trò chuyện trực tiếp cùng Huấn luyện viên AI để được giải đáp thắc mắc dinh dưỡng,
          hướng dẫn chuẩn form bài tập và tối ưu hóa kế hoạch thể lực theo thời gian thực.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar: Context & Topics */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Synchronized Profile Snapshot */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hồ sơ đang đồng bộ</span>
              </span>
              <button
                onClick={() => onNavigate('profile')}
                className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Họ tên:</span>
                <span className="font-bold text-slate-900">{profile.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Mục tiêu:</span>
                <span className="font-bold text-emerald-700">{profile.goal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">BMI thể trạng:</span>
                <span className="font-bold text-slate-900">{metrics.bmi} ({metrics.bmiCategory})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Calo mục tiêu:</span>
                <span className="font-bold text-amber-600">{metrics.targetCalories} kcal/ngày</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Lượng nước:</span>
                <span className="font-bold text-cyan-600">{metrics.waterLiters} L/ngày</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Lịch tập:</span>
                <span className="font-bold text-slate-900">{profile.workoutDaysPerWeek} buổi · {profile.workoutDuration}p</span>
              </div>
            </div>
          </div>

          {/* Quick Questions Accordion */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Chủ đề gợi ý câu hỏi</span>
            </h3>

            <div className="space-y-3">
              {topicCategories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-800">{cat.title}</div>
                  <div className="space-y-1">
                    {cat.questions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-600 transition border border-transparent hover:border-emerald-200 cursor-pointer line-clamp-1"
                        title={q}
                      >
                        • {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical disclaimer note */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> AI đóng vai trò định hướng hỗ trợ thông tin. Mọi lời khuyên không thay thế chẩn đoán y khoa từ bác sĩ.
            </span>
          </div>
        </div>

        {/* Right Chat Thread Interface */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-md flex flex-col h-[650px] overflow-hidden">
          {/* Chat Window Top Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">AI Health & Fitness Coach</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300">
                  Mô hình Gemini 3.8 · Trực tuyến 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportChat}
                title="Tải lịch sử chat (.txt)"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleClearChat}
                title="Xóa đoạn chat làm lại"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative group ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </div>

                    <div
                      className={`mt-2 flex items-center justify-between text-[10px] ${
                        isUser ? 'text-emerald-200' : 'text-slate-600'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 transition p-1 hover:text-emerald-700 rounded-md cursor-pointer flex items-center gap-1"
                          title="Sao chép nội dung"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-[10px] text-emerald-600">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Chép</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 w-fit shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>AI Health Coach đang phân tích và chuẩn bị câu trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-4 bg-white border-t border-slate-200 shrink-0"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI về calo món ăn, bài tập, nước uống, mẹo phục hồi..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-xs sm:text-sm text-slate-900"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
