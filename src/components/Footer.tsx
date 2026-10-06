import React from 'react';
import { Heart, Sparkles, ShieldAlert } from 'lucide-react';

interface FooterProps {
  onNavigate: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">
                <Heart className="w-4 h-4 fill-white/20" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">AI HEALTH & FITNESS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Cá nhân hóa kế hoạch sống khỏe bằng AI. Ứng dụng trí tuệ nhân tạo xây dựng
              thực đơn ăn uống 7 ngày và kế hoạch tập luyện 4 tuần tối ưu theo từng cá nhân.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI hỗ trợ – Con người kiểm tra – Chuyên gia xác nhận khi cần</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Chức năng Hệ thống</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('intro')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  1. Giới thiệu đề tài
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  2. Hồ sơ cá nhân
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('meals')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  3. Thực đơn 7 ngày
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('workout')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  4. Kế hoạch tập 4 tuần
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-eval')}
                  className="hover:text-emerald-400 transition cursor-pointer"
                >
                  5. AI & Đánh giá
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('chatbot')}
                  className="hover:text-emerald-400 transition cursor-pointer text-emerald-400 font-semibold"
                >
                  6. 💬 Trợ lý AI (Chatbot)
                </button>
              </li>
            </ul>
          </div>

          {/* Medical disclaimer note */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Tuyên bố miễn trừ</h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] leading-relaxed text-slate-300">
              <ShieldAlert className="w-4 h-4 text-amber-400 mb-1" />
              Thông tin trên hệ thống chỉ mang tính tham khảo học tập và nghiên cứu. Không thay thế chỉ định y tế chuyên biệt.
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 – Dự án học tập “Ứng dụng AI xây dựng thực đơn ăn uống và kế hoạch tập luyện cá nhân hóa”
          </div>
          <div className="flex items-center gap-4">
            <span>Phiên bản 1.0 (Gemini Powered)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
