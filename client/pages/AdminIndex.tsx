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
import { generateSampleInquiries } from "@/utils/generateSampleData";

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
  const itemsPerPage = 20;

  // 로그인 확인 및 데이��� 로드
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
      // 로그인이 유효하�� 시간을 7일 더 연장
      const newExpirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(
        "adminLoginExpiration",
        newExpirationTime.toString(),
      );
    }

    // localStorage에서 등록된 사회자 목록 불러오기
    const savedMCs = localStorage.getItem("registeredMCs");
    if (savedMCs) {
      setMcList(JSON.parse(savedMCs));
    }

    // localStorage에서 문의 데이터 불러오기
    const savedInquiries = localStorage.getItem("customerInquiries");
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    } else {
      // 문의 데이터가 없을 때만 샘플 데이터 생성
      const sampleInquiries = generateSampleInquiries();
      setInquiries(sampleInquiries);
      localStorage.setItem(
        "customerInquiries",
        JSON.stringify(sampleInquiries),
      );
    }

    // localStorage에서 배�� 데이터 불러오기
    const savedBanners = localStorage.getItem("bannerList");
    if (savedBanners) {
      setBannerList(JSON.parse(savedBanners));
    }

    // localStorage에서 프로모�� 데이터 불러오기
    const savedPromotions = localStorage.getItem("promotionList");
    if (savedPromotions) {
      setPromotionList(JSON.parse(savedPromotions));
    }

    // localStorage에서 팁 데이터 불러오기
    const savedTips = localStorage.getItem("tipsList");
    if (savedTips) {
      setTipsList(JSON.parse(savedTips));
    }
  }, []);

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

    const updatedMcList = [...mcList, newMc];
    setMcList(updatedMcList);
    localStorage.setItem("registeredMCs", JSON.stringify(updatedMcList));

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

    // BOM ���가 (한글 깨짐 방지)
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
  const handleInquiryUpdate = () => {
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === editingInquiry?.id ? editingInquiry : inquiry,
    );
    setInquiries(updatedInquiries);
    localStorage.setItem("customerInquiries", JSON.stringify(updatedInquiries));

    setShowInquiryEdit(false);
    setEditingInquiry(null);
  };

  // 배너 수�� 처리
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
  const handleMcDelete = () => {
    const updatedMcList = mcList.filter((mc) => mc.id !== mcToDelete?.id);
    setMcList(updatedMcList);
    localStorage.setItem("registeredMCs", JSON.stringify(updatedMcList));

    setShowDeleteConfirm(false);
    setMcToDelete(null);
  };

  const handlePromotionSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPromotion = {
      id: promotionList.length + 1,
      title: promotionFormData.title,
      content: promotionFormData.content,
      date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    const updatedPromotionList = [...promotionList, newPromotion];
    setPromotionList(updatedPromotionList);
    localStorage.setItem("promotionList", JSON.stringify(updatedPromotionList));

    setShowPromotionModal(false);
    setPromotionFormData({
      title: "",
      content: "",
    });
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = () => {
      const newBanner = {
        id: bannerList.length + 1,
        title: bannerFormData.title,
        image: reader.result as string,
        link: bannerFormData.link,
        date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      const updatedBannerList = [...bannerList, newBanner];
      setBannerList(updatedBannerList);
      localStorage.setItem("bannerList", JSON.stringify(updatedBannerList));

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

      const updatedBannerList = [...bannerList, newBanner];
      setBannerList(updatedBannerList);
      localStorage.setItem("bannerList", JSON.stringify(updatedBannerList));

      setShowBannerModal(false);
      setBannerFormData({
        title: "",
        image: null,
        link: "",
      });
    }
  };

  const handleTipsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTip = {
      id: tipsList.length + 1,
      title: tipsFormData.title,
      content: tipsFormData.content,
      date: new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    const updatedTipsList = [...tipsList, newTip];
    setTipsList(updatedTipsList);
    localStorage.setItem("tipsList", JSON.stringify(updatedTipsList));

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
        const totalPages = Math.ceil(sortedInquiries.length / itemsPerPage);
        const startIdx = (currentPage - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const pagedInquiries = sortedInquiries.slice(startIdx, endIdx);
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">문의 관리</h1>
              <Button
                onClick={exportToExcel}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                📊 엑셀 EXPORT
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
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
                      작성자
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      사회자
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      날짜
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedInquiries.length > 0 ? (
                    pagedInquiries.map((inquiry, index) => (
                      <tr
                        key={inquiry.id}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleInquiryClick(inquiry)}
                      >
                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {sortedInquiries.length - (startIdx + index)}
                        </td>
                        <td className="px-4 py-3 text-left text-sm text-gray-700">
                          {inquiry.title}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {inquiry.author}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {inquiry.mc || "-"}
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">
                          {inquiry.date}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <Badge
                            variant={
                              inquiry.status === "접수"
                                ? "destructive"
                                : inquiry.status === "처리중"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {inquiry.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                                          <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      등록된 문의가 없습니다.
                    </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* 페이지네이션 UI */}
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                이전
              </Button>
              <span className="mx-2 text-sm">
                {currentPage} / {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                다음
              </Button>
            </div>
          </div>
        );

      case "mcs":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">사회자 관리</h1>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => setShowMcModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                사회자 추가
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">배너 관리</h1>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => setShowBannerModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                배너 추가
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">프로모션 관리</h1>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => setShowPromotionModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                프로모션 추가
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
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
                  {promotionList
                    .slice()
                    .reverse()
                    .map((promotion, index) => (
                      <tr
                        key={promotion.id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-center text-sm">
                          {promotionList.length - index}
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">안내&TIP 관리</h1>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={() => setShowTipsModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                안내&TIP 추가
              </Button>
            </div>

            <div className="bg-white rounded-lg border">
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
                  {tipsList
                    .slice()
                    .reverse()
                    .map((tip, index) => (
                      <tr key={tip.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-center text-sm">
                          {tipsList.length - index}
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

  // 모달 ���더��� 함수들
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
                  placeholder="사회자 ���개를 입력하세요..."
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
                  프���필 이미지:
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
                  placeholder="사회자 ��개를 입력하세요..."
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
                삭제하시겠습���까?
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
                  value={editingInquiry.author && typeof editingInquiry.author === 'string' ? editingInquiry.author.replace(/�/g, '') : ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      author: e.target.value
                        .replace(/[\uFFFD]/g, "")
                        .replace(/�/g, ""),
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
                  value={editingInquiry.spouse && typeof editingInquiry.spouse === 'string' ? editingInquiry.spouse.replace(/[ -\u001f\u007f-\u009f]/g, "") : ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      spouse: e.target.value.replace(/[\u0000-\u001f\u007f-\u009f]/g, ""),
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
                  value={editingInquiry.mc && typeof editingInquiry.mc === 'string' ? editingInquiry.mc.replace(/�/g, '') : ''}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      mc: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">���회자 선택</option>
                  {mcList.map((mc) => (
                    <option key={mc.id} value={mc.name.replace(/�/g, '')}>
                      {mc.name.replace(/�/g, '')}
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
                  value={editingInquiry.weddingHall || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      weddingHall: e.target.value
                        .replace(/[\uFFFD]/g, "")
                        .replace(/�/g, ""),
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
                  value={editingInquiry.ceremonyType || ""}
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
                  type="time"
                  value={editingInquiry.ceremonyTime || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      ceremonyTime: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  처음 늘봄을 접한 경로:
                </label>
                <select
                  value={editingInquiry.howDidYouHear || ""}
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
                  <option value="네이버 카페 - 멕마웨">
                    네이버 카페 - 멕마웨
                  </option>
                  <option value="네이버 카페 - 광주결">
                    네이버 카페 - 광주결
                  </option>
                  <option value="네이버 카페 - 다이렉트 카페">
                    네이버 카페 - 다이렉트 카페
                  </option>
                  <option value="네이버 블로그">��이버 블로그</option>
                  <option value="네이버 검���">네이버 검색</option>
                  <option value="구글 검색">구글 검색</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="유튜브">유튜브</option>
                  <option value="웨딩홀 및 플래너 소개">
                    웨딩홀 및 플래너 소개
                  </option>
                  <option value="그 외 사이트">그 외 사이트</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추가 정보 (링크/검��어/업체명):
                </label>
                <input
                  type="text"
                  value={editingInquiry.linkUrl || ""}
                  onChange={(e) =>
                    setEditingInquiry({
                      ...editingInquiry,
                      linkUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="접한 경�� 관련 추가 정보"
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
                value={editingInquiry.otherNotes || ""}
                onChange={(e) =>
                  setEditingInquiry({
                    ...editingInquiry,
                    otherNotes: e.target.value
                      .replace(/[\uFFFD]/g, "")
                      .replace(/�/g, ""),
                  })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="기타 문의사항을 입력하세요..."
              />
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
                  ���록
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
              <h2 className="text-xl font-bold">배너 수���</h2>
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
                  배너 ���목:
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
                      <p className="text-sm text-gray-600 mb-2">현�� 이미지</p>
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
              <h2 className="text-xl font-bold">프���모션 추가</h2>
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
                  placeholder="안내&TIP 내용을 입력하���요..."
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        {" "}
        {/* 헤더 높이만큼 여백 추가 */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">늘봄 관리자</h1>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gray-600 hover:text-gray-900"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      currentTab === tab.id
                        ? "border-pink-400 text-pink-500"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
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
    </div>
  );
}
