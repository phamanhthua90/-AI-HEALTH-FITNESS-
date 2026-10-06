import React from 'react';
import {
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Star,
  Quote,
  Layers,
  ArrowDown,
  Brain,
  Wand2,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import { aiToolsUsed, evaluationCriteria } from '../data/initialData';

export const AIEvaluationView: React.FC = () => {
  const workflowSteps = [
    {
      step: 1,
      title: 'AI tạo nội dung',
      desc: 'Mô hình sinh thực đơn 7 ngày và lịch tập 4 tuần dựa trên prompt cấu trúc.',
      badge: 'Khởi tạo',
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      step: 2,
      title: 'Kiểm tra thông tin',
      desc: 'Rà soát danh mục nguyên liệu, calo từng bữa, số hiệp và bài tập chuyển động.',
      badge: 'Sàng lọc thô',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      step: 3,
      title: 'Đối chiếu nguồn đáng tin cậy',
      desc: 'So sánh mức thâm hụt calo với BMR, tham chiếu Viện Dinh Dưỡng Quốc Gia & ACSM.',
      badge: 'Tiêu chuẩn khoa học',
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      step: 4,
      title: 'Phát hiện điểm chưa phù hợp',
      desc: 'Nhận diện ảo giác AI (Calo quá thấp <1200 kcal, bỏ sót dị ứng thực phẩm, bài tập quá tải dây chằng).',
      badge: 'Kiểm soát rủi ro',
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      step: 5,
      title: 'Hiệu chỉnh thông số',
      desc: 'Điều chỉnh lại định lượng gram thực phẩm, tăng thời gian nghỉ và thêm bài phục hồi chủ động.',
      badge: 'Tối ưu hóa',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      step: 6,
      title: 'Đưa ra kế hoạch cuối cùng',
      desc: 'Hoàn thiện bản kế hoạch chuẩn hóa, an toàn, có thể áp dụng ngay vào đời sống thực tế.',
      badge: 'Đầu ra chuẩn',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  const verificationCases = [
    {
      issue: 'Calo bị thâm hụt quá sâu (<1,100 kcal)',
      reason: 'AI mặc định giảm cân phải cắt tối đa tinh bột, dễ gây hạ đường huyết và teo cơ.',
      fix: 'Nâng mức calo tối thiểu bằng chỉ số BMR (~1,400 - 1,600 kcal) để bảo tồn chuyển hóa cơ bản.',
    },
    {
      issue: 'Món ăn không phù hợp thói quen người Việt',
      reason: 'AI lấy mẫu nguyên liệu phương Tây đắt đỏ (cá hồi Na Uy, quả bơ nhập khẩu, hạt quinoa).',
      fix: 'Chuyển đổi sang thực phẩm địa phương tương đương: cá lóc, trứng gà, khoai lang, rau muống, đậu phụ.',
    },
    {
      issue: 'Cường độ tập quá nặng với người mới',
      reason: 'AI xếp các bài tập nặng như Barbell Squat sâu hoặc Burpees liên tục ngay từ tuần đầu.',
      fix: 'Hạ cường độ: Bắt đầu từ Bodyweight Squat, đi bộ nhanh và chống đẩy quỳ gối ở Tuần 1.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Bước 05: Đề tài nghiên cứu & Thẩm định</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI & ĐÁNH GIÁ DỰ ÁN
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Phân tích vai trò của các công cụ AI trong dự án, quy trình kiểm soát rủi ro
          và thang điểm đánh giá toàn diện 5 tiêu chí chất lượng.
        </p>
      </div>

      {/* Part 1: AI Tools Used */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-600" />
            <span>1. Các công cụ AI được sử dụng trong đề tài</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Sự phối hợp giữa các mô hình ngôn ngữ lớn và công cụ thiết kế đồ họa tạo nên sản phẩm hoàn chỉnh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiToolsUsed.map((tool, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-extrabold text-lg text-slate-900">{tool.name}</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-3">
                  {tool.role}
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {tool.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Part 2: AI Verification Workflow */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span>2. Quy trình kiểm tra & hiệu chỉnh AI</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quy trình bắt buộc nhằm đảm bảo thông tin do AI tạo ra không chứa ảo giác (hallucination) và an toàn tuyệt đối cho người dùng.
          </p>
        </div>

        {/* Visual Workflow Steps Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between ${step.color} shadow-2xs relative`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span>Bước {step.step}</span>
                  <span className="text-[10px] uppercase font-semibold opacity-85 px-1.5 py-0.5 rounded bg-white/70">
                    {step.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm leading-snug">{step.title}</h4>
                <p className="text-[11px] mt-2 opacity-90 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verification Examples Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs mt-6">
          <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Các trường hợp phát hiện và hiệu chỉnh thực tế:</span>
          </h3>

          <div className="space-y-4">
            {verificationCases.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="font-bold text-rose-700 text-sm mb-1">
                  ⚠️ Phát hiện: {c.issue}
                </div>
                <div className="text-slate-600 mb-1.5">
                  <strong>Nguyên nhân do AI:</strong> {c.reason}
                </div>
                <div className="text-emerald-800 font-medium">
                  <strong>✅ Giải pháp hiệu chỉnh của con người:</strong> {c.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part 3: Evaluation Criteria */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span>3. Bảng đánh giá chất lượng (5 Tiêu chí)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng kết kết quả thực nghiệm ứng dụng AI trong xây dựng thực đơn và kế hoạch tập luyện.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evaluationCriteria.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: item.maxRating }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className={`w-4 h-4 ${
                          sIdx < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-emerald-800 font-semibold bg-emerald-50/60 p-2.5 rounded-lg">
                ✨ {item.highlight}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Slogan Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-8 sm:p-12 text-center text-white shadow-xl">
        <Quote className="w-10 h-10 mx-auto text-emerald-400 opacity-60 mb-3" />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-3xl mx-auto leading-snug">
          “AI hỗ trợ – Con người kiểm tra – Chuyên gia xác nhận khi cần.”
        </h2>
        <p className="mt-4 text-emerald-200 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Trí tuệ nhân tạo là công cụ đắc lực nâng cao hiệu suất và cá nhân hóa giải pháp dinh dưỡng,
          nhưng sự hiểu biết khoa học và thấu cảm của con người mới là yếu tố quyết định lối sống khỏe bền vững.
        </p>
      </section>
    </div>
  );
};
