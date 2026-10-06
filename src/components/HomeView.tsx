import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Target,
  Utensils,
  Dumbbell,
  Scale,
  HeartPulse,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, ProfileMetrics } from '../types';

interface HomeViewProps {
  onNavigate: (tabId: string) => void;
  profile: UserProfile;
  metrics: ProfileMetrics;
  openChatbot: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  profile,
  metrics,
  openChatbot,
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Đề tài: Ứng dụng AI xây dựng thực đơn ăn uống & kế hoạch tập luyện
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI HEALTH & FITNESS
          </h1>
          <p className="mt-3 text-xl sm:text-2xl font-medium text-emerald-700">
            Cá nhân hóa chế độ ăn uống và tập luyện với AI
          </p>

          <p className="mt-5 max-w-2xl mx-auto text-slate-600 text-base sm:text-lg leading-relaxed">
            Hệ thống ứng dụng trí tuệ nhân tạo thế hệ mới giúp phân tích chỉ số sinh học,
            tự động thiết kế thực đơn 7 ngày dinh dưỡng Việt Nam và lộ trình rèn luyện 4 tuần tối ưu
            theo từng mục tiêu thể trạng riêng biệt.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Tạo kế hoạch của tôi</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('chatbot')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base shadow-xs transition-all hover:border-slate-400 cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5 text-teal-600" />
              <span>Trò chuyện cùng Trợ lý AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Dashboard Widget Preview */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 border border-slate-700/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
                <Activity className="w-4 h-4" />
                <span>AI Health Dashboard</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Chào bạn 👋
              </h2>
              <p className="text-slate-300 text-sm">
                Hồ sơ: <span className="text-white font-semibold">{profile.fullName}</span> · Tuổi: {profile.age} · Giới tính: {profile.gender}
              </p>
            </div>

            <button
              onClick={() => onNavigate('meals')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all self-start md:self-center shadow-md active:scale-95"
            >
              <span>XEM KẾ HOẠCH</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700/70 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Mục tiêu</span>
              </div>
              <div className="mt-1 text-lg font-bold text-white">{profile.goal}</div>
              <div className="text-xs text-slate-400 mt-0.5">Calo đích: {metrics.targetCalories} kcal/ngày</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Thực đơn</span>
              </div>
              <div className="mt-1 text-lg font-bold text-white">7 ngày cá nhân</div>
              <div className="text-xs text-slate-400 mt-0.5">Hỗ trợ đổi món thông minh bằng AI</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Dumbbell className="w-4 h-4 text-cyan-400" />
                <span>Tập luyện</span>
              </div>
              <div className="mt-1 text-lg font-bold text-white">4 tuần lũy tiến</div>
              <div className="text-xs text-slate-400 mt-0.5">{profile.workoutDaysPerWeek} buổi/tuần · {profile.workoutDuration} phút</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Personalization is Crucial? */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Vì sao cần cá nhân hóa chế độ ăn và tập luyện?
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Không có một thực đơn hay lịch tập duy nhất phù hợp cho tất cả mọi người.
            Mỗi cơ thể sở hữu tốc độ chuyển hóa và giới hạn sinh học riêng biệt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tốc độ chuyển hóa khác biệt</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Chỉ số BMR và TDEE chênh lệch từ 300 - 800 kcal giữa các cá nhân có cân nặng, chiều cao, tuổi tác và mức độ vận động khác nhau.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tránh ăn kiêng cực đoan</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Cắt giảm calo đột ngột dưới mức BMR gây suy giảm trao đổi chất, rụng tóc và mất cơ bắp. Kế hoạch cá nhân hóa duy trì mức thâm hụt an toàn.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Phòng tránh chấn thương khớp</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Người mới tập cần lộ trình thích nghi dây chằng (Tuần 1 làm quen) trước khi tăng cường độ, tránh đau khớp gối và đau lưng dưới.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Phù hợp sở thích & Văn hóa ăn</h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Thực đơn ngon miệng, dễ nấu với nguyên liệu chợ Việt Nam và loại trừ hoàn toàn món bạn ghét hay dị ứng giúp duy trì lâu dài.
            </p>
          </div>
        </div>
      </section>

      {/* How AI Empowers You */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-3">
              <Zap className="w-4 h-4" />
              Công nghệ Trí tuệ Nhân tạo
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              AI có thể hỗ trợ những gì?
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              AI không chỉ thay thế các bảng tính Excel phức tạp mà còn đóng vai trò như một chuyên gia tư vấn tương tác trực tiếp 24/7.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Phân tích đa lượng (Macros) chính xác</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Tính toán gram Đạm (Protein), Tinh bột (Carb), Chất béo (Fat) cân đối theo mục tiêu Giảm cân, Tăng cơ hay Duy trì.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Đổi món bằng AI theo nguyên liệu có sẵn</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Chỉ cần nhập "Tôi không thích cá" hay "Hôm nay tôi ăn chay", AI tự động tính toán món thay thế với calo tương đương trong tích tắc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Phân kỳ tập luyện lũy tiến 4 tuần</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Tự động điều chỉnh số sets, số reps và cường độ tăng dần giúp kích thích cơ bắp phát triển mà không bị chai cơ hay kiệt sức.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Trợ lý trò chuyện và phản hồi tức thì</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Giải đáp mọi thắc mắc về kỹ thuật chống đẩy, bữa ăn trước tập luyện và cách kiểm soát cơn đói một cách khoa học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Quy trình hoạt động
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Quy trình khép kín 5 bước đảm bảo tính cá nhân hóa và độ tin cậy khoa học cao nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Nhập thông tin',
              desc: 'Điền tuổi, chiều cao, cân nặng, mục tiêu, sở thích ăn uống và thời gian tập.',
              icon: '👤',
            },
            {
              step: '02',
              title: 'Phân tích hồ sơ',
              desc: 'Hệ thống tính toán BMR, TDEE, tỷ lệ đa lượng và phân loại BMI chuẩn xác.',
              icon: '📊',
            },
            {
              step: '03',
              title: 'AI tạo kế hoạch',
              desc: 'AI tổng hợp thực đơn 7 ngày và chu kỳ tập 4 tuần tối ưu theo nguyên lý khoa học.',
              icon: '🤖',
            },
            {
              step: '04',
              title: 'Kiểm tra & Đối chiếu',
              desc: 'So sánh khuyến nghị với chuẩn dinh dưỡng Viện Dinh Dưỡng & ACSM.',
              icon: '🔍',
            },
            {
              step: '05',
              title: 'Cá nhân hóa linh hoạt',
              desc: 'Dễ dàng đổi món bằng AI, tích dấu buổi tập và tương tác cùng trợ lý.',
              icon: '✨',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Bước {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Bắt đầu nhập hồ sơ cá nhân</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
};
