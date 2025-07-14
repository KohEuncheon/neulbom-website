import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API 호출 함수 - 개발 환경에서는 로컬 서버, 프로덕션에서는 Netlify 함수 사용
// 개선된 fetchMCs: region, page, limit, sort 파라미터 지원
type FetchMCsParams = {
  region?: string;
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
};
const fetchMCs = async ({ region, page = 1, limit = 100, sort = 'name', sortOrder = 'asc' }: FetchMCsParams = {}) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const params = new URLSearchParams();
    if (region) params.append('region', region);
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('sort', sort);
    params.append('sortOrder', sortOrder);
    const apiUrl = isDevelopment
      ? `http://localhost:3001/api/mcs?${params.toString()}`
      : `/.netlify/functions/getMCs?${params.toString()}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const result = await response.json();
      // { data, totalCount }
      return result;
    } else {
      console.error('사회자 데이터 불러오기 실패');
      return { data: [], totalCount: 0 };
    }
  } catch (error) {
    console.error('사회자 데이터 불러오기 오류:', error);
    return { data: [], totalCount: 0 };
  }
};

export default function MCs() {
  const [selectedRegion, setSelectedRegion] = useState("서울/경기");
  const [mcProfiles, setMcProfiles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const regions = ["서울/경기", "광주/전남", "대전"];

  // 서버에서 region, page, limit, sort로 MC 목록 받아오기
  useEffect(() => {
    let isMounted = true;
    const loadMCs = async () => {
      const { data, totalCount } = await fetchMCs({
        region: selectedRegion,
        page: currentPage,
        limit: itemsPerPage,
        sort: 'name',
        sortOrder: 'asc',
      });
      if (isMounted) {
        setMcProfiles(Array.isArray(data) ? data : []);
        setTotalCount(totalCount);
      }
    };
    loadMCs();
    return () => { isMounted = false; };
  }, [selectedRegion, currentPage, itemsPerPage]);

  // 페이지네이션 계산
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
          {/* 사회자 카드 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {mcProfiles.map((mc) => (
              <div key={mc.id} className="flex flex-col items-center bg-pink-50 rounded-xl shadow-sm p-4">
                <div className="overflow-hidden rounded-lg w-40 h-52 mb-2 flex items-end justify-center" style={{ background: '#ffe4ef' }}>
                  <img
                    src={mc.profileImageBase64 || mc.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face"}
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
