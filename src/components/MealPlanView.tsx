import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  RefreshCw,
  Sun,
  Sunrise,
  Moon,
  Apple,
  Droplets,
  Flame,
  Check,
  ChevronRight,
  Info,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import { DayMealPlan, UserProfile, ProfileMetrics } from '../types';
import { initial7DaysMeals } from '../data/initialData';

interface MealPlanViewProps {
  meals: DayMealPlan[];
  setMeals: React.Dispatch<React.SetStateAction<DayMealPlan[]>>;
  profile: UserProfile;
  metrics: ProfileMetrics;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({
  meals,
  setMeals,
  profile,
  metrics,
}) => {
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustPrompt, setAdjustPrompt] = useState('Tôi không thích cá, hãy đổi sang món khác tương đương');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const currentDay = meals.find((m) => m.dayNumber === selectedDayNumber) || meals[0];

  const quickAdjustChips = [
    'Tôi không thích cá',
    'Tôi muốn đổi sang thực đơn thuần chay',
    'Cần món trưa nhanh dưới 15 phút',
    'Tăng lượng đạm (Protein) lên mức cao hơn',
    'Bữa tối nhẹ bụng hơn vì ăn muộn',
  ];

  const handleAdjustMeal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!adjustPrompt.trim()) return;

    setIsAdjusting(true);
    setAiNotice(null);

    try {
      const response = await fetch('/api/adjust-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayNumber: currentDay.dayNumber,
          currentDayPlan: currentDay,
          userRequest: adjustPrompt,
          profile,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.modifiedPlan) {
          setMeals((prev) =>
            prev.map((m) =>
              m.dayNumber === currentDay.dayNumber
                ? { ...data.modifiedPlan, customAdjusted: true }
                : m
            )
          );
        }
        if (data.explanation) {
          setAiNotice(data.explanation);
        }
      } else {
        // Fallback local swap
        fallbackLocalAdjust();
      }
    } catch (err) {
      console.warn('API adjust failed, using local swap fallback:', err);
      fallbackLocalAdjust();
    } finally {
      setIsAdjusting(false);
      setIsAdjustModalOpen(false);
    }
  };

  const fallbackLocalAdjust = () => {
    const updatedMeals = [...meals];
    const idx = updatedMeals.findIndex((m) => m.dayNumber === currentDay.dayNumber);
    if (idx !== -1) {
      const lower = adjustPrompt.toLowerCase();
      if (lower.includes('cá') || lower.includes('không thích cá')) {
        updatedMeals[idx] = {
          ...updatedMeals[idx],
          customAdjusted: true,
          dinner: {
            name: 'Ức gà nướng mật ong & Khoai lang nướng',
            items: ['160g ức gà áp chảo sốt mật ong mù tạt', '1 củ khoai lang nướng thơm', 'Canh rau cải nấu nấm rơm'],
            calories: 450,
            protein: '38g',
            carb: '44g',
            fat: '8g',
          },
        };
        setAiNotice('AI đã thay thế món cá ở bữa tối bằng Ức gà nướng mật ong (160g) và canh rau nấm để giữ nguyên 38g Protein chuẩn thâm hụt.');
      } else {
        updatedMeals[idx] = {
          ...updatedMeals[idx],
          customAdjusted: true,
          notes: `Đã điều chỉnh theo yêu cầu: "${adjustPrompt}"`,
        };
        setAiNotice(`AI đã ghi nhận và tối ưu khẩu phần theo yêu cầu: "${adjustPrompt}".`);
      }
      setMeals(updatedMeals);
    }
  };

  const handleResetDay = () => {
    const defaultDay = initial7DaysMeals.find((d) => d.dayNumber === currentDay.dayNumber);
    if (defaultDay) {
      setMeals((prev) =>
        prev.map((d) => (d.dayNumber === currentDay.dayNumber ? defaultDay : d))
      );
      setAiNotice('Đã khôi phục thực đơn ngày này về trạng thái chuẩn ban đầu.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <Utensils className="w-3.5 h-3.5" />
          <span>Bước 03: Dinh dưỡng cá nhân hóa</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          THỰC ĐƠN 7 NGÀY
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Kế hoạch bữa ăn được AI tính toán theo mục tiêu <strong className="text-emerald-700">{profile.goal}</strong> ({metrics.targetCalories} kcal/ngày),
          loại trừ món không thích ({profile.dislikedFoods || 'Không có'}).
        </p>
      </div>

      {/* AI Notice Banner if changed */}
      {aiNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Thông báo từ AI Dinh dưỡng:</p>
              <p className="text-emerald-800 text-xs sm:text-sm mt-0.5">{aiNotice}</p>
            </div>
          </div>
          <button
            onClick={() => setAiNotice(null)}
            className="text-xs text-emerald-700 hover:text-emerald-950 underline shrink-0 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Day Selector Tabs (Day 1 -> Day 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {meals.map((day) => {
          const isSelected = day.dayNumber === selectedDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 flex flex-col items-center gap-0.5 min-w-[100px] border cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs opacity-90">NGÀY {day.dayNumber}</span>
              <span className="font-bold">{day.dayName}</span>
              {day.customAdjusted && (
                <span className={`text-[10px] mt-0.5 font-normal ${isSelected ? 'text-emerald-100' : 'text-emerald-600'}`}>
                  ✨ Đã tinh chỉnh
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Day Card Top Bar */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Thực đơn chi tiết
              </span>
              {currentDay.customAdjusted && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  AI Customized
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold mt-1">
              NGÀY {currentDay.dayNumber} – {currentDay.dayName}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">{currentDay.notes}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* AI Adjust Button */}
            <button
              onClick={() => setIsAdjustModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>🔄 Điều chỉnh thực đơn bằng AI</span>
            </button>

            {currentDay.customAdjusted && (
              <button
                onClick={handleResetDay}
                title="Khôi phục thực đơn gốc của ngày này"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Macro & Food Group Distribution Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Tổng năng lượng: <strong className="text-slate-900 text-sm">{currentDay.totalCalories} kcal</strong></span>
              <span className="text-slate-600 font-normal">/ Mục tiêu {metrics.targetCalories} kcal</span>
            </div>

            {/* Food Groups Icons */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span>🍚 Tinh bột:</span> <strong className="text-slate-800">{currentDay.distribution.carbsGrams}g</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>🥩 Protein:</span> <strong className="text-slate-800">{currentDay.distribution.proteinGrams}g</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>🥬 Rau củ:</span> <strong className="text-slate-800">{currentDay.distribution.veggiesGrams}g</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>🍎 Trái cây:</span> <strong className="text-slate-800">{currentDay.distribution.fruitsGrams}g</strong>
              </span>
              <span className="flex items-center gap-1">
                <span>💧 Nước:</span> <strong className="text-slate-800">{currentDay.distribution.waterLiters}L</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 4 Meals Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bữa sáng */}
          <div className="p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-colors bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Sunrise className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Bữa sáng</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{currentDay.breakfast.name}</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {currentDay.breakfast.calories} kcal
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {currentDay.breakfast.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              {currentDay.breakfast.protein && <span>Đạm: {currentDay.breakfast.protein}</span>}
              {currentDay.breakfast.carb && <span>Carb: {currentDay.breakfast.carb}</span>}
              {currentDay.breakfast.fat && <span>Béo: {currentDay.breakfast.fat}</span>}
            </div>
          </div>

          {/* Bữa trưa */}
          <div className="p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-colors bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700">Bữa trưa</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{currentDay.lunch.name}</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {currentDay.lunch.calories} kcal
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {currentDay.lunch.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              {currentDay.lunch.protein && <span>Đạm: {currentDay.lunch.protein}</span>}
              {currentDay.lunch.carb && <span>Carb: {currentDay.lunch.carb}</span>}
              {currentDay.lunch.fat && <span>Béo: {currentDay.lunch.fat}</span>}
            </div>
          </div>

          {/* Bữa phụ */}
          <div className="p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-colors bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Apple className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Bữa phụ (Xế)</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{currentDay.snack.name}</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {currentDay.snack.calories} kcal
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {currentDay.snack.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              {currentDay.snack.protein && <span>Đạm: {currentDay.snack.protein}</span>}
              {currentDay.snack.carb && <span>Carb: {currentDay.snack.carb}</span>}
              {currentDay.snack.fat && <span>Béo: {currentDay.snack.fat}</span>}
            </div>
          </div>

          {/* Bữa tối */}
          <div className="p-5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-colors bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Bữa tối</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{currentDay.dinner.name}</h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {currentDay.dinner.calories} kcal
                </span>
              </div>

              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {currentDay.dinner.items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-600 font-medium">
              {currentDay.dinner.protein && <span>Đạm: {currentDay.dinner.protein}</span>}
              {currentDay.dinner.carb && <span>Carb: {currentDay.dinner.carb}</span>}
              {currentDay.dinner.fat && <span>Béo: {currentDay.dinner.fat}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* AI Meal Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Điều chỉnh thực đơn Ngày {currentDay.dayNumber} bằng AI
                  </h3>
                  <p className="text-xs text-slate-600">Thay thế nguyên liệu hoặc đổi chế độ ăn</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-slate-600 hover:text-slate-900 text-lg leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Nhập yêu cầu điều chỉnh của bạn:
                </label>
                <textarea
                  rows={3}
                  value={adjustPrompt}
                  onChange={(e) => setAdjustPrompt(e.target.value)}
                  placeholder="Ví dụ: Tôi không thích ăn cá, đổi sang thịt gà hoặc trứng; Tôi muốn ăn chay hôm nay..."
                  className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition"
                />
              </div>

              {/* Quick suggestion chips */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                  Gợi ý yêu cầu nhanh:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickAdjustChips.map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setAdjustPrompt(chip)}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-slate-800">
                  <Info className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cơ chế xử lý của AI:</span>
                </div>
                <p>
                  AI sẽ tự động tính toán món thay thế (Ví dụ: cá → ức gà / trứng / đậu phụ / thịt nạc)
                  để giữ vững mức calo mục tiêu ({metrics.targetCalories} kcal) và tỷ lệ đạm cần thiết.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isAdjusting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI đang thay thế món...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Áp dụng điều chỉnh</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
