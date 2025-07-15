import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMCs, MC } from "@/shared/api";

export default function MCs() {
  const [selectedRegion, setSelectedRegion] = useState("서울/경기");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const regions = ["서울/경기", "광주/전남", "대전"];

  // React Query로 MC 목록 가져오기
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["mcs", selectedRegion, currentPage, itemsPerPage],
    queryFn: () => getMCs({
      region: selectedRegion,
      page: currentPage,
      limit: itemsPerPage,
      sort: "name",
      sortOrder: "asc",
    }),
    // keepPreviousData: true, // 옵션 제거
  });

  const mcProfiles: MC[] = data?.data || [];
  const totalCount: number = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <button
              onClick={() => navigate("/")}
              className="hover:text-pink-500"
            >
              HOME
            </button>
            <span> &gt; </span>
            <span>사회자</span>
          </div>
          {/* 지역 선택 */}
          <div className="mb-6 flex gap-2">
            {regions.map((region) => (
              <button
                key={region}
                className={`px-4 py-2 rounded-lg border ${selectedRegion === region ? 'bg-pink-400 text-white' : 'bg-white text-pink-400 border-pink-400'}`}
                onClick={() => { setSelectedRegion(region); setCurrentPage(1); }}
              >
                {region}
              </button>
            ))}
          </div>
          {/* MC 카드 목록 */}
          {isLoading ? (
            <div className="text-center text-gray-400 py-12">사회자 목록을 불러오는 중...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">사회자 데이터를 불러오지 못했습니다.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {mcProfiles.map((mc) => (
                <div key={mc._id} className="flex flex-col items-center bg-pink-50 rounded-xl shadow-sm p-4">
                  <div className="overflow-hidden rounded-lg w-40 h-52 mb-2 flex items-end justify-center" style={{ background: '#ffe4ef' }}>
                    <img
                      src={mc.profileImageBase64 || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face"}
                      alt={mc.name}
                      className="w-full h-full object-cover object-top"
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <span
                    className="mt-1 text-xs"
                    style={{ color: '#ff69b4', fontWeight: 400, fontSize: '0.95rem', marginTop: '0.2rem' }}
                  >
                    {mc.name}사회자
                  </span>
                </div>
              ))}
            </div>
          )}
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
