import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// API 호출 함수 - 개발 환경에서는 로컬 서버, 프로덕션에서는 Netlify 함수 사용
const fetchMCs = async () => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment ? 'http://localhost:3001/api/mcs' : '/.netlify/functions/getMCs';
    
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('사회자 데이터 불러오기 실패');
      return [];
    }
  } catch (error) {
    console.error('사회자 데이터 불러오기 오류:', error);
    return [];
  }
};

const defaultMcProfiles = [
  {
    id: 1,
    name: "김민수 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "이지은 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "박준호 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "최수진 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "정현우 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "한소영 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 7,
    name: "송태호 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 8,
    name: "임지현 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 9,
    name: "강동원 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 10,
    name: "진서원 아나운서",
    region: "광주/전남",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 11,
    name: "최창은 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 12,
    name: "함형선 아나운서",
    region: "대전",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=400&fit=crop&crop=face",
  },
  {
    id: 13,
    name: "홍성혁 아나운서",
    region: "서울/경기",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=300&h=400&fit=crop&crop=face",
  },
];

export default function MCs() {
  const [selectedRegion, setSelectedRegion] = useState("서울/경기");
  const [mcProfiles, setMcProfiles] = useState<any[]>([]);
  const navigate = useNavigate();

  const regions = ["서울/경기", "광주/전남", "대전"];

  // API에서 등록된 사회자들만 불러오기
  useEffect(() => {
    const loadMCs = async () => {
      const registeredMCs = await fetchMCs();
      if (registeredMCs && registeredMCs.length > 0) {
        // 가나다순 정렬
        const mcsList = registeredMCs
          .map((registeredMc: any) => ({
            id: registeredMc.id,
            name: registeredMc.name,
            region: registeredMc.region,
            image:
              registeredMc.profileImageBase64 ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face",
            profileColor: registeredMc.profileColor,
            specialty: registeredMc.specialty,
            introduction: registeredMc.introduction,
            websiteUrl: registeredMc.websiteUrl,
            registrationDate: registeredMc.registrationDate,
          }))
          .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
        setMcProfiles(mcsList);
      } else {
        setMcProfiles([]);
      }
    };
    loadMCs();
  }, []);

  const filteredMCs = mcProfiles.filter((mc) => mc.region === selectedRegion);

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
            <span>사회자</span>
          </div>
          {/* 사회자 카드 목록 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredMCs.map((mc) => (
              <div key={mc.id} className="flex flex-col items-center bg-pink-50 rounded-xl shadow-sm p-4">
                <div className="overflow-hidden rounded-lg w-40 h-52 mb-2 flex items-end justify-center" style={{ background: '#ffe4ef' }}>
                  <img
                    src={mc.image}
                    alt={mc.name}
                    className="w-full h-full object-cover object-top"
                    style={{ marginBottom: 0 }}
                  />
                </div>
                <span
                  className="mt-1 text-xs"
                  style={{ color: '#ff69b4', fontWeight: 400, fontSize: '0.95rem', marginTop: '0.2rem' }}
                >
                  {mc.name}사회자
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
