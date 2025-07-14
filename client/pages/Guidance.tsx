import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState, useEffect } from "react";

// 개선된 fetchTips: page, limit, sort 파라미터 지원
type FetchTipsParams = {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
};
const fetchTips = async ({ page = 1, limit = 20, sort = 'date', sortOrder = 'desc' }: FetchTipsParams = {}) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('sort', sort);
    params.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');
    const apiUrl = isDevelopment
      ? `http://localhost:3001/api/tips?${params.toString()}`
      : `/.netlify/functions/getTipsList?${params.toString()}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const result = await response.json();
      // { data, totalCount }
      return result;
    } else {
      console.error('팁 데이터 불러오기 실패');
      return { data: [], totalCount: 0 };
    }
  } catch (error) {
    console.error('팁 데이터 불러오기 오류:', error);
    return { data: [], totalCount: 0 };
  }
};

export default function Guidance() {
  const [tips, setTips] = useState<any[]>([]);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadTips = async () => {
      const { data, totalCount } = await fetchTips({
        page: currentPage,
        limit: itemsPerPage,
        sort: 'date',
        sortOrder: 'desc',
      });
      if (isMounted) {
        setTips(Array.isArray(data) ? data : []);
        setTotalCount(totalCount);
      }
    };
    loadTips();
    return () => { isMounted = false; };
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <span>HOME</span> &gt; <span>안내&TIP</span>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              안내&TIP
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              결혼식 준비에 도움이 되는 다양한 안내사항과 팁을 확인해보세요.
            </p>
          </div>

          {selectedTip ? (
            /* 선택된 안내&TIP 상세 보기 */
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedTip.title}
                </h2>
                <button
                  onClick={() => setSelectedTip(null)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  목록으로
                </button>
              </div>
              <div className="text-sm text-gray-500 mb-6">
                등록일: {selectedTip.date}
              </div>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: selectedTip.content
                    ?.replace(/05515[^:]*삽입된 페이지 내용\s*:\s*/g, "")
                    ?.replace(/05515.*?:/g, ""),
                }}
              />
            </div>
          ) : (
            /* 안내&TIP 목록 테이블 */
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {tips.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        번호
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                        제목
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                        등록일
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tips.map((tip, index) => (
                      <tr
                        key={tip.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedTip(tip)}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 hover:text-pink-600">
                          {tip.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-center">
                          {tip.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`px-3 py-1 rounded ${currentPage === page ? 'bg-pink-400 text-white' : 'bg-white text-pink-400 border border-pink-400'}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    현재 등록된 안내&TIP이 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
