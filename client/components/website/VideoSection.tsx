import { useState, useCallback, useMemo } from "react";

export function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);

  // 이벤트 핸들러 메모이제이션
  const handlePlayClick = useCallback(() => {
    setShowVideo(true);
  }, []);

  const handleCloseClick = useCallback(() => {
    setShowVideo(false);
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowVideo(false);
    }
  }, []);

  // YouTube URL 메모이제이션
  const videoUrl = useMemo(() => 
    "https://www.youtube.com/embed/GlRLXak-Hsg?autoplay=1", 
    []
  );

  const thumbnailUrl = useMemo(() => 
    "https://img.youtube.com/vi/GlRLXak-Hsg/maxresdefault.jpg", 
    []
  );

  return (
    <section className="py-12 bg-black mt-4">
      <div className="max-w-4xl mx-auto px-4">
        {/* Video Container */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <div className="relative w-full h-full">
            {/* YouTube thumbnail as background */}
            <img
              src={thumbnailUrl}
              alt="YouTube video thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />

            {/* Play button overlay */}
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="동영상 재생"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors group-hover:scale-110 transform duration-200">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            {/* Fullscreen video overlay when playing */}
            {showVideo && (
              <div
                className="absolute inset-0 bg-black"
                onClick={handleOverlayClick}
              >
                <iframe
                  className="w-full h-full"
                  src={videoUrl}
                  title="수백 회 베테랑 사회자도 처음 보는 이색 결혼식?!"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                <button
                  onClick={handleCloseClick}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                  aria-label="동영상 닫기"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* More Videos Link */}
        <div className="text-center">
          <a
            href="https://www.youtube.com/@KohEunCheon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-xl md:text-2xl font-medium hover:text-gray-300 transition-colors"
            aria-label="YouTube 채널에서 더 많은 영상 보기"
          >
            영상 더보기
          </a>
        </div>
      </div>
    </section>
  );
}
