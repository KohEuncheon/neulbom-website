import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBanners, Banner as BannerType } from "@/shared/api";

// 타입 정의
type Banner = {
  _id: string;
  title: string;
  image: string;
  link?: string;
  date?: string;
};

type FetchBannersParams = {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
};

type FetchBannersResult = {
  data: Banner[];
  totalCount: number;
};

// 캐시를 위한 전역 변수 (함수 인스턴스가 살아있는 동안 유지)
let bannerCache: FetchBannersResult | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5분

const fetchBanners = async ({ page = 1, limit = 10, sort = 'date', sortOrder = 'desc' }: FetchBannersParams = {}): Promise<FetchBannersResult> => {
  const now = Date.now();
  
  // 캐시가 유효하면 캐시 반환
  if (bannerCache && (now - cacheTime < CACHE_TTL)) {
    return bannerCache;
  }

  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    params.append('sort', sort);
    params.append('sortOrder', sortOrder === 'asc' ? 'asc' : 'desc');
    
    const apiUrl = isDevelopment
      ? `http://localhost:3001/api/banners?${params.toString()}`
      : `/.netlify/functions/getBannerList?${params.toString()}`;
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const result = await response.json();
      const typedResult: FetchBannersResult = {
        data: Array.isArray(result.data) ? result.data : [],
        totalCount: result.totalCount || 0
      };
      
      // 캐시 업데이트
      bannerCache = typedResult;
      cacheTime = now;
      
      return typedResult;
    } else {
      console.error('배너 데이터 불러오기 실패');
      return { data: [], totalCount: 0 };
    }
  } catch (error) {
    console.error('배너 데이터 불러오기 오류:', error);
    return { data: [], totalCount: 0 };
  }
};

export function BannerSlide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // React Query로 배너 목록 가져오기
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banners", currentPage, itemsPerPage],
    queryFn: () => getBanners({
      page: currentPage,
      limit: itemsPerPage,
      sort: "date",
      sortOrder: "desc",
    }),
  });

  const banners: BannerType[] = data?.data || [];
  const totalCount: number = data?.totalCount || 0;
  const totalPages = useMemo(() => Math.ceil(totalCount / itemsPerPage), [totalCount, itemsPerPage]);

  // 슬라이드 자동 변경
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
        );
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // 네비게이션 함수 메모이제이션
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
    );
  }, [banners.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
    );
  }, [banners.length]);

  const setCurrentIndexHandler = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const setCurrentPageHandler = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const currentBanner = useMemo(() => banners[currentIndex] || null, [banners, currentIndex]);

  // 로딩 상태 표시
  if (isLoading || banners.length === 0) {
    return (
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-lg overflow-hidden">
            <div className="relative w-[900px] h-[339px] max-w-full mx-auto bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <p className="text-lg font-medium">배너를 불러오는 중...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-lg overflow-hidden">
          {/* 배너 이미지 */}
          <div className="relative w-[900px] h-[339px] max-w-full mx-auto group">
            {currentBanner?.link ? (
              <a
                href={currentBanner.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={currentBanner.image}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            ) : (
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            )}

            {/* 좌우 화살표 */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="이전 배너"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="다음 배너"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* 슬라이드 인디케이터 */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    onClick={() => setCurrentIndexHandler(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`배너 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={`page-${page}`}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-pink-400 text-white' : 'bg-white text-pink-400 border border-pink-400'}`}
                  onClick={() => setCurrentPageHandler(page)}
                  aria-label={`페이지 ${page}로 이동`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
