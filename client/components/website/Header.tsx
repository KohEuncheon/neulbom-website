import { useState, useCallback, useMemo } from "react";
import { ChevronDown } from "lucide-react";

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 이벤트 핸들러 메모이제이션
  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsDropdownOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // 로고 이미지 URL 메모이제이션
  const logoUrl = useMemo(() => 
    "https://cdn.builder.io/api/v1/image/assets%2F41e1249e027f4152b57815cda5a0c3a2%2Ff3284e6ba4b3487eb05da5403a1cf2ca?format=webp&width=800", 
    []
  );

  // SVG 아이콘 메모이제이션
  const closeIcon = useMemo(() => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ), []);

  const menuIcon = useMemo(() => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ), []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center" aria-label="홈으로 이동">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src={logoUrl}
                  alt="늘봄 로고"
                  className="w-12 h-12 object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              늘봄소개
            </a>
            <a
              href="/mcs"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              사회자
            </a>
            <div className="relative">
              <button
                className="flex items-center text-gray-600 hover:text-gray-900 font-medium text-sm"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                예약
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg py-2 min-w-[120px]">
                  <a
                    href="/reservation"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={closeDropdown}
                  >
                    예약 문의
                  </a>
                  <a
                    href="/reservation-status"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={closeDropdown}
                  >
                    예약 현황
                  </a>
                </div>
              )}
            </div>
            <a
              href="/promotion"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              프로모션
            </a>
            <a
              href="/guidance"
              className="text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              안내&TIP
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleMobileMenu}
              aria-label="모바일 메뉴 토글"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? closeIcon : menuIcon}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="px-4 py-4 space-y-4">
              <a
                href="/about"
                className="block text-gray-600 hover:text-gray-900 font-medium"
                onClick={closeMobileMenu}
              >
                늘봄소개
              </a>
              <a
                href="/mcs"
                className="block text-gray-600 hover:text-gray-900 font-medium"
                onClick={closeMobileMenu}
              >
                사회자
              </a>
              <div className="space-y-2">
                <div className="text-gray-600 font-medium">예약</div>
                <a
                  href="/reservation"
                  className="block text-gray-500 hover:text-gray-700 ml-4"
                  onClick={closeMobileMenu}
                >
                  예약 문의
                </a>
                <a
                  href="/reservation-status"
                  className="block text-gray-500 hover:text-gray-700 ml-4"
                  onClick={closeMobileMenu}
                >
                  예약 현황
                </a>
              </div>
              <a
                href="/promotion"
                className="block text-gray-600 hover:text-gray-900 font-medium"
                onClick={closeMobileMenu}
              >
                프로모션
              </a>
              <a
                href="/guidance"
                className="block text-gray-600 hover:text-gray-900 font-medium"
                onClick={closeMobileMenu}
              >
                안내&TIP
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
