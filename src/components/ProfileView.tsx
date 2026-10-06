import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Heart,
  Activity,
  Flame,
  Droplets,
  Scale,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Utensils,
  Dumbbell,
} from 'lucide-react';
import { UserProfile, ProfileMetrics, AIAdvice } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  metrics: ProfileMetrics;
  setMetrics: (m: ProfileMetrics) => void;
  advice: AIAdvice;
  setAdvice: (a: AIAdvice) => void;
  onNavigate: (tabId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  setProfile,
  metrics,
  setMetrics,
  advice,
  setAdvice,
  onNavigate,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedSuccess, setAnalyzedSuccess] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalyzedSuccess(false);

    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: formData }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(formData);
        if (data.metrics) setMetrics(data.metrics);
        if (data.aiAdvice) setAdvice(data.aiAdvice);
        setAnalyzedSuccess(true);
      } else {
        // Fallback local calculations
        calculateLocal(formData);
      }
    } catch (err) {
      console.warn('Backend call failed, using client fallback:', err);
      calculateLocal(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLocal = (p: UserProfile) => {
    const hInMeters = p.height / 100;
    const bmi = Number((p.weight / (hInMeters * hInMeters)).toFixed(1));
    let bmiCategory = 'Bình thường';
    if (bmi < 18.5) bmiCategory = 'Thiếu cân';
    else if (bmi < 23) bmiCategory = 'Bình thường (Chuẩn châu Á)';
    else if (bmi < 25) bmiCategory = 'Tiền béo phì';
    else bmiCategory = 'Béo phì';

    let bmr = p.gender === 'Nam'
      ? Math.round(10 * p.weight + 6.25 * p.height - 5 * p.age + 5)
      : Math.round(10 * p.weight + 6.25 * p.height - 5 * p.age - 161);

    let mult = p.activityLevel === 'Nhiều' ? 1.7 : p.activityLevel === 'Vừa' ? 1.45 : 1.2;
    let tdee = Math.round(bmr * mult);
    let target = tdee;
    if (p.goal === 'Giảm cân') target = Math.max(1200, Math.round(tdee - 450));
    if (p.goal === 'Tăng cơ') target = Math.round(tdee + 350);

    const pro = Math.round(p.weight * (p.goal === 'Tăng cơ' ? 2.0 : 1.6));
    const fat = Math.round((target * 0.25) / 9);
    const carb = Math.max(80, Math.round((target - (pro * 4 + fat * 9)) / 4));

    setProfile(p);
    setMetrics({
      bmi,
      bmiCategory,
      bmr,
      tdee,
      targetCalories: target,
      macros: { protein: pro, carb, fat },
      waterLiters: Number((p.weight * 0.04).toFixed(1)),
    });
    setAdvice({
      nutritionDirection: `Mục tiêu dinh dưỡng phù hợp: ${target} kcal/ngày. Ưu tiên đạm nạc (${pro}g) để duy trì cơ bắp và tinh bột tiêu hóa chậm. Bổ sung đủ ${Number((p.weight * 0.04).toFixed(1))}L nước mỗi ngày.`,
      workoutDirection: `Duy trì tần suất ${p.workoutDaysPerWeek} buổi/tuần, mỗi buổi ${p.workoutDuration} phút. Tập trung vào các bài đa khớp toàn thân kết hợp Cardio nhịp tim vùng 2 để tăng trao đổi chất.`,
      keyTakeaways: [
        `Năng lượng hàng ngày: ${target} kcal (TDEE: ${tdee} kcal)`,
        `Đa lượng phân bổ: ${pro}g Đạm - ${carb}g Tinh bột - ${fat}g Chất béo`,
        `Thực phẩm loại trừ: ${p.dislikedFoods || 'Không có'} | Tránh: ${p.allergies || 'Không có'}`,
      ],
    });
    setAnalyzedSuccess(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Bước 01 & 02</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          HỒ SƠ CÁ NHÂN
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Cung cấp thông tin thể trạng và thói quen sinh hoạt để AI tính toán chính xác chỉ số
          và cá nhân hóa kế hoạch dinh dưỡng & tập luyện của riêng bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span>Thông tin người dùng</span>
            <span className="text-xs font-normal text-slate-600">(Điền đầy đủ các mục)</span>
          </h2>

          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Họ tên */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
              />
            </div>

            {/* Tuổi, Giới tính */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tuổi
                </label>
                <input
                  type="number"
                  min="12"
                  max="90"
                  required
                  value={formData.age}
                  onChange={(e) => handleChange('age', parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Giới tính
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Nam', 'Nữ'] as const).map((gender) => (
                    <button
                      type="button"
                      key={gender}
                      onClick={() => handleChange('gender', gender)}
                      className={`py-2.5 rounded-xl text-sm font-semibold border transition ${
                        formData.gender === gender
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chiều cao, Cân nặng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  required
                  value={formData.height}
                  onChange={(e) => handleChange('height', parseInt(e.target.value) || 165)}
                  placeholder="Ví dụ: 170"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  required
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', parseInt(e.target.value) || 60)}
                  placeholder="Ví dụ: 65"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
                />
              </div>
            </div>

            {/* Mục tiêu */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mục tiêu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Giảm cân', 'Tăng cơ', 'Duy trì'] as const).map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => handleChange('goal', goal)}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition ${
                      formData.goal === goal
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Mức độ vận động */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Mức độ vận động hàng ngày
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Ít', label: 'Ít (Ngồi nhiều)' },
                  { id: 'Vừa', label: 'Vừa (1-3 buổi/tuần)' },
                  { id: 'Nhiều', label: 'Nhiều (4-6 buổi/tuần)' },
                ].map((act) => (
                  <button
                    type="button"
                    key={act.id}
                    onClick={() => handleChange('activityLevel', act.id)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                      formData.activityLevel === act.id
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Số buổi tập & Thời gian */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Số buổi tập/tuần
                </label>
                <select
                  value={formData.workoutDaysPerWeek}
                  onChange={(e) => handleChange('workoutDaysPerWeek', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
                >
                  <option value={2}>2 buổi / tuần</option>
                  <option value={3}>3 buổi / tuần</option>
                  <option value={4}>4 buổi / tuần (Khuyến nghị)</option>
                  <option value={5}>5 buổi / tuần</option>
                  <option value={6}>6 buổi / tuần</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Thời gian mỗi buổi (phút)
                </label>
                <select
                  value={formData.workoutDuration}
                  onChange={(e) => handleChange('workoutDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
                >
                  <option value={20}>20 phút</option>
                  <option value={30}>30 phút</option>
                  <option value={40}>40 phút (Tiêu chuẩn)</option>
                  <option value={45}>45 phút</option>
                  <option value={60}>60 phút</option>
                </select>
              </div>
            </div>

            {/* Món ăn yêu thích */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Món ăn yêu thích
              </label>
              <input
                type="text"
                value={formData.favoriteFoods}
                onChange={(e) => handleChange('favoriteFoods', e.target.value)}
                placeholder="Ví dụ: Ức gà, Trứng, Bánh mì, Chuối, Bơ..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
              />
            </div>

            {/* Món ăn không thích */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Món ăn không thích
              </label>
              <input
                type="text"
                value={formData.dislikedFoods}
                onChange={(e) => handleChange('dislikedFoods', e.target.value)}
                placeholder="Ví dụ: Cá hồi, Mướp đắng, Khổ qua, Đậu bắp..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
              />
            </div>

            {/* Dị ứng / Thực phẩm cần tránh */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Dị ứng / Thực phẩm cần tránh
              </label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                placeholder="Ví dụ: Hải sản tôm cua, Đậu phộng, Sữa bò..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden transition text-slate-900 text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>AI đang phân tích hồ sơ & tính toán...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>✨ PHÂN TÍCH HỒ SƠ BẰNG AI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Results & Guidance */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Hồ sơ của bạn</h3>
                <p className="text-xs text-slate-600">{profile.fullName} · {profile.gender}, {profile.age} tuổi</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {profile.goal}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  <span>BMI tham khảo</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{metrics.bmi}</div>
                <div className="text-[11px] font-medium text-emerald-700 mt-0.5 truncate">
                  {metrics.bmiCategory}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Calo mục tiêu</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{metrics.targetCalories}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">kcal / ngày</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <span>TDEE tiêu hao</span>
                </div>
                <div className="text-lg font-bold text-slate-800">{metrics.tdee} kcal</div>
                <div className="text-[11px] text-slate-600 mt-0.5">BMR: {metrics.bmr} kcal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Nước tối thiểu</span>
                </div>
                <div className="text-lg font-bold text-slate-800">{metrics.waterLiters} lít</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Hàng ngày</div>
              </div>
            </div>

            {/* Macro Distribution */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                <span>Phân bổ dinh dưỡng đa lượng (Macros)</span>
                <span className="text-slate-600">{metrics.targetCalories} kcal</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-2">
                  <div className="text-rose-800 font-bold">{metrics.macros.protein}g</div>
                  <div className="text-[11px] text-slate-600">🥩 Đạm (Protein)</div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                  <div className="text-amber-800 font-bold">{metrics.macros.carb}g</div>
                  <div className="text-[11px] text-slate-600">🍚 Tinh bột (Carb)</div>
                </div>
                <div className="bg-teal-50 border border-teal-100 rounded-lg p-2">
                  <div className="text-teal-800 font-bold">{metrics.macros.fat}g</div>
                  <div className="text-[11px] text-slate-600">🥑 Chất béo (Fat)</div>
                </div>
              </div>
            </div>

            {/* AI Directions */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Định hướng dinh dưỡng</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/60">
                  {advice.nutritionDirection}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Định hướng tập luyện</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/50 p-3 rounded-xl border border-teal-100/60">
                  {advice.workoutDirection}
                </p>
              </div>

              {advice.keyTakeaways && advice.keyTakeaways.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Điểm lưu ý cá nhân hóa
                  </h4>
                  <ul className="space-y-1.5">
                    {advice.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="mt-6 p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Lưu ý trên website:</strong> Thông tin do AI phân tích chỉ mang tính chất
                tham khảo khoa học, không thay thế chẩn đoán y khoa hay tư vấn dinh dưỡng chuyên biệt của bác sĩ.
              </p>
            </div>

            {/* Quick Navigation to Plan */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('meals')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>Xem Thực đơn 7 ngày</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('workout')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <span>Xem Lịch tập 4 tuần</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
