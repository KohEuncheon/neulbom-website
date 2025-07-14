import { useState } from "react";

export function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-12 bg-black mt-4">
      <div className="max-w-4xl mx-auto px-4">
        {/* Video Container */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <div className="relative w-full h-full">
            {/* YouTube thumbnail as background */}
            <img
              src="https://img.youtube.com/vi/GlRLXak-Hsg/maxresdefault.jpg"
              alt="YouTube video thumbnail"
              className="w-full h-full object-cover"
            />

            {/* Play button overlay */}
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center group"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors group-hover:scale-110 transform duration-200">
                <svg
                  className="w-8 h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>

            {/* Fullscreen video overlay when playing */}
            {showVideo && (
              <div
                className="absolute inset-0 bg-black"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowVideo(false);
                  }
                }}
              >
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/GlRLXak-Hsg?autoplay=1"
                  title="수백 회 베테랑 사회자도 처음 보는 이색 결혼식?!"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
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
          >
            영상 더보기
          </a>
        </div>
      </div>
    </section>
  );
}
