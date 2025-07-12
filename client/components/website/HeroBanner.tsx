export function HeroBanner() {
  return (
    <section className="mt-16 relative px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gradient-to-r from-pink-400 via-pink-500 to-red-400 rounded-lg overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-8">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <div className="absolute top-8 right-12">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-8 left-16">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <div className="absolute bottom-4 right-8">
              <div className="w-10 h-10 bg-white rounded-full"></div>
            </div>
            {/* Heart shapes */}
            <div className="absolute top-12 left-1/4">
              <div className="text-white text-xl">♥</div>
            </div>
            <div className="absolute bottom-12 right-1/4">
              <div className="text-white text-lg">♥</div>
            </div>
          </div>

          <div className="relative px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between">
            {/* Left side - Character illustration */}
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
                href="#contact"
                className="inline-block bg-white text-pink-500 px-4 md:px-6 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                예약 상담 받기
              </a>
            </div>

            {/* Right side - Character illustration */}
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
