import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

export default function AdminReservations() {
  const [currentPage, setCurrentPage] = useState(1);

  // 예약 문의 데이터
  const reservations = [
    {
      id: "R001",
      name: "김민수",
      phone: "010-1234-5678",
      eventType: "결혼식",
      eventDate: "2025-03-15",
      mcPreference: "고은천",
      status: "대기",
      createdAt: "2025-01-15",
    },
    {
      id: "R002",
      name: "이영희",
      phone: "010-2345-6789",
      eventType: "돌잔치",
      eventDate: "2025-02-28",
      mcPreference: "김선익",
      status: "상담완료",
      createdAt: "2025-01-14",
    },
    {
      id: "R003",
      name: "박철수",
      phone: "010-3456-7890",
      eventType: "기업행사",
      eventDate: "2025-04-10",
      mcPreference: "상관없음",
      status: "예약확정",
      createdAt: "2025-01-13",
    },
    {
      id: "R004",
      name: "최수진",
      phone: "010-4567-8901",
      eventType: "결혼식",
      eventDate: "2025-05-20",
      mcPreference: "고은천",
      status: "대기",
      createdAt: "2025-01-12",
    },
    {
      id: "R005",
      name: "정태현",
      phone: "010-5678-9012",
      eventType: "세미나",
      eventDate: "2025-03-08",
      mcPreference: "염대준",
      status: "상담완료",
      createdAt: "2025-01-11",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "대기":
        return "status-pending";
      case "상담완료":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs";
      case "예약확정":
        return "status-complete";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="bg-white">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">♠</span>
                </div>
              </div>
            </div>

            <nav className="flex items-center space-x-8">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                공지사항등록
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                사업자등록
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                게시물관리
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                프로모션관리
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                안내사항관리
              </a>
              <a
                href="#"
                className="text-sm text-red-500 hover:text-red-700 font-medium"
              >
                예약문의관리
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">❤ LAYOUT</span>
            </div>
          </div>
        </div>

        {/* Dark Navigation Bar */}
        <div className="bg-gray-800 text-white">
          <div className="flex items-center justify-between px-6 py-2">
            <nav className="flex items-center space-x-8">
              <a href="/admin" className="text-sm hover:text-gray-300">
                관리자
              </a>
              <a href="#" className="text-sm hover:text-gray-300">
                관리자목록
              </a>
              <a href="#" className="text-sm hover:text-gray-300">
                안내사항관리
              </a>
              <a href="#" className="text-sm hover:text-gray-300">
                게시물관리
              </a>
              <a href="#" className="text-sm text-red-400">
                예약문의관리
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-6 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-6 text-sm text-gray-600">
            <span>홈</span>
            <ChevronRight className="w-4 h-4" />
            <span>예약문의관리</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              예약문의관리
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">전체 총</span>
                <span className="text-sm font-semibold text-gray-900">
                  {reservations.length}
                </span>
                <span className="text-sm text-gray-600">건</span>
              </div>
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option value="">전체 상태</option>
                  <option value="대기">대기</option>
                  <option value="상담완료">상담완료</option>
                  <option value="예약확정">예약확정</option>
                  <option value="취소">취소</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                  <option value="">전체 행사</option>
                  <option value="결혼식">결혼식</option>
                  <option value="돌잔치">돌잔치</option>
                  <option value="기업행사">기업행사</option>
                  <option value="세미나">세미나</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-300 rounded">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">번호</th>
                  <th className="w-20">신청자</th>
                  <th className="w-28">연락처</th>
                  <th className="w-20">행사종류</th>
                  <th className="w-24">행사일자</th>
                  <th className="w-20">선호사회자</th>
                  <th className="w-20">상태</th>
                  <th className="w-24">신청일</th>
                  <th className="w-20">관리</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>{reservation.id}</td>
                    <td>{reservation.name}</td>
                    <td>{reservation.phone}</td>
                    <td>{reservation.eventType}</td>
                    <td>{reservation.eventDate}</td>
                    <td>{reservation.mcPreference}</td>
                    <td>
                      <span className={getStatusStyle(reservation.status)}>
                        {reservation.status}
                      </span>
                    </td>
                    <td>{reservation.createdAt}</td>
                    <td>
                      <div className="flex space-x-1">
                        <button className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                          상세
                        </button>
                        <button className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                          처리
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-sm text-gray-600">대기 중</div>
              <div className="text-2xl font-bold text-orange-600">
                {reservations.filter((r) => r.status === "대기").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-sm text-gray-600">상담완료</div>
              <div className="text-2xl font-bold text-blue-600">
                {reservations.filter((r) => r.status === "상담완료").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-sm text-gray-600">예약확정</div>
              <div className="text-2xl font-bold text-green-600">
                {reservations.filter((r) => r.status === "예약확정").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="text-sm text-gray-600">전체</div>
              <div className="text-2xl font-bold text-gray-900">
                {reservations.length}
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <Button variant="ghost" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={page === currentPage ? "bg-gray-800 text-white" : ""}
              >
                {page}
              </Button>
            ))}

            <Button variant="ghost" size="sm">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-auto">
        <div className="text-sm space-y-1">
          <p>대표자: 홍길동 | 사업자: 2022-경기 | 전���: 010-0000-0000</p>
          <p>주소: 경기도00시00동00아파트1217동1205호</p>
          <p>이메일: webdoktor2020@naver.com | 사업자 번호: 0505-0000-0000</p>
          <p>호스팅업체: (주)아임웹 | 개인정보관리 책임자: 1호가 대표</p>
          <p>Copyright © 초기사 All Rights Reserved</p>
          <p>Powered by 아임웹</p>
        </div>
      </footer>
    </div>
  );
}
