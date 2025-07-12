import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function BannerSlide() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 배너 목록 불러오기
    const loadBanners = () => {
      const savedBanners = localStorage.getItem("bannerList");
      if (savedBanners) {
        const bannerList = JSON.parse(savedBanners);
        setBanners(bannerList);
      }
    };

    loadBanners();

    // storage 변경 감지
    const handleStorageChange = () => {
      loadBanners();
    };

    window.addEventListener("storage", handleStorageChange);
    // 브라우저가 focus 되었을 때도 재로딩
    window.addEventListener("focus", loadBanners);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", loadBanners);
    };
  }, []);

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
    return (
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-pink-400 via-pink-500 to-red-400 rounded-lg overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-8 w-8 h-8 bg-white rounded-full"></div>
              <div className="absolute top-8 right-12 w-6 h-6 bg-white rounded-full"></div>
              <div className="absolute bottom-8 left-16 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute bottom-4 right-8 w-10 h-10 bg-white rounded-full"></div>
              <div className="absolute top-12 left-1/4 text-white text-xl">
                ♥
              </div>
              <div className="absolute bottom-12 right-1/4 text-white text-lg">
                ♥
              </div>
            </div>

            <div className="relative px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between">
              {/* Left character */}
              <div className="flex-shrink-0 mb-6 md:mb-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-300 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl md:text-2xl">👩‍💼</span>
                  </div>
                </div>
              </div>

              {/* Center content */}
              <div className="flex-1 text-center mx-4 md:mx-8">
                <div className="text-white mb-2">
                  <span className="text-xs md:text-sm">
                    당신의 특별한 날을 더욱 빛나게
                  </span>
                </div>
                <h1 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  <span className="text-yellow-200">결혼/행사</span> 전문 사회자
                  이곳!
                </h1>
                <p className="text-white text-xs md:text-sm mb-6">
                  전문 사회자와 함께하는 완벽한 결혼식을 만들어드립니다.
                </p>
                <a
                  href="/reservation"
                  className="inline-block bg-white text-pink-500 px-4 md:px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  예약 상담 받기
                </a>
              </div>

              {/* Right character */}
              <div className="flex-shrink-0 mt-6 md:mt-0">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-300 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xl md:text-2xl">🤵</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-lg overflow-hidden">
          {/* 배너 이미지 */}
          <div className="relative h-64 md:h-80 lg:h-96 group">
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
                {banners.map((_, index) => (
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
        </div>
      </div>
    </section>
  );
}
