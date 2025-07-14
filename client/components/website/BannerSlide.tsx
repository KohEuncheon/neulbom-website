import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// 개선된 fetchBanners: page, limit, sort 파라미터 지원
type FetchBannersParams = {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: string;
};
const fetchBanners = async ({ page = 1, limit = 10, sort = 'date', sortOrder = 'desc' }: FetchBannersParams = {}) => {
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
      // { data, totalCount }
      return result;
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
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // 배너 목록 불러오기
    let isMounted = true;
    const loadBanners = async () => {
      const { data, totalCount } = await fetchBanners({
        page: currentPage,
        limit: itemsPerPage,
        sort: 'date',
        sortOrder: 'desc',
      });
      if (isMounted) {
        setBanners(Array.isArray(data) ? data : []);
        setTotalCount(totalCount);
        setCurrentIndex(0); // 페이지 바뀌면 첫 배너로
      }
    };
    loadBanners();
    // 주기적으로 배너 목록 새로고침 (5분마다)
    const interval = setInterval(loadBanners, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 10초마다 슬라이드 변경
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

  // 이전 슬라이드로 이동
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1,
    );
  };

  // 다음 슬라이드로 이동
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1,
    );
  };

  // 배너가 없으면 기본 배너 표시
  if (banners.length === 0) {
    return null; // 샘플 배너 미노출
  }

  const currentBanner = banners[currentIndex];

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
                />
              </a>
            ) : (
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* 좌우 화살표 */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* 슬라이드 인디케이터 */}
            {banners.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.isArray(banners) && banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
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
      </div>
    </section>
  );
}
