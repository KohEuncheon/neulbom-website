import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMCs, MC } from "@/shared/api";

export default function MCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // React Query로 MC 상세 데이터 가져오기
  const { data, isLoading } = useQuery({
    queryKey: ["mc-detail", id],
    queryFn: () => getMCs({ id }),
    enabled: !!id,
  });
  const mcData: MC | null = Array.isArray(data?.data) && data.data.length > 0 ? data.data[0] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!mcData) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              사회자를 찾을 수 없습니다
            </h1>
            <button
              onClick={() => navigate("/mcs")}
              className="bg-pink-400 text-white px-6 py-2 rounded-lg hover:bg-pink-500 transition-colors"
            >
              사회자 목록으로 돌아가기
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <button
              onClick={() => navigate("/mcs")}
              className="hover:text-pink-500"
            >
              사회자
            </button>
            <span> &gt; </span>
            <span>사회자 보기</span>
          </div>

          {/* 프로필 이미지 */}
          <div className="flex justify-center mb-8">
            <div className="relative overflow-hidden rounded-lg bg-pink-100 w-80 h-100">
              <img
                src={
                  mcData.profileImageBase64 ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face"
                }
                alt={mcData.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 사회자 이름 */}

          {/* 소개 내용 */}
          {mcData.introduction && (
            <div className="mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div
                  className="prose max-w-none text-center"
                  dangerouslySetInnerHTML={{
                    __html: mcData.introduction
                      ?.replace(/05515[^:]*삽입된 페이지 내용\s*:\s*/g, "")
                      ?.replace(/05515.*?:/g, ""),
                  }}
                  style={{
                    lineHeight: "1.6",
                  }}
                />
              </div>
            </div>
          )}

          {/* 웹사이트 링크 */}
          {mcData.websiteUrl && (
            <div className="mb-12 text-center">
              <a
                href={mcData.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <span>홈페이지 방문하기</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}

          {/* 돌아가기 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/mcs")}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
