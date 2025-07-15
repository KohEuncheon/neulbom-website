import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTips, Tip } from "@/shared/api";

export default function Guidance() {
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // React Query로 팁 목록 가져오기
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tips", currentPage, itemsPerPage],
    queryFn: () => getTips({
      page: currentPage,
      limit: itemsPerPage,
      sort: "date",
      sortOrder: "desc",
    }),
  });

  const tips: Tip[] = data?.data || [];
  const totalCount: number = data?.totalCount || 0;
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
              {isLoading ? (
                <div className="text-center py-12 text-gray-400">안내&TIP을 불러오는 중...</div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">안내&TIP 데이터를 불러오지 못했습니다.</div>
              ) : tips.length > 0 ? (
                <div>
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
                      {Array.isArray(tips) && tips.map((tip, index) => (
                        <tr
                          key={tip._id || index}
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
                </div>
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
