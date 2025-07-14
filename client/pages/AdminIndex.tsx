import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit2,
  Trash2,
  X,
  Plus,
  Upload,
  Calendar,
  Clock,
  User,
  Phone,
  Heart,
  MapPin,
  Mail,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/website/Header";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import * as XLSX from 'xlsx';

// API 호출 함수들 - 개발 환경에서는 로컬 서버, 프로덕션에서는 Netlify 함수 사용
const fetchInquiries = async (page = 1, limit = 20) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment
      ? `http://localhost:3001/api/reservations?page=${page}&limit=${limit}`
      : `/.netlify/functions/getReservations?page=${page}&limit=${limit}`;

    const response = await fetch(apiUrl);
    if (response.ok) {
      const result = await response.json();
      // result: { data, totalCount }
      return result;
    } else {
      console.error('문의 데이터 불러오기 실패');
      return { data: [], totalCount: 0 };
    }
  } catch (error) {
    console.error('문의 데이터 불러오기 오류:', error);
    return { data: [], totalCount: 0 };
  }
};

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

const fetchBanners = async () => {
  try {
    const response = await fetch('/.netlify/functions/getBannerList');
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('배너 데이터 불러오기 실패');
      return [];
    }
  } catch (error) {
    console.error('배너 데이터 불러오기 오류:', error);
    return [];
  }
};

const fetchPromotions = async () => {
  try {
    const response = await fetch('/.netlify/functions/getPromotionList');
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('프로모션 데이터 불러오기 실패');
      return [];
    }
  } catch (error) {
    console.error('프로모션 데이터 불러오기 오류:', error);
    return [];
  }
};

const fetchTips = async () => {
  try {
    const response = await fetch('/.netlify/functions/getTipsList');
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('팁 데이터 불러오기 실패');
      return [];
    }
  } catch (error) {
    console.error('팁 데이터 불러오기 오류:', error);
    return [];
  }
};

// 데이터 저장 함수들 - 개발 환경에서는 로컬 서버, 프로덕션에서는 Netlify 함수 사용
const saveInquiry = async (inquiryData: any) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment ? 'http://localhost:3001/api/reservations' : '/.netlify/functions/saveReservation';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });
    return response.ok;
  } catch (error) {
    console.error('문의 저장 오류:', error);
    return false;
  }
};

const saveMC = async (mcData: any) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment ? 'http://localhost:3001/api/mcs' : '/.netlify/functions/saveMC';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mcData),
    });
    return response.ok;
  } catch (error) {
    console.error('사회자 저장 오류:', error);
    return false;
  }
};

const saveBanner = async (bannerData: any) => {
  try {
    const response = await fetch('/.netlify/functions/saveBanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bannerData),
    });
    return response.ok;
  } catch (error) {
    console.error('배너 저장 오류:', error);
    return false;
  }
};

const savePromotion = async (promotionData: any) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment ? 'http://localhost:3001/api/promotions' : '/.netlify/functions/savePromotion';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promotionData),
    });
    return response.ok;
  } catch (error) {
    console.error('프로모션 저장 오류:', error);
    return false;
  }
};

const saveTips = async (tipsData: any) => {
  try {
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const apiUrl = isDevelopment ? 'http://localhost:3001/api/tips' : '/.netlify/functions/saveTips';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipsData),
    });
    return response.ok;
  } catch (error) {
    console.error('팁 저장 오류:', error);
    return false;
  }
};

export default function AdminIndex() {
  const [currentTab, setCurrentTab] = useState("inquiries");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryDetail, setShowInquiryDetail] = useState(false);
  const [showMcModal, setShowMcModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [selectedMc, setSelectedMc] = useState<any>(null);
  const [showMcDetail, setShowMcDetail] = useState(false);
  const [showEditMcModal, setShowEditMcModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mcToDelete, setMcToDelete] = useState<any>(null);
  const [mcFormData, setMcFormData] = useState({
    name: "",
    region: "",
    profileImage: null as File | null,
    profileColor: "#ff6b9d",
    introduction: "",
    websiteUrl: "",
  });
  const [mcList, setMcList] = useState<any[]>([]);
  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    image: null as File | null,
    link: "",
  });
  const [bannerList, setBannerList] = useState<any[]>([]);
  const [promotionFormData, setPromotionFormData] = useState({
    title: "",
    content: "",
  });
  const [tipsFormData, setTipsFormData] = useState({
    title: "",
    content: "",
  });
  const [promotionList, setPromotionList] = useState<any[]>([]);
  const [tipsList, setTipsList] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [showInquiryEdit, setShowInquiryEdit] = useState(false);
  const [editingInquiry, setEditingInquiry] = useState<any>(null);
  const [showEditBannerModal, setShowEditBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // 로그인 확인 및 데이터 로드
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
    const expirationTime = localStorage.getItem("adminLoginExpiration");
    const currentTime = new Date().getTime();

    if (
      !isLoggedIn ||
      !expirationTime ||
      currentTime > parseInt(expirationTime)
    ) {
      localStorage.removeItem("isAdminLoggedIn");
      localStorage.removeItem("adminLoginExpiration");
      window.location.href = "/";
    } else {
      const newExpirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        "adminLoginExpiration",
        newExpirationTime.toString(),
      );
    }

    // API에서 데이터 불러오기
    const loadData = async () => {
      // 사회자 목록 불러오기
      const mcData = await fetchMCs();
      setMcList(mcData);

      // 문의 데이터 불러오기 (서버 페이징)
      const { data, totalCount } = await fetchInquiries(currentPage, itemsPerPage);
      const mapped = Array.isArray(data) ? data.map((item: any, idx: number) => {
        // 2부 여부
        let secondPart = item.secondPart;
        if (typeof secondPart === 'boolean') {
          secondPart = secondPart ? '2부 있음' : '2부 없음';
        } else if (typeof secondPart === 'string') {
          if (secondPart.toLowerCase() === 'true') secondPart = '2부 있음';
          else if (secondPart.toLowerCase() === 'false') secondPart = '2부 없음';
        }
        // 예식날짜/시간 분리
        let ceremonyDate = item.ceremonyDate || '';
        let ceremonyTime = item.ceremonyTime || '';
        if (item.ceremonyDate && !item.ceremonyTime) {
          const dateStr = item.ceremonyDate.toString();
          const match = dateStr.match(/(\d{4}-\d{2}-\d{2})[ T]?(\d{2}:\d{2})?/);
          if (match) {
            ceremonyDate = match[1];
            ceremonyTime = match[2] || '';
          }
        }
        // 상태 매핑
        let status = item.status;
        if (status === '예약완료') status = '확정';
        else if (status === '문의') status = '문의';
        // date/createdAt 동기화
        let date = item.date || item.createdAt || '';
        let createdAt = item.createdAt || item.date || '';
        // weddingHall 보완: 없으면 place 값 사용
        let weddingHall = item.weddingHall || item.place || '';
        return {
          ...item,
          author: item.author || '',
          ceremonyType: item.ceremonyType || '',
          secondPart,
          ceremonyDate,
          ceremonyTime,
          status,
          date,
          createdAt,
          weddingHall,
        };
      }) : [];
      setInquiries(mapped);
      setTotalCount(totalCount);

      // 배너 데이터 불러오기
      const bannerData = await fetchBanners();
      setBannerList(Array.isArray(bannerData) ? bannerData : []);

      // 프로모션 데이터 불러오기
      const promotionData = await fetchPromotions();
      setPromotionList(Array.isArray(promotionData) ? promotionData : []);

      // 팁 데이터 불러오기
      const tipsData = await fetchTips();
      setTipsList(Array.isArray(tipsData) ? tipsData : []);
    };

    loadData();
  }, [currentPage]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminLoginExpiration");
    window.location.href = "/";
  };

  const tabs = [
    { id: "inquiries", name: "문의 관리" },
    { id: "mcs", name: "사회자 관리" },
    { id: "banners", name: "배너 관리" },
    { id: "promotions", name: "프로모션 관리" },
    { id: "tips", name: "안내&TIP 관리" },
  ];

  const handleInquiryClick = (inquiry: any) => {
    setEditingInquiry({ ...inquiry });
    setShowInquiryEdit(true);
  };

  const colorPalette = [
    "#ff6b9d",
    "#ff69b4",
    "#da70d6",
    "#c71585",
    "#ff0080",
    "#0080ff",
    "#0000ff",
    "#4000ff",
    "#8000ff",
    "#bf00ff",
    "#00ff80",
    "#00bfff",
    "#2c3e50",
    "#34495e",
    "#7f8c8d",
    "#95a5a6",
    "#d35400",
    "#e67e22",
    "#f39c12",
    "#e74c3c",
    "#8e44ad",
    "#9b59b6",
    "#3498db",
    "#2980b9",
    "#1abc9c",
    "#16a085",
    "#27ae60",
    "#2ecc71",
    "#f1c40f",
    "#f39c12",
  ];

  // 사회자 등록 처리
  const handleMcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let profileImageBase64 = "";
    if (mcFormData.profileImage) {
      try {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(mcFormData.profileImage!);
        });
        profileImageBase64 = base64;
      } catch (error) {
        console.error("이미지 변환 실패:", error);
      }
    }

    const newMc = {
      id: mcList.length + 1,
      name: mcFormData.name,
      region: mcFormData.region,
      specialty: "결혼식",
      status: "활동중",
      registrationDate: new Date().toISOString().split("T")[0],
      profileImageBase64,
      profileColor: mcFormData.profileColor,
      introduction: mcFormData.introduction,
      websiteUrl: mcFormData.websiteUrl,
    };

    // API로 저장
    const success = await saveMC(newMc);
    if (success) {
      const updatedMcList = [...mcList, newMc];
      setMcList(updatedMcList);
      alert("사회자가 성공적으로 등록되었습니다.");
    } else {
      alert("사회자 등록에 실패했습니다. 다시 시도해주세요.");
    }

    setShowMcModal(false);
    setMcFormData({
      name: "",
      region: "",
      profileImage: null,
      profileColor: "#ff6b9d",
      introduction: "",
      websiteUrl: "",
    });
  };

  // 사회자 수정 처리
  const handleMcEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    let profileImageBase64 = selectedMc?.profileImageBase64 || "";
    if (mcFormData.profileImage) {
      try {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(mcFormData.profileImage!);
        });
        profileImageBase64 = base64;
      } catch (error) {
        console.error("이미지 변환 실패:", error);
      }
    }

    const updatedMc = {
      ...selectedMc,
      name: mcFormData.name,
      region: mcFormData.region,
      profileImageBase64,
      profileColor: mcFormData.profileColor,
      introduction: mcFormData.introduction,
      websiteUrl: mcFormData.websiteUrl,
    };

    const updatedMcList = mcList.map((mc) =>
      mc.id === selectedMc?.id ? updatedMc : mc,
    );
    setMcList(updatedMcList);
    localStorage.setItem("registeredMCs", JSON.stringify(updatedMcList));

    setShowEditMcModal(false);
    setSelectedMc(null);
    setMcFormData({
      name: "",
      region: "",
      profileImage: null,
      profileColor: "#ff6b9d",
      introduction: "",
      websiteUrl: "",
    });
  };

  // 엑셀 export 함수
  const exportToExcel = () => {
    if (inquiries.length === 0) {
      alert("📋 다운로드할 문의 데이터가 없습니다.");
      return;
    }

    // CSV 형태로 데이터 생성
    const headers = [
      "번호",
      "제목",
      "작성자",
      "배우자",
      "연락처",
      "사회자",
      "웨딩홀",
      "예식종류",
      "2부진행여부",
      "예식날짜",
      "예식시간",
      "처음늘봄접한경로",
      "추가정보(링크/검색어/업체명)",
      "기타사항",
      "예약상태",
      "등록일",
    ];

    const csvContent = [
      headers.join(","),
      ...inquiries.map((inquiry, index) =>
        [
          inquiries.length - index,
          `"${inquiry.title || ""}"`,
          `"${inquiry.author || ""}"`,
          `"${inquiry.spouse || ""}"`,
          `"${inquiry.phone || ""}"`,
          `"${inquiry.mc || ""}"`,
          `"${inquiry.weddingHall || ""}"`,
          `"${inquiry.ceremonyType || ""}"`,
          `"${inquiry.secondPart || ""}"`,
          `"${inquiry.ceremonyDate || ""}"`,
          `"${inquiry.ceremonyTime || ""}"`,
          `"${inquiry.howDidYouHear || ""}"`,
          `"${inquiry.linkUrl || ""}"`,
          `"${inquiry.otherNotes || ""}"`,
          `"${inquiry.status || ""}"`,
          `"${inquiry.date || ""}"`,
        ].join(","),
      ),
    ].join("\n");

    // BOM 추가 (한글 깨짐 방지)
    const csvWithBOM = "\uFEFF" + csvContent;

    // 파일 다운로드
    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `문의관리_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("문의 데이터가 성공적으로 다운로드 되었습니다");
  };

  // 문의 수정 처리
  const handleInquiryUpdate = async () => {
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === editingInquiry?.id ? editingInquiry : inquiry,
    );
    setInquiries(updatedInquiries);
    
    // API로 저장 (수정된 문의를 다시 저장)
    const success = await saveInquiry(editingInquiry);
    if (success) {
      alert("문의가 성공적으로 수정되었습니다.");
    } else {
      alert("문의 수정에 실패했습니다. 다시 시도해주세요.");
    }

    setShowInquiryEdit(false);
    setEditingInquiry(null);
  };

  // 배너 수정 처리
  const handleBannerEdit = (e: React.FormEvent) => {
    e.preventDefault();

    let imageBase64 = editingBanner?.image || "";
    if (bannerFormData.image) {
      const reader = new FileReader();
      reader.onload = () => {
        const updatedBanner = {
          ...editingBanner,
          title: bannerFormData.title,
          image: reader.result as string,
          link: bannerFormData.link,
        };

        const updatedBannerList = bannerList.map((banner) =>
          banner.id === editingBanner?.id ? updatedBanner : banner,
        );
        setBannerList(updatedBannerList);
        localStorage.setItem("bannerList", JSON.stringify(updatedBannerList));

        setShowEditBannerModal(false);
        setEditingBanner(null);
        setBannerFormData({
          title: "",
          image: null,
          link: "",
        });
      };
      reader.readAsDataURL(bannerFormData.image);
    } else {
      const updatedBanner = {
        ...editingBanner,
        title: bannerFormData.title,
        link: bannerFormData.link,
      };

      const updatedBannerList = bannerList.map((banner) =>
        banner.id === editingBanner?.id ? updatedBanner : banner,
      );
      setBannerList(updatedBannerList);
      localStorage.setItem("bannerList", JSON.stringify(updatedBannerList));

      setShowEditBannerModal(false);
      setEditingBanner(null);
      setBannerFormData({
        title: "",
        image: null,
        link: "",
      });
    }
  };

  // 사회자 삭제 처리
  const handleMcDelete = async () => {
    // 실제 DB에서 삭제
    try {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isDevelopment ? `http://localhost:3001/api/mcs/${mcToDelete?._id}` : `/.netlify/functions/deleteMC?id=${mcToDelete?._id}`;
      const response = await fetch(apiUrl, {
        method: 'DELETE',
      });
      if (response.ok) {
        // 삭제 후 목록 다시 불러오기
        const mcData = await fetchMCs();
        setMcList(mcData);
        alert("사회자가 삭제되었습니다.");
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
    setShowDeleteConfirm(false);
    setMcToDelete(null);
  };

  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPromotion = {
      id: promotionList.length + 1,
      title: promotionFormData.title,
      content: promotionFormData.content,
      date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    // API로 저장
    const success = await savePromotion(newPromotion);
    if (success) {
      const updatedPromotionList = [...promotionList, newPromotion];
      setPromotionList(updatedPromotionList);
      alert("프로모션이 성공적으로 등록되었습니다.");
    } else {
      alert("프로모션 등록에 실패했습니다. 다시 시도해주세요.");
    }

    setShowPromotionModal(false);
    setPromotionFormData({
      title: "",
      content: "",
    });
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = async () => {
      const newBanner = {
        id: bannerList.length + 1,
        title: bannerFormData.title,
        image: reader.result as string,
        link: bannerFormData.link,
        date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      // API로 저장
      const success = await saveBanner(newBanner);
      if (success) {
        const updatedBannerList = [...bannerList, newBanner];
        setBannerList(updatedBannerList);
        alert("배너가 성공적으로 등록되었습니다.");
      } else {
        alert("배너 등록에 실패했습니다. 다시 시도해주세요.");
      }

      setShowBannerModal(false);
      setBannerFormData({
        title: "",
        image: null,
        link: "",
      });
    };

    if (bannerFormData.image) {
      reader.readAsDataURL(bannerFormData.image);
    } else {
      const newBanner = {
        id: bannerList.length + 1,
        title: bannerFormData.title,
        image: "",
        link: bannerFormData.link,
        date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      // API로 저장
      const success = await saveBanner(newBanner);
      if (success) {
        const updatedBannerList = [...bannerList, newBanner];
        setBannerList(updatedBannerList);
        alert("배너가 성공적으로 등록되었습니다.");
      } else {
        alert("배너 등록에 실패했습니다. 다시 시도해주세요.");
      }

      setShowBannerModal(false);
      setBannerFormData({
        title: "",
        image: null,
        link: "",
      });
    }
  };

  const handleTipsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTip = {
      id: tipsList.length + 1,
      title: tipsFormData.title,
      content: tipsFormData.content,
      date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    // API로 저장
    const success = await saveTips(newTip);
    if (success) {
      const updatedTipsList = [...tipsList, newTip];
      setTipsList(updatedTipsList);
      alert("안내&TIP이 성공적으로 등록되었습니다.");
    } else {
      alert("안내&TIP 등록에 실패했습니다. 다시 시도해주세요.");
    }

    setShowTipsModal(false);
    setTipsFormData({
      title: "",
      content: "",
    });
  };

  // 렌더링 함수들
  const renderTabContent = () => {
    switch (currentTab) {
      case "inquiries":
        // 날짜 기준 최신순 정렬
        const sortedInquiries = inquiries.slice().sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return b.date.localeCompare(a.date);
        });
        const totalPages = Math.ceil(totalCount / itemsPerPage);
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const pagedInquiries = sortedInquiries.slice(startIdx, endIdx);
        return (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">문의 관리</h1>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  id="excel-upload"
                  style={{ display: 'none' }}
                  onChange={handleExcelUpload}
                />
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => document.getElementById('excel-upload').click()}
                >
                  📁 엑셀 업로드
                </Button>
                <Button
                  onClick={exportToExcel}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  📊 엑셀 EXPORT
                </Button>
              </div>
            </div>
            <div className="bg-white rounded-lg border max-w-4xl mx-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="w-16 text-center px-2 py-2 text-xs font-semibold text-gray-700">#</th>
                    <th className="w-auto text-left px-2 py-2 text-xs font-semibold text-gray-700">제목</th>
                    <th className="w-32 text-center px-2 py-2 text-xs font-semibold text-gray-700">사회자</th>
                    <th className="w-20 text-center px-2 py-2 text-xs font-semibold text-gray-700">작성자</th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 w-28 bg-gray-50" style={{ whiteSpace: 'nowrap' }}>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(inquiries) && inquiries.length > 0 ? (
                    inquiries.map((inquiry, index) => (
                      <tr
                        key={inquiry.id || index}
                        className="border-b hover:bg-gray-50 cursor-pointer h-10"
                        onClick={() => handleInquiryClick(inquiry)}
                      >
                        <td className="w-16 text-center px-2 py-2 text-xs text-gray-700 align-middle whitespace-nowrap">{totalCount - ((currentPage - 1) * itemsPerPage + index)}</td>
                        <td className="text-left px-2 py-2 text-xs text-gray-700 align-middle whitespace-nowrap overflow-hidden text-ellipsis">
                          {(inquiry.title || '')}
                          {(inquiry.status === "확정") && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-[10px] font-semibold border border-green-200 align-middle">확정</span>
                          )}
                        </td>
                        <td className="w-32 text-center px-2 py-2 text-xs text-gray-700 align-middle whitespace-nowrap">{inquiry.mc || "-"}</td>
                        <td className="w-20 text-center px-2 py-2 text-xs text-gray-700 align-middle whitespace-nowrap overflow-hidden text-ellipsis">{inquiry.author || ''}</td>
                        <td className="px-2 py-2 text-center w-28 h-10 align-middle text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                          {(inquiry.date || inquiry.createdAt || '').split('T')[0]}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-xs">등록된 문의가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 UI */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                맨처음
              </Button>
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 10))}
                disabled={currentPage <= 10}
                variant="outline"
                size="sm"
              >
                -10
              </Button>
              {(() => {
                const pageNumbers = [];
                let start = Math.max(1, currentPage - 2);
                let end = Math.min(totalPages, start + 4);
                if (end - start < 4) {
                  start = Math.max(1, end - 4);
                }
                for (let i = start; i <= end; i++) {
                  pageNumbers.push(i);
                }
                return pageNumbers.map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={currentPage === page ? "bg-pink-500 text-white" : ""}
                  >
                    {page}
                  </Button>
                ));
              })()}
              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 10))}
                disabled={currentPage > totalPages - 10}
                variant="outline"
                size="sm"
              >
                +10
              </Button>
              <Button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                맨끝
              </Button>
            </div>
          </div>
        );

      case "mcs":
        return (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">사회자 관리</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowMcModal(true)}
                  className="bg-pink-500 text-white hover:bg-pink-600"
                >
                  + 사회자 등록
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border max-w-4xl mx-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      번호
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      이름
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      지역
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      상태
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      등록일
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mcList.map((mc) => (
                    <tr key={mc.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {mc.id}
                      </td>
                      <td className="px-4 py-3 text-left text-sm text-gray-700">
                        {mc.name}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {mc.region}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <Badge
                          variant={
                            mc.status === "활동중" ? "default" : "secondary"
                          }
                        >
                          {mc.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {mc.registrationDate}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedMc(mc);
                              setMcFormData({
                                name: mc.name,
                                region: mc.region,
                                profileImage: null,
                                profileColor: mc.profileColor,
                                introduction: mc.introduction,
                                websiteUrl: mc.websiteUrl,
                              });
                              setShowEditMcModal(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setMcToDelete(mc);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {mcList.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        등록된 사회자가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "banners":
        return (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">배너 관리</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowBannerModal(true)}
                  className="bg-pink-500 text-white hover:bg-pink-600"
                >
                  + 배너 추가
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border max-w-4xl mx-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      번호
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      제목
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      등록일
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bannerList.map((banner) => (
                    <tr key={banner.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-sm">
                        {banner.id}
                      </td>
                      <td className="px-4 py-3 text-left text-sm">
                        {banner.title}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {banner.date}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <div className="flex justify-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBanner(banner);
                              setShowEditBannerModal(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const updatedBannerList = bannerList.filter(
                                (b) => b.id !== banner.id,
                              );
                              setBannerList(updatedBannerList);
                              localStorage.setItem(
                                "bannerList",
                                JSON.stringify(updatedBannerList),
                              );
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {bannerList.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        등록된 배너가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "promotions":
        return (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">프로모션 관리</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowPromotionModal(true)}
                  className="bg-pink-500 text-white hover:bg-pink-600"
                >
                  + 프로모션 작성
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border max-w-4xl mx-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      번호
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      제목
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      등록일
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(promotionList) ? promotionList : [])
                    .slice()
                    .reverse()
                    .map((promotion, index) => (
                      <tr
                        key={promotion.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-center text-sm">
                          {(Array.isArray(promotionList) ? promotionList.length : 0) - index}
                        </td>
                        <td className="px-4 py-3 text-left text-sm">
                          {promotion.title}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          {promotion.date}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPromotionFormData({
                                  title: promotion.title,
                                  content: promotion.content,
                                });
                                setShowPromotionModal(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "이 프로모션을 삭제하시겠습니까?",
                                  )
                                ) {
                                  const updatedPromotionList =
                                    promotionList.filter(
                                      (p) => p.id !== promotion.id,
                                    );
                                  setPromotionList(updatedPromotionList);
                                  localStorage.setItem(
                                    "promotionList",
                                    JSON.stringify(updatedPromotionList),
                                  );
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {promotionList.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        등록된 프로모션이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "tips":
        return (
          <div>
            <div className="flex items-center justify-between mb-6 max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">안내&TIP 관리</h1>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowTipsModal(true)}
                  className="bg-pink-500 text-white hover:bg-pink-600"
                >
                  + 안내&TIP 추가
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg border max-w-4xl mx-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      번호
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      제목
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      등록일
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(tipsList) ? tipsList : [])
                    .slice()
                    .reverse()
                    .map((tip, index) => (
                      <tr key={tip.id || index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-center text-sm">
                          {(Array.isArray(tipsList) ? tipsList.length : 0) - index}
                        </td>
                        <td className="px-4 py-3 text-left text-sm">
                          {tip.title}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          {tip.date}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <div className="flex justify-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setTipsFormData({
                                  title: tip.title,
                                  content: tip.content,
                                });
                                setShowTipsModal(true);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "이 안내&TIP을 삭제하시겠습니까?",
                                  )
                                ) {
                                  const updatedTipsList = tipsList.filter(
                                    (t) => t.id !== tip.id,
                                  );
                                  setTipsList(updatedTipsList);
                                  localStorage.setItem(
                                    "tipsList",
                                    JSON.stringify(updatedTipsList),
                                  );
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {tipsList.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        등록된 안내&TIP이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 모달 더미 함수들
  const renderMcModal = () => {
    if (!showMcModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowMcModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">사회자 추가</h2>
              <button
                onClick={() => setShowMcModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleMcSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * 이름:
                </label>
                <input
                  type="text"
                  value={mcFormData.name}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setMcFormData({ ...mcFormData, name: cleanValue });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * 지역:
                </label>
                <select
                  value={mcFormData.region}
                  onChange={(e) =>
                    setMcFormData({ ...mcFormData, region: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">지역 선택</option>
                  <option value="서울/경기">서울/경기</option>
                  <option value="광주/전남">광주/전남</option>
                  <option value="대전">대전</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  프로필 이미지:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMcFormData({ ...mcFormData, profileImage: file });
                      }
                    }}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {mcFormData.profileImage
                        ? mcFormData.profileImage.name
                        : "이미지를 선택하세요"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  * 프로필 색상:
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setMcFormData({ ...mcFormData, profileColor: color })
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        mcFormData.profileColor === color
                          ? "border-gray-800"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  소개:
                </label>
                <RichTextEditor
                  value={mcFormData.introduction}
                  onChange={(value) =>
                    setMcFormData({
                      ...mcFormData,
                      introduction: value,
                    })
                  }
                  placeholder="사회자 소개를 입력하세요..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  홈페이지 URL:
                </label>
                <input
                  type="url"
                  value={mcFormData.websiteUrl}
                  onChange={(e) =>
                    setMcFormData({ ...mcFormData, websiteUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  등록
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMcModal(false)}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderEditMcModal = () => {
    if (!showEditMcModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditMcModal(false);
            setSelectedMc(null);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">사회자 수정</h2>
              <button
                onClick={() => {
                  setShowEditMcModal(false);
                  setSelectedMc(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleMcEdit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * 이름:
                </label>
                <input
                  type="text"
                  value={mcFormData.name}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setMcFormData({ ...mcFormData, name: cleanValue });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * 지역:
                </label>
                <select
                  value={mcFormData.region}
                  onChange={(e) =>
                    setMcFormData({ ...mcFormData, region: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">지역 선택</option>
                  <option value="서울/경기">서울/경기</option>
                  <option value="광주/전남">광주/전남</option>
                  <option value="대전">대전</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  프로필 이미지:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setMcFormData({ ...mcFormData, profileImage: file });
                      }
                    }}
                    className="hidden"
                    id="profile-upload-edit"
                  />
                  <label
                    htmlFor="profile-upload-edit"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">
                      {mcFormData.profileImage
                        ? mcFormData.profileImage.name
                        : "새 이미지를 선택하거나 기존 이미지 유지"}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  * 프로필 색상:
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setMcFormData({ ...mcFormData, profileColor: color })
                      }
                      className={`w-8 h-8 rounded-full border-2 ${
                        mcFormData.profileColor === color
                          ? "border-gray-800"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  소개:
                </label>
                <RichTextEditor
                  value={mcFormData.introduction}
                  onChange={(value) =>
                    setMcFormData({
                      ...mcFormData,
                      introduction: value,
                    })
                  }
                  placeholder="사회자 소개를 입력하세요..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  홈페이지 URL:
                </label>
                <input
                  type="url"
                  value={mcFormData.websiteUrl}
                  onChange={(e) =>
                    setMcFormData({ ...mcFormData, websiteUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  수정
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditMcModal(false);
                    setSelectedMc(null);
                  }}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDeleteConfirm(false);
            setMcToDelete(null);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">삭제 확인</h2>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMcToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 text-center">
                <span className="font-medium">{mcToDelete?.name}</span> 사회자를
                삭제하시겠습니까?
              </p>
              <p className="text-sm text-gray-500 text-center mt-2">
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            <div className="flex justify-center space-x-3">
              <Button
                onClick={handleMcDelete}
                className="bg-red-500 hover:bg-red-600 px-6"
              >
                삭제
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMcToDelete(null);
                }}
                className="px-6"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInquiryEditModal = () => {
    if (!showInquiryEdit || !editingInquiry) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowInquiryEdit(false);
            setEditingInquiry(null);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">문의 상세 및 수정</h2>
              <button
                onClick={() => {
                  setShowInquiryEdit(false);
                  setEditingInquiry(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목:
                </label>
                <input
                  type="text"
                  value={editingInquiry.title || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      title: e.target.value
                        .replace(/[\uFFFD]/g, "")
                        .replace(/�/g, ""),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호:
                </label>
                <input
                  type="password"
                  value={editingInquiry.password || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  작성자:
                </label>
                <input
                  type="text"
                  value={editingInquiry.author || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      author: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배우자:
                </label>
                <input
                  type="text"
                  value={editingInquiry.spouse || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      spouse: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처:
                </label>
                <input
                  type="tel"
                  value={editingInquiry.phone || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사회자:
                </label>
                <select
                  value={(editingInquiry.mc || '').replace(/\//g, '')}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      mc: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">사회자 선택</option>
                  {mcList.map((mc) => (
                    <option key={mc.id} value={mc.name.replace(/\//g, '')}>
                      {mc.name} 사회자
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  웨딩홀:
                </label>
                <input
                  type="text"
                  value={editingInquiry.weddingHall || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      weddingHall: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  예식종류:
                </label>
                <select
                  value={editingInquiry.ceremonyType || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      ceremonyType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">선택</option>
                  <option value="주례 없는 예식">주례 없는 예식</option>
                  <option value="주례 있는 예식">주례 있는 예식</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2부 진행 여부:
                </label>
                <select
                  value={editingInquiry.secondPart || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      secondPart: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">선택</option>
                  <option value="2부 있음">2부 있음</option>
                  <option value="2부 없음">2부 없음</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  예식 날짜:
                </label>
                <input
                  type="date"
                  value={editingInquiry.ceremonyDate || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      ceremonyDate: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  예식 시간:
                </label>
                <input
                  type="text"
                  value={editingInquiry.ceremonyTime || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      ceremonyTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="예: 오후 12:30, 14:00 등"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  처음 늘봄을 접한 경로:
                </label>
                <select
                  value={editingInquiry.howDidYouHear || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      howDidYouHear: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">선택</option>
                  <option value="지인 소개">지인 소개</option>
                  <option value="네이버 카페 - 멕마웨">네이버 카페 - 멕마웨</option>
                  <option value="네이버 카페 - 광주결">네이버 카페 - 광주결</option>
                  <option value="네이버 카페 - 다이렉트 카페">네이버 카페 - 다이렉트 카페</option>
                  <option value="네이버 블로그">네이버 블로그</option>
                  <option value="네이버 검색">네이버 검색</option>
                  <option value="구글 검색">구글 검색</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="유튜브">유튜브</option>
                  <option value="웨딩홀 및 플래너 소개">웨딩홀 및 플래너 소개</option>
                  <option value="그 외 사이트">그 외 사이트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추가 정보 (링크/검색어/업체명):
                </label>
                <input
                  type="text"
                  value={editingInquiry.linkUrl || ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      linkUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="접한 경로 관련 추가 정보"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  * 예약 상태:
                </label>
                <select
                  value={editingInquiry.status || "문의"}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      status: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="문의">문의</option>
                  <option value="확정">확정</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                기타 문의 사항:
              </label>
              <textarea
                value={editingInquiry.otherNotes || ''}
                onChange={(e) =>
                  setEditingInquiry({
                    ...editingInquiry,
                    otherNotes: e.target.value,
                  })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="기타 문의사항을 입력하세요..."
              />
            </div>

            <div className="flex justify-center flex-wrap gap-2 mt-6 mb-6">
              <Button
                variant="outline"
                onClick={() => {
                  const d = editingInquiry;
                  // 요일 한글로 변환
                  let weekday = '';
                  if (d.ceremonyDate) {
                    const dateObj = new Date(d.ceremonyDate);
                    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
                    weekday = weekdays[dateObj.getDay()];
                  }
                  const text = `${d.ceremonyDate || ''}${weekday ? ` (${weekday})` : ''} ${d.weddingHall || ''} \n${d.secondPart || ''} \n//${d.mc || ''} \n${d.ceremonyType || ''} \n작성자 : ${d.author || ''} 님 \n${d.phone || ''} \n배우자 : ${d.spouse || ''} 님\n\n[문의 내용]\n${d.title ? d.title + '\n' : ''}${d.otherNotes || ''}`;
                  safeCopyToClipboard(text);
                }}
              >예약 내용</Button>
              <Button
                variant="outline"
                onClick={() => {
                  const d = editingInquiry;
                  const dateStr = d.ceremonyDate ? `${d.ceremonyDate.split('-')[0].slice(2)}년도 ${d.ceremonyDate.split('-')[1]}월 ${d.ceremonyDate.split('-')[2]}일` : '';
                  const text = `안녕하세요 ${d.author || ''}님 맞으시죠?\n프리미엄 결혼식 사회자 에이전시 늘봄입니다~^^ \n\n먼저 결혼을 진심으로 축하드립니다. 항상 행복과 즐거움이 가득하시길 바라겠습니다. \n\n${dateStr} ${d.ceremonyTime || ''} (${d.weddingHall || ''}) /${d.mc || ''}/ 사회자 예식 진행이 가능하십니다 \n\n그럼 비용 안내해드릴까요~?`;
                  safeCopyToClipboard(text);
                }}
              >가능 문구</Button>
              <Button
                variant="outline"
                onClick={() => {
                  const d = editingInquiry;
                  const dateStr = d.ceremonyDate ? `${d.ceremonyDate.split('-')[0].slice(2)}년도 ${d.ceremonyDate.split('-')[1]}월 ${d.ceremonyDate.split('-')[2]}일` : '';
                  const text = `아 네에 ${dateStr} ${d.ceremonyTime || ''} (${d.weddingHall || ''}) /${d.mc || ''}/ 사회자 섭외 확정 되셨구요~!   \n\n사전 미팅은 /${d.mc || ''}/ 사회자와 직접 일정 조율 후에 진행 가능하십니다~ ㅎㅎㅎ   \n\n식순과 대본 등은 /${d.mc || ''}/ 사회자를 통해 직접 받으실 수 있으며 늘봄에도 필요한 내용 있으시면 언제든 연락주시면 되겠습니다~!   \n\n그리고 할인 이벤트(후기, 짝꿍/깐부)에 참여하시려면 아래 두 가지를 해주시면 됩니다.\n1. 링크로 들어가 신청폼 작성(https://forms.gle/VY7pt8Nxp5UK1GBKA)\n2. 링크 작성 후, 각 사회자가 아닌 늘봄 번호(010-3938-2998)로 신청폼 작성했다고 연락\n(할인 이벤트는 예식 있는 전 주까지 등록을 완료해주셔야 할인 적용이 됩니다. 꼭 기한을 지켜 주시기 바랍니다.)\n\n그럼 다시 한 번 진심으로 결혼을 축하드리구요~ /${d.mc || ''}/ 사회자에게 연락드리라고 전해놓겠습니다ㅎㅎㅎ\n(번호 오류로 문자가 안 가는 경우가 있기 때문에 3일 내에 사회자에게서 연락이 오지 않는 경우에 이 번호로 다시 회신 부탁드립니다.) 감사합니다!!!\n    \n필요하신 것 있으시면 언제든 편히 연락주세요! \n감사합니다 :-)`;
                  safeCopyToClipboard(text);
                }}
              >확정 문구</Button>
              <Button
                variant="outline"
                onClick={() => {
                  const d = editingInquiry;
                  const dateStr = d.ceremonyDate ? `${d.ceremonyDate.split('-')[0].slice(2)}년도 ${d.ceremonyDate.split('-')[1]}월 ${d.ceremonyDate.split('-')[2]}일` : '';
                  const text = `안녕하세요 ${dateStr} ${d.ceremonyTime || ''} ${d.weddingHall || ''}로 문의 주신 ${d.author || ''}님 맞으시죠?\n프리미엄 결혼식 사회자 에이전시 늘봄입니다~^^ 문의 남겨주셔서 연락드렸습니다!\n\n먼저 결혼을 진심으로 축하드립니다. 항상 행복과 즐거움이 가득하시길 바라겠습니다.\n\n그런데 정말 아쉽네요ᅮᅮ 문의해주신 해당 날짜에는 /${d.mc || ''}/ 사회자 일정이 차있어 서 진행이 어려울 것 같습니다ᅮᅮ\n\n이렇게 연락을 주셨는데 너무 아쉽네요😭😭\n도움 드리지 못해서 정말 죄송합니다ᅮᅮ\n\n혹시 몰라서 다른 잘하는 사회자 필요하시면 편하게 연락주세요ᄒᄒᄒᄒ\n\n감사합니다~ ᄒᄒ`;
                  safeCopyToClipboard(text);
                }}
              >거절 문구</Button>
            </div>

            <div className="flex justify-center space-x-3 mt-6">
              <Button
                onClick={handleInquiryUpdate}
                className="bg-pink-500 hover:bg-pink-600 px-6"
              >
                수정하기
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowInquiryEdit(false);
                  setEditingInquiry(null);
                }}
                className="px-6"
              >
                취소하기
              </Button>
              <Button
                variant="destructive"
                onClick={handleInquiryDelete}
                className="px-6 bg-red-500 hover:bg-red-600 text-white"
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBannerModal = () => {
    if (!showBannerModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowBannerModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">배너 추가</h2>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배너 제목:
                </label>
                <input
                  type="text"
                  value={bannerFormData.title}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setBannerFormData({
                      ...bannerFormData,
                      title: cleanValue,
                    });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="배너 제목"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배너 이미지:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
                  {bannerFormData.image ? (
                    <div>
                      <img
                        src={URL.createObjectURL(bannerFormData.image)}
                        alt="배너 미리보기"
                        className="max-w-full h-32 object-cover mx-auto mb-2"
                      />
                      <p className="text-sm text-green-600">
                        ✓ {bannerFormData.image.name}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setBannerFormData({ ...bannerFormData, image: null })
                        }
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        이미지 제거
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                          배너 이미지 업로드
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            setBannerFormData({
                              ...bannerFormData,
                              image: file,
                            });
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  권장 크기: 1200x400px
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  링크 URL (선택사항):
                </label>
                <input
                  type="url"
                  value={bannerFormData.link}
                  onChange={(e) =>
                    setBannerFormData({
                      ...bannerFormData,
                      link: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  추가
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBannerModal(false)}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderEditBannerModal = () => {
    if (!showEditBannerModal || !editingBanner) return null;

    useEffect(() => {
      if (editingBanner) {
        setBannerFormData({
          title: editingBanner.title,
          image: null,
          link: editingBanner.link || "",
        });
      }
    }, [editingBanner]);

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditBannerModal(false);
            setEditingBanner(null);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">배너 수정</h2>
              <button
                onClick={() => {
                  setShowEditBannerModal(false);
                  setEditingBanner(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBannerEdit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배너 제목:
                </label>
                <input
                  type="text"
                  value={bannerFormData.title}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setBannerFormData({
                      ...bannerFormData,
                      title: cleanValue,
                    });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="배너 제목"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  배너 이미지:
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center relative">
                  {bannerFormData.image ? (
                    <div>
                      <img
                        src={URL.createObjectURL(bannerFormData.image)}
                        alt="배너 미리보기"
                        className="max-w-full h-32 object-cover mx-auto mb-2"
                      />
                      <p className="text-sm text-green-600">
                        ✓ {bannerFormData.image.name}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setBannerFormData({ ...bannerFormData, image: null })
                        }
                        className="mt-2 text-sm text-red-600 hover:text-red-800"
                      >
                        이미지 제거
                      </button>
                    </div>
                  ) : editingBanner?.image ? (
                    <div>
                      <img
                        src={editingBanner.image}
                        alt="현재 배너"
                        className="max-w-full h-32 object-cover mx-auto mb-2"
                      />
                      <p className="text-sm text-gray-600 mb-2">현재 이미지</p>
                      <label className="cursor-pointer block">
                        <div className="flex flex-col items-center">
                          <Plus className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-gray-500 text-sm">
                            새 이미지로 변경
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              setBannerFormData({
                                ...bannerFormData,
                                image: file,
                              });
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">
                          배너 이미지 업로드
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            setBannerFormData({
                              ...bannerFormData,
                              image: file,
                            });
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  권장 크기: 1200x400px
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  링크 URL (선택사항):
                </label>
                <input
                  type="url"
                  value={bannerFormData.link}
                  onChange={(e) =>
                    setBannerFormData({
                      ...bannerFormData,
                      link: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  수정
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditBannerModal(false);
                    setEditingBanner(null);
                  }}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderPromotionModal = () => {
    if (!showPromotionModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowPromotionModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">프로모션 추가</h2>
              <button
                onClick={() => setShowPromotionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handlePromotionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목:
                </label>
                <input
                  type="text"
                  value={promotionFormData.title}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setPromotionFormData({
                      ...promotionFormData,
                      title: cleanValue,
                    });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="제목"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용:
                </label>
                <RichTextEditor
                  value={promotionFormData.content}
                  onChange={(value) =>
                    setPromotionFormData({
                      ...promotionFormData,
                      content: value,
                    })
                  }
                  placeholder="프로모션 내용을 입력하세요..."
                  className="w-full"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  작성
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPromotionModal(false);
                    setPromotionFormData({
                      title: "",
                      content: "",
                    });
                  }}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderTipsModal = () => {
    if (!showTipsModal) return null;

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowTipsModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">안내&TIP 추가</h2>
              <button
                onClick={() => setShowTipsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleTipsSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목:
                </label>
                <input
                  type="text"
                  value={tipsFormData.title}
                  onChange={(e) => {
                    const cleanValue = e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, "");
                    setTipsFormData({ ...tipsFormData, title: cleanValue });
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="제목"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용:
                </label>
                <RichTextEditor
                  value={tipsFormData.content}
                  onChange={(value) =>
                    setTipsFormData({
                      ...tipsFormData,
                      content: value,
                    })
                  }
                  placeholder="안내&TIP 내용을 입력하세요..."
                  className="w-full"
                />
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 px-6"
                >
                  작성
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowTipsModal(false);
                    setTipsFormData({
                      title: "",
                      content: "",
                    });
                  }}
                  className="px-6"
                >
                  취소하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // 날짜와 시간 분리 및 시간 포맷 정리 함수
  const splitDateAndTime = (raw: string) => {
    if (!raw) return { date: '', time: '' };
    // 날짜(YYYY-MM-DD) + 나머지(시간)
    const match = raw.match(/(\d{4}-\d{2}-\d{2})\s*(.*)/);
    if (!match) return { date: raw, time: '' };
    const date = match[1];
    let timeRaw = match[2].trim();
    if (!timeRaw) return { date, time: '' };
    // 오전/오후 추출
    let ampm = '';
    let timePart = timeRaw;
    if (/오전|AM/i.test(timeRaw)) {
      ampm = '오전';
      timePart = timeRaw.replace(/오전|AM/ig, '').trim();
    } else if (/오후|PM/i.test(timeRaw)) {
      ampm = '오후';
      timePart = timeRaw.replace(/오후|PM/ig, '').trim();
    }
    // 시/분 추출
    let h = '', m = '';
    // 16시 40분, 16:40, 16시, 16:40분, 16시40분, 16시40
    let tMatch = timePart.match(/(\d{1,2})\s*시\s*(\d{1,2})?\s*분?/);
    if (tMatch) {
      h = tMatch[1].padStart(2, '0');
      m = tMatch[2] ? tMatch[2].padStart(2, '0') : '00';
    } else {
      // 16:40, 2:05
      tMatch = timePart.match(/(\d{1,2}):(\d{1,2})/);
      if (tMatch) {
        h = tMatch[1].padStart(2, '0');
        m = tMatch[2].padStart(2, '0');
      } else {
        // 16시, 16
        tMatch = timePart.match(/(\d{1,2})/);
        if (tMatch) {
          h = tMatch[1].padStart(2, '0');
          m = '00';
        }
      }
    }
    let time = '';
    if (h) {
      time = `${ampm ? ampm + ' ' : ''}${h}:${m}`;
    }
    return { date, time };
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[엑셀 업로드] 함수 진입');
    const file = e.target.files?.[0];
    if (!file) {
      alert('엑셀 파일이 선택되지 않았습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (evt) => {
      console.log('[엑셀 업로드] FileReader onload');
      const data = evt.target?.result;
      if (!data) {
        alert('엑셀 파일을 읽을 수 없습니다.');
        return;
      }
      try {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // 첫 번째 행은 헤더, 두 번째 행부터 데이터
        const header = rows[0] as string[];
        const dataRows = rows.slice(1);
        const newInquiries = dataRows.map((row: any[], idx: number) => {
          // 엑셀 헤더 인덱스 찾기
          const getIdx = (name: string) => header.findIndex(h => h === name);
          const nameIdx = getIdx('이름');
          const titleIdx = getIdx('문의제목');
          const phoneIdx = getIdx('연락처');
          const weddingHallIdx = getIdx('웨딩홀');
          const placeIdx = getIdx('장소');
          const ceremonyTypeIdx = getIdx('주례여부');
          const secondPartIdx = getIdx('2부');
          const dateIdx = getIdx('예식날짜');
          const statusIdx = getIdx('상태');
          const otherNotesIdx = getIdx('비고');
          const createdAtIdx = getIdx('생성일');
          // 날짜/시간 분리 및 정리
          let ceremonyDate = '';
          let ceremonyTime = '';
          if (row[dateIdx]) {
            const { date, time } = splitDateAndTime(row[dateIdx].toString());
            ceremonyDate = date;
            ceremonyTime = time;
          }
          // 2부 여부
          let secondPart = '';
          if (typeof row[secondPartIdx] === 'boolean') {
            secondPart = row[secondPartIdx] ? '2부 있음' : '2부 없음';
          } else if (typeof row[secondPartIdx] === 'string') {
            if (row[secondPartIdx].toLowerCase() === 'true') secondPart = '2부 있음';
            else if (row[secondPartIdx].toLowerCase() === 'false') secondPart = '2부 없음';
            else secondPart = row[secondPartIdx];
          }
          // 상태 매핑
          let status = '';
          if (row[statusIdx] === '문의') status = '문의';
          else if (row[statusIdx] === '예약완료') status = '확정';
          else status = row[statusIdx] || '';
          // 웨딩홀: '웨딩홀' 또는 '장소' 중 값이 있는 것
          let weddingHall = '';
          if (row[weddingHallIdx]) weddingHall = row[weddingHallIdx];
          else if (row[placeIdx]) weddingHall = row[placeIdx];
          // 예식종류: '주례 없는 예식' 또는 '주례 있는 예식'만 ceremonyType에 매핑
          let ceremonyType = '';
          if (row[ceremonyTypeIdx] === '주례 없는 예식' || row[ceremonyTypeIdx] === '주례 있는 예식') {
            ceremonyType = row[ceremonyTypeIdx];
          } else if (row[ceremonyTypeIdx]) {
            ceremonyType = row[ceremonyTypeIdx];
          }
          // 비고 → 기타 문의 사항
          let otherNotes = '';
          if (otherNotesIdx !== -1) {
            otherNotes = row[otherNotesIdx] || '';
          }
          // 생성일 → date, createdAt 모두에 값 할당
          let date = '';
          let createdAt = '';
          if (createdAtIdx !== -1 && row[createdAtIdx]) {
            date = row[createdAtIdx];
            createdAt = row[createdAtIdx];
          } else {
            date = new Date().toISOString().split('T')[0];
            createdAt = date;
          }
          // 사회자 이름에서 슬래시(/) 제거
          let mcName = '';
          const mcIdx = getIdx('사회자');
          if (mcIdx !== -1 && row[mcIdx]) {
            mcName = row[mcIdx].toString().replace(/\//g, '').trim();
            // mcList와 자동 매칭 (이름에서 / 제거 후 비교)
            const matched = mcList.find(
              (mc) => mc.name.replace(/\//g, '').trim() === mcName
            );
            if (matched) {
              mcName = matched.name;
            }
          }
          return {
            id: Date.now().toString() + '_' + idx,
            author: row[nameIdx] || '',
            title: row[titleIdx] || '',
            phone: row[phoneIdx] || '',
            weddingHall,
            ceremonyType,
            secondPart,
            ceremonyDate,
            ceremonyTime,
            status,
            otherNotes,
            date,
            createdAt,
            mc: mcName,
          };
        });
        // 유효한 데이터만 필터링
        const validInquiries = newInquiries.filter(
          (inquiry) => inquiry.title && inquiry.author && inquiry.mc
        );
        // 한 번에 전체 업로드
        const response = await fetch('/.netlify/functions/saveReservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validInquiries),
        });
        const result = await response.json();
        // 업로드 후 DB에서 다시 fetch해서 목록 갱신
        const updated = await fetchInquiries();
        setInquiries(updated);
        if (result.success) {
          alert(`엑셀 데이터가 ${result.insertedCount || validInquiries.length}개 성공적으로 업로드되었습니다!`);
        } else {
          alert('엑셀 업로드 중 오류가 발생했습니다: ' + (result.error || '알 수 없는 오류'));
        }
      } catch (err) {
        alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // 안전한 클립보드 복사 함수
  const safeCopyToClipboard = (text: string) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        alert('복사 기능을 지원하지 않는 브라우저입니다.');
      }
      document.body.removeChild(textarea);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // 문의 삭제 처리
  const handleInquiryDelete = async () => {
    if (!editingInquiry) return;
    if (!window.confirm("정말 이 문의를 삭제하시겠습니까?")) return;

    try {
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isDevelopment
        ? `http://localhost:3001/api/reservations/${editingInquiry.id}`
        : `/.netlify/functions/deleteReservation?id=${editingInquiry.id}`;
      const response = await fetch(apiUrl, { method: 'DELETE' });
      if (response.ok) {
        // 삭제 후 목록 새로고침
        const { data, totalCount } = await fetchInquiries(currentPage, itemsPerPage);
        setInquiries(data);
        setTotalCount(totalCount);
        alert("문의가 삭제되었습니다.");
        setShowInquiryEdit(false);
        setEditingInquiry(null);
      } else {
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-4">
        <div className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* 탭 네비게이션: 모든 관리 페이지에서 항상 보이게 */}
            <div className="flex justify-center items-center mt-8 mb-4" style={{ background: 'transparent', boxShadow: 'none', borderRadius: 0 }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-6 py-2 mx-2 text-base font-semibold border-b-2 transition-colors duration-150
                    ${currentTab === tab.id ? 'text-pink-500 border-pink-500 bg-transparent' : 'text-gray-700 border-transparent bg-transparent hover:text-pink-400'}`}
                  onClick={() => setCurrentTab(tab.id)}
                  style={{ minWidth: 0, background: 'transparent', borderRadius: 0 }}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            {renderTabContent()}
          </div>
        </div>
        {renderMcModal()}
        {renderEditMcModal()}
        {renderDeleteConfirmModal()}
        {renderInquiryEditModal()}
        {renderBannerModal()}
        {renderEditBannerModal()}
        {renderPromotionModal()}
        {renderTipsModal()}
      </div>
      <div className="w-full flex justify-center mt-8 mb-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="text-gray-600 hover:text-gray-900"
        >
          로그아웃
        </Button>
      </div>
    </div>
  );
}
