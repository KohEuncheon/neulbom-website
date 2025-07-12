import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // 관리자 계정 확인 (실제로는 서버에서 처리해야 함)
    if (
      credentials.username === "admin" &&
      credentials.password === "neulbom2024"
    ) {
      const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7일 후 만료
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminLoginExpiration", expirationTime.toString());
      window.location.href = "/admin";
    } else {
      setLoginError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-2 text-sm">
            <p>상호명 : 늘봄 / 대표 : 고은천 / 번호 : 010-3938-2998</p>
            <p>
              이메일 : neulbom2020@naver.com / 사업자 등록번호 : 749-77-00451
            </p>

            <p>Copyright ⓒ 늘봄 All Rights Reserved.</p>
            <div className="pt-4">
              <button
                onClick={() => {
                  // 이미 로그인된 상태인지 확인
                  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
                  const expirationTime = localStorage.getItem(
                    "adminLoginExpiration",
                  );
                  const currentTime = new Date().getTime();

                  if (
                    isLoggedIn &&
                    expirationTime &&
                    currentTime <= parseInt(expirationTime)
                  ) {
                    // 이미 로그인된 상태면 바로 관리자 페이지로 이동
                    window.location.href = "/admin";
                  } else {
                    // 로그인이 필요하면 로그인 모달 표시
                    setShowLoginModal(true);
                  }
                }}
                className="text-gray-400 hover:text-white text-sm cursor-pointer"
              >
                늘봄
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLoginModal(false);
              setCredentials({ username: "", password: "" });
              setLoginError("");
            }
          }}
        >
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h2 className="text-xl font-bold text-center mb-6 text-gray-900">
              관리자 로그인
            </h2>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  아이디
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="관리자 아이디"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="비밀번호"
                  required
                />
              </div>

              {loginError && (
                <p className="text-red-500 text-sm text-center">{loginError}</p>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setCredentials({ username: "", password: "" });
                    setLoginError("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-pink-400 hover:bg-pink-500"
                >
                  로그인
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
