import React, { useState } from 'react';
import {
  Dumbbell,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Circle,
  Filter,
  Flame,
  ChevronRight,
  TrendingUp,
  Info,
  Award,
  Zap,
} from 'lucide-react';
import { WeekWorkoutPlan, UserProfile, WorkoutSession, Exercise } from '../types';

interface WorkoutPlanViewProps {
  workoutPlan: WeekWorkoutPlan[];
  setWorkoutPlan: React.Dispatch<React.SetStateAction<WeekWorkoutPlan[]>>;
  profile: UserProfile;
}

export const WorkoutPlanView: React.FC<WorkoutPlanViewProps> = ({
  workoutPlan,
  setWorkoutPlan,
  profile,
}) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [filterGoal, setFilterGoal] = useState<string>('Tất cả');
  const [filterLocation, setFilterLocation] = useState<string>('Tất cả');
  const [filterDuration, setFilterDuration] = useState<string>('Tất cả');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const currentWeekPlan = workoutPlan.find((w) => w.weekNumber === selectedWeek) || workoutPlan[0];

  // Filter sessions based on user selection
  const filteredSessions = currentWeekPlan.sessions.filter((session) => {
    if (filterLocation !== 'Tất cả' && session.location !== filterLocation) {
      return false;
    }
    if (filterDuration !== 'Tất cả') {
      const targetMin = parseInt(filterDuration);
      if (Math.abs(session.durationMinutes - targetMin) > 10) return false;
    }
    return true;
  });

  // Calculate completion percentage
  const totalExercises = currentWeekPlan.sessions.reduce(
    (acc, s) => acc + s.exercises.length,
    0
  );
  const completedExercises = currentWeekPlan.sessions.reduce(
    (acc, s) => acc + s.exercises.filter((e) => e.completed).length,
    0
  );
  const completionPercent = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;

  const toggleExercise = (sessionId: string, exerciseId: string) => {
    setWorkoutPlan((prev) =>
      prev.map((week) => {
        if (week.weekNumber !== selectedWeek) return week;
        return {
          ...week,
          sessions: week.sessions.map((session) => {
            if (session.dayLabel !== sessionId) return session;
            return {
              ...session,
              exercises: session.exercises.map((ex) =>
                ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
              ),
            };
          }),
        };
      })
    );
  };

  const markAllSession = (sessionId: string) => {
    setWorkoutPlan((prev) =>
      prev.map((week) => {
        if (week.weekNumber !== selectedWeek) return week;
        return {
          ...week,
          sessions: week.sessions.map((session) => {
            if (session.dayLabel !== sessionId) return session;
            const allDone = session.exercises.every((e) => e.completed);
            return {
              ...session,
              exercises: session.exercises.map((e) => ({ ...e, completed: !allDone })),
            };
          }),
        };
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Bước 04: Thể lực & Quá tải lũy tiến</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          KẾ HOẠCH TẬP LUYỆN 4 TUẦN
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Lộ trình 4 giai đoạn tiến triển khoa học (Progressive Overload) giúp cơ thể
          thích nghi nhịp tim, xây dựng khối cơ nạc và đốt mỡ bền vững.
        </p>
      </div>

      {/* 4 Weeks Timeline Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {workoutPlan.map((week) => {
          const isSelected = week.weekNumber === selectedWeek;
          const weekDone = week.sessions.reduce(
            (acc, s) => acc + s.exercises.filter((e) => e.completed).length,
            0
          );
          const weekTotal = week.sessions.reduce((acc, s) => acc + s.exercises.length, 0);
          const percent = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

          return (
            <div
              key={week.weekNumber}
              onClick={() => setSelectedWeek(week.weekNumber)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/15'
                  : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                  <span className={isSelected ? 'text-emerald-400' : 'text-emerald-700'}>
                    Tuần {week.weekNumber}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {week.sessions.length} buổi tập
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-snug">
                  {week.weekTitle.split(':')[1] || week.weekTitle}
                </h3>
                <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {week.weekDescription}
                </p>
              </div>

              {/* Progress bar inside week card */}
              <div className="mt-4 pt-3 border-t border-slate-200/20">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>Tiến độ tuần</span>
                  <span className="font-bold">{percent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Controls Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          <span>Bộ lọc thông minh</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Mục tiêu */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              🎯 Mục tiêu
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Tất cả', 'Giảm cân', 'Tăng cơ', 'Duy trì'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterGoal(item)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    filterGoal === item
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              📍 Địa điểm
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Tất cả', 'Tại nhà', 'Phòng gym', 'Ngoài trời'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterLocation(item)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    filterLocation === item
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Thời gian */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              ⏱ Thời gian
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Tất cả', '20', '30', '40', '60'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilterDuration(item)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                    filterDuration === item
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item === 'Tất cả' ? 'Tất cả' : `${item} phút`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Week Progress Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
            T{selectedWeek}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {currentWeekPlan.weekTitle}
            </h3>
            <p className="text-xs text-slate-600">
              Đã hoàn thành {completedExercises}/{totalExercises} động tác ({completionPercent}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {completionPercent === 100 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-full">
              <Award className="w-3.5 h-3.5" />
              Xuất sắc hoàn thành tuần!
            </span>
          )}
        </div>
      </div>

      {/* Workout Sessions List */}
      <div className="space-y-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-slate-500">
            <Info className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p>Không tìm thấy buổi tập nào phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setFilterLocation('Tất cả');
                setFilterDuration('Tất cả');
                setFilterGoal('Tất cả');
              }}
              className="mt-3 text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          filteredSessions.map((session, sIdx) => {
            const allExercisesDone = session.exercises.every((e) => e.completed);

            return (
              <div
                key={sIdx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition hover:border-slate-300"
              >
                {/* Session Top Bar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
                      <span>{session.dayLabel}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {session.durationMinutes} phút
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        {session.location}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{session.sessionTitle}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Nhóm cơ: {session.focusArea}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAllSession(session.dayLabel)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                        allExercisesDone
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${allExercisesDone ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span>{allExercisesDone ? 'Đã hoàn thành buổi' : 'Tích xong cả buổi'}</span>
                    </button>
                  </div>
                </div>

                {/* Exercises Table / List */}
                <div className="divide-y divide-slate-100">
                  {session.exercises.map((ex) => (
                    <div
                      key={ex.id}
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        ex.completed ? 'bg-emerald-50/20' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleExercise(session.dayLabel, ex.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                          aria-label="Tích hoàn thành bài tập"
                        >
                          {ex.completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4
                              className={`text-sm font-bold cursor-pointer hover:text-emerald-700 ${
                                ex.completed ? 'line-through text-slate-400' : 'text-slate-900'
                              }`}
                              onClick={() => setActiveExerciseModal(ex)}
                            >
                              {ex.name}
                            </h4>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                            <span>Tập: <strong>{ex.sets} hiệp</strong> × <strong>{ex.reps}</strong></span>
                            <span>·</span>
                            <span>Nghỉ: {ex.rest}</span>
                            <span>·</span>
                            <span className="text-emerald-800 font-medium">Cơ: {ex.targetMuscle}</span>
                          </p>
                          <p className="text-xs text-slate-600 mt-1 italic">
                            💡 Mẹo: {ex.tips}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveExerciseModal(ex)}
                        className="text-xs px-2.5 py-1 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition self-start sm:self-center shrink-0 cursor-pointer"
                      >
                        Xem chi tiết & tư thế
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Exercise Detail Modal */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{activeExerciseModal.name}</h3>
                  <p className="text-xs text-emerald-700">{activeExerciseModal.targetMuscle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="text-slate-600 hover:text-slate-900 text-lg leading-none p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <div className="font-bold text-slate-900">Thông số bài tập:</div>
                <div>• Số hiệp: <strong>{activeExerciseModal.sets} hiệp</strong></div>
                <div>• Số lần thực hiện (Reps): <strong>{activeExerciseModal.reps}</strong></div>
                <div>• Thời gian nghỉ giữa hiệp: <strong>{activeExerciseModal.rest}</strong></div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl space-y-1 text-emerald-900">
                <div className="font-bold">Kỹ thuật chuẩn form (Coach Tips):</div>
                <p className="leading-relaxed">{activeExerciseModal.tips}</p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl space-y-1 text-amber-900">
                <div className="font-bold">Lưu ý nhịp thở & An toàn khớp:</div>
                <p className="leading-relaxed">
                  Hít sâu bằng mũi khi cơ bắp giãn ra (hạ tạ/hạ người), thở mạnh bằng miệng khi dùng lực phát động (đẩy lên/đứng lên). Tuyệt đối không nín thở!
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveExerciseModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
