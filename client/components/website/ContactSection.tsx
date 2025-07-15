import { useCallback, useMemo } from "react";

export function ContactSection() {
  // 모바일 감지 메모이제이션
  const isMobile = useMemo(() => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ), 
    []
  );

  const phoneNumber = useMemo(() => "010-3938-2998", []);

  const handlePhoneClick = useCallback(async () => {
    if (isMobile) {
      // 모바일에서는 전화걸기
      window.location.href = `tel:${phoneNumber}`;
    } else {
      // PC에서는 번호 표시 - 예쁜 알림창
      if (
        confirm(`📞 연락처: ${phoneNumber}\n\n클립보드에 복사하시겠습니까?`)
      ) {
        try {
          await navigator.clipboard.writeText(phoneNumber);
          alert("✅ 연락처가 클립보드에 복사되었습니다!");
        } catch (error) {
          alert("📋 연락처: " + phoneNumber);
        }
      }
    }
  }, [isMobile, phoneNumber]);

  // SVG 아이콘 메모이제이션
  const phoneIcon = useMemo(() => (
    <svg
      className="w-6 h-6 text-white"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
    </svg>
  ), []);

  const instagramIcon = useMemo(() => (
    <svg
      className="w-6 h-6 text-white"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ), []);

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Legend */}
        <div className="flex justify-center items-center space-x-2 mb-8">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>

        <div className="mb-8">
          <a
            href="/reservation"
            className="inline-block bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            aria-label="예약 문의 페이지로 이동"
          >
            예약 문의하기
          </a>
        </div>

        {/* Contact Icons */}
        <div className="flex justify-center items-center space-x-8 md:space-x-12">
          {/* Phone */}
          <button
            onClick={handlePhoneClick}
            className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
            aria-label="전화번호 복사 또는 전화걸기"
          >
            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
              {phoneIcon}
            </div>
            <span className="text-sm text-gray-600">전화</span>
          </button>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/neulbom__wedding/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
            aria-label="인스타그램 채널로 이동"
          >
            <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
              {instagramIcon}
            </div>
            <span className="text-sm text-gray-600">인스타그램</span>
          </a>
        </div>
      </div>
    </section>
  );
}
