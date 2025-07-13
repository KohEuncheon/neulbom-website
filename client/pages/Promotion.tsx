import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState, useEffect } from "react";

// API 호출 함수
const fetchPromotions = async () => {
  try {
    const response = await fetch('/.netlify/functions/getPromotionList');
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('프로모션 데이터 불러오기 실패');
      return [];
    }
  } catch (error) {
    console.error('프로모션 데이터 불러오기 오류:', error);
    return [];
  }
};

export default function Promotion() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  useEffect(() => {
    const loadPromotions = async () => {
      const promotionData = await fetchPromotions();
      setPromotions(promotionData);
    };

    loadPromotions();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <span>HOME</span> &gt; <span>프로모션</span>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              프로모션
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              늘봄에서 진행중인 다양한 프로모션을 확인해보세요.
            </p>
          </div>

          {selectedPromotion ? (
            /* 선택된 프로모션 상세 보기 */
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedPromotion.title}
                </h2>
                <button
                  onClick={() => setSelectedPromotion(null)}
                  className="text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded-lg"
                >
                  목록으로
                </button>
              </div>
              <div className="text-sm text-gray-500 mb-6">
                등록일: {selectedPromotion.date}
              </div>
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: selectedPromotion.content
                    ?.replace(/05515[^:]*삽입된 페이지 내용\s*:\s*/g, "")
                    ?.replace(/05515.*?:/g, ""),
                }}
              />
            </div>
          ) : (
            /* 프로모션 목록 테이블 */
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {promotions.length > 0 ? (
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
                    {promotions
                      .slice()
                      .reverse()
                      .map((promotion, index) => (
                        <tr
                          key={promotion.id}
                          className="border-b hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedPromotion(promotion)}
                        >
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 hover:text-pink-600">
                            {promotion.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 text-center">
                            {promotion.date}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    현재 진행중인 프로모션이 없습니다.
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
