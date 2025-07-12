import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Facilities() {
  const facilities = [
    { id: "1", title: "노래방", status: "서울", date: "2023-03-11" },
    { id: "19", title: "헬스장", status: "서울", date: "2022-04-02" },
    { id: "25", title: "사워실", status: "서울", date: "2023-11-03" },
    { id: "26", title: "라운지", status: "서울", date: "2023-12-09" },
    { id: "16", title: "수영장", status: "서울", date: "2023-11-22" },
    { id: "37", title: "피트니스", status: "서울", date: "2024-04-23" },
    { id: "12", title: "골프장", status: "서울", date: "2023-11-13" },
    { id: "31", title: "레크레이션", status: "서울", date: "2024-01-19" },
    { id: "7", title: "레스토랑", status: "서울", date: "2022-04-07" },
    { id: "30", title: "카페테리아", status: "서울", date: "2024-09-19" },
    { id: "5", title: "라운지", status: "부산", date: "2022-04-07" },
    { id: "29", title: "수영장", status: "서울", date: "2024-03-22" },
    { id: "13", title: "피트니스", status: "서울", date: "2022-04-09" },
    { id: "24", title: "골프장", status: "서울", date: "2023-12-13" },
    { id: "22", title: "스튜디오", status: "서울", date: "2023-06-30" },
    { id: "14", title: "709", status: "서울", date: "2022-04-09" },
    {
      id: "30",
      title: "아쉬 돌봄센터체육실",
      status: "서울",
      date: "2024-09-17",
    },
  ];

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
              <a href="#" className="text-sm text-red-400">
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
            <span>시설관리</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">시설</h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-600 underline cursor-pointer">
                  시설등록
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-300 rounded">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16">번호</th>
                  <th className="flex-1">제목</th>
                  <th className="w-24">지역</th>
                  <th className="w-32">등록일</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((facility) => (
                  <tr key={`${facility.id}-${facility.title}`}>
                    <td>{facility.id}</td>
                    <td className="text-left pl-4">{facility.title}</td>
                    <td>{facility.status}</td>
                    <td>{facility.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 mt-auto">
        <div className="text-sm space-y-1">
          <p>대표자: 홍길동 | 사업자: 2022-경기 | 전화: 010-0000-0000</p>
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
