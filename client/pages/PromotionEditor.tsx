import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PromotionEditor() {
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
            <span>프로모션정보</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              프로모션정보
            </h1>
            <div className="text-sm text-gray-600 mb-4">작성</div>
          </div>

          {/* Editor */}
          <div className="bg-white border border-gray-300">
            {/* Toolbar */}
            <div className="border-b border-gray-300 p-3">
              <div className="flex items-center space-x-2">
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm font-bold">B</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm italic">I</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm underline">U</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm line-through">S</span>
                </button>

                <div className="border-l border-gray-300 h-6 mx-2"></div>

                <select className="text-sm border border-gray-300 px-2 py-1">
                  <option>Normal</option>
                </select>

                <select className="text-sm border border-gray-300 px-2 py-1">
                  <option>▼</option>
                </select>

                <div className="border-l border-gray-300 h-6 mx-2"></div>

                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">≡</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">≡</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">≡</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">≡</span>
                </button>

                <div className="border-l border-gray-300 h-6 mx-2"></div>

                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">📷</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">🎬</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">🔗</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">📊</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">😊</span>
                </button>
                <button className="p-1 border border-gray-300 hover:bg-gray-50">
                  <span className="text-sm">▷</span>
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-4 min-h-96 bg-white">
              <div className="text-gray-400 text-sm">내용을 입력하세요...</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center space-x-3">
            <Button
              size="sm"
              className="bg-pink-500 hover:bg-pink-600 text-white px-6"
            >
              등록
            </Button>
            <Button variant="outline" size="sm" className="px-6">
              ↺ 목록으로
            </Button>
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
