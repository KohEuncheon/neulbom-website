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

const defaultMcProfiles = [
  {
    id: 1,
    name: "김민수 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "이지은 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "박준호 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "최수진 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "정현우 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "한소영 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 7,
    name: "송태호 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 8,
    name: "임지현 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 9,
    name: "강동원 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 10,
    name: "진서원 아나운서",
    region: "광주/전남",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 11,
    name: "최창은 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 12,
    name: "함형선 아나운서",
    region: "대전",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 13,
    name: "홍성혁 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=400&fit=crop&crop=face",
  },
];

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
