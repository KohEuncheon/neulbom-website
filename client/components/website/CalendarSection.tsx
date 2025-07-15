import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getMCs, getGroupedReservations, MC } from "@/shared/api";

// 타입 선언 추가
type Reservation = {
  _id: string;
  author: string;
  mc: string;
  ceremonyDate: string;
  ceremonyTime?: string;
  weddingHall?: string;
  otherNotes?: string;
  status: string;
  date?: string;
  createdAt?: string;
};

type GroupedReservation = {
  _id: string;
  reservations: Reservation[];
};

export function CalendarSection() {
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(7);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  // MC 목록
  const { data: mcData } = useQuery({
    queryKey: ["calendar-mcs"],
    queryFn: () => getMCs(),
  });
  const mcList: MC[] = mcData?.data || [];
  // 그룹핑된 예약 목록
  const { data: groupedData } = useQuery({
    queryKey: ["grouped-reservations", currentYear, currentMonth],
    queryFn: () => getGroupedReservations({
      date: `${currentYear}-${String(currentMonth).padStart(2, "0")}`
    }),
  });
  const groupedReservations: GroupedReservation[] = groupedData || [];
  // 확정된 예약만 localStorage에서 불러오기(기존 유지)
  const [confirmedReservations, setConfirmedReservations] = useState<Reservation[]>([]);
  useEffect(() => {
    try {
      const savedInquiries = localStorage.getItem("customerInquiries");
      if (savedInquiries) {
        const inquiries = JSON.parse(savedInquiries);
        const confirmed = inquiries.filter((inquiry: any) => inquiry.status === "확정");
        setConfirmedReservations(confirmed);
      }
    } catch (error) {
      setConfirmedReservations([]);
    }
  }, [currentYear, currentMonth]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 특정 날짜의 예약 가져오기
  const getReservationsForDate = (day: number): Reservation[] => {
    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return confirmedReservations.filter(
      (reservation) => reservation.ceremonyDate === dateStr,
    );
  };

  // 이름 마스킹 함수 - 두번째 글자를 *로
  const maskName = (name: string) => {
    if (!name || name.length <= 1) return name;
    if (name.length === 2) return name.charAt(0) + "*";
    return name.charAt(0) + "*" + name.substring(2);
  };

  // 사회자 색상 가져오기
  const getMcColor = (mcName: string) => {
    const mc = mcList.find((mc) => mc.name === mcName);
    return mc ? mc.profileColor : "#ff6b9d";
  };

  // 날짜 클릭 핸들러
  const handleDateClick = (day: number) => {
    const reservations = getReservationsForDate(day);
    if (reservations.length > 0) {
      setSelectedDate(
        `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      );
      setShowDateModal(true);
    }
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const calendarDays = [];

  // Previous month's trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isToday: day === 1 && currentMonth === 7 && currentYear === 2025,
    });
  }

  // Next month's leading days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <section id="calendar" className="py-8 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-4">
            예약 완료 달력
          </h2>

          {/* Legend */}
          <div className="flex justify-center items-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Reference Notes */}
        <div className="max-w-lg mx-auto mb-8 text-center">
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-800 mb-2">[참고 사항]</p>
            <p className="text-sm text-gray-700">
              * 날짜를 클릭하시면 자세한 예약 현황을 확인하실 수 있습니다.
            </p>
            <p className="text-sm text-gray-700">
              * 늘봄의 모든 사회자는 아나운서 활동 또는 개인활동을 하고
              있습니다.
            </p>
            <p className="text-sm text-gray-700">
              예약이 없어도 예약이 불가능할 수 있습니다.
            </p>
            <p className="text-sm text-gray-700">
              * 홍성혁 사회자의 경우 '일요일' 예약이 불가합니다.
            </p>
          </div>
        </div>

        {/* MC List - 가로 3명씩 컬러와 함께 표시 */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center text-sm">
            {Array.isArray(mcList) && mcList.map((mc) => (
              <div key={mc._id || mc.id} className="flex items-center min-w-[180px]">
                <span
                  className="mr-2 text-base"
                  style={{ color: mc.profileColor || "#e74c3c" }}
                >
                  ●
                </span>
                <span className="font-medium text-gray-800">
                  {mc.name} / 사회자
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex justify-center items-center mb-6">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={goToPreviousMonth}
              className="px-4 py-3 hover:bg-gray-50 text-gray-700 border-r border-gray-300 text-sm"
            >
              이전 달
            </button>

            <div className="flex items-center px-4 py-3 bg-gray-50">
              <div className="relative mr-2">
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-700 appearance-none pr-8 text-sm min-w-[80px]"
                >
                  <option value={2024}>2024년</option>
                  <option value={2025}>2025년</option>
                  <option value={2026}>2026년</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="px-3 py-1 bg-white border border-gray-200 rounded text-gray-700 appearance-none pr-8 text-sm min-w-[70px]"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}월
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={goToNextMonth}
              className="px-4 py-3 hover:bg-gray-50 text-gray-700 border-l border-gray-300 text-sm"
            >
              다음 달
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
          <table className="w-full table-fixed bg-white">
            {/* Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <th
                    key={day}
                    className="p-3 text-center text-sm text-gray-600 font-medium border-r border-gray-200 last:border-r-0"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Calendar Body */}
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((dateObj, dayIndex) => {
                    const dayReservations = dateObj.isCurrentMonth
                      ? getReservationsForDate(dateObj.day)
                      : [];
                    const isToday = dateObj.isToday;

                    return (
                      <td
                        key={`${weekIndex}-${dayIndex}`}
                        className={`min-h-[100px] md:min-h-[120px] p-1 md:p-2 border-b border-r border-gray-200 align-top ${
                          isToday ? "bg-pink-50 border-pink-200" : "bg-white"
                        } ${dayReservations.length > 0 ? "cursor-pointer hover:bg-gray-50" : ""} last:border-r-0`}
                        onClick={() =>
                          dateObj.isCurrentMonth && handleDateClick(dateObj.day)
                        }
                      >
                        <div
                          className={`text-right text-sm mb-2 ${
                            dateObj.isCurrentMonth
                              ? isToday
                                ? "text-pink-600 font-medium"
                                : "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {dateObj.day}
                        </div>

                        <div className="space-y-1">
                          {/* MC별로 ●와 이름, 예약자(마스킹) 표시 */}
                          {groupedReservations.map((group) => (
                            <div key={group._id} className="flex items-center gap-1 mb-1">
                              <span className="text-base" style={{ color: getMcColor(group._id) }}>●</span>
                              <span className="text-xs font-semibold text-gray-800 mr-1">{group._id}</span>
                              <div className="flex gap-0.5">
                                {(group.reservations as Reservation[]).map((reservation) => (
                                  <div
                                    key={reservation._id}
                                    className="text-xs text-white px-1 py-0.5 rounded flex-shrink-0"
                                    style={{ backgroundColor: getMcColor(reservation.mc) }}
                                  >
                                    {maskName(reservation.author)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 날짜별 예약 현황 모달 */}
      {showDateModal && selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDateModal(false);
              setSelectedDate(null);
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full max-h-[70vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{selectedDate} 예약 확인</h2>
                <button
                  onClick={() => {
                    setShowDateModal(false);
                    setSelectedDate(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6 text-[15px] text-gray-800">
                {(() => {
                  // 해당 날짜의 '확정' 예약만 필터링
                  const reservations = (getReservationsForDate(parseInt(selectedDate.split("-")[2])) ?? []);
                  if ((reservations ?? []).length === 0) {
                    return <div className="text-center text-gray-500 py-8">확정된 예약이 없습니다.</div>;
                  }
                  // 사회자별로 그룹핑
                  const groupedByMc = (reservations ?? []).filter((r) => r.status === "확정").reduce((acc: Record<string, Reservation[]>, r) => {
                    if (!acc[r.mc]) acc[r.mc] = [];
                    acc[r.mc].push(r);
                    return acc;
                  }, {} as Record<string, Reservation[]>);
                  return Object.entries(groupedByMc).map(([mcName, mcReservations]) => (
                    <div key={mcName} className="mb-4">
                      <div className="font-bold text-gray-900 mb-1">[/ {mcName} / 사회자]</div>
                      <div className="space-y-1">
                        {(mcReservations as Reservation[]).map((r) => (
                          <div key={r._id} className="pl-2">
                            [{maskName(r.author)}] {r.ceremonyTime ? r.ceremonyTime + ' ' : ''}{r.weddingHall ? r.weddingHall + ' ' : ''}{r.otherNotes || ''} 예약
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <button
                  onClick={() => {
                    setShowDateModal(false);
                    setSelectedDate(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowDateModal(false);
                    setSelectedDate(null);
                  }}
                  className="px-4 py-2 rounded bg-pink-500 text-white hover:bg-pink-600"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
