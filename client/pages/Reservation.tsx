import { Header } from "@/components/website/Header";
import { Footer } from "@/components/website/Footer";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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
      // 관리자 페이지와 동일하게 { data, totalCount } 구조 대응
      if (result && Array.isArray(result.data)) {
        return result;
      } else if (Array.isArray(result)) {
        // 혹시 배열만 올 때도 대응
        return { data: result, totalCount: result.length };
      } else {
        return { data: [], totalCount: 0 };
      }
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

export default function Reservation() {
  const [formData, setFormData] = useState({
    title: "",
    password: "",
    author: "",
    spouse: "",
    phone: "",
    mc: "",
    weddingHall: "",
    ceremonyType: "",
    secondPart: "",
    ceremonyDate: "",
    ceremonyTime: "",
    howDidYouHear: "",
    linkUrl: "",
    otherNotes: "",
  });

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [inquiryList, setInquiryList] = useState<any[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // 등록된 사회자 목록 불러오기
  const [mcList, setMcList] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // 사회자 목록 불러오기
      const mcData = await fetchMCs();
      const mcNames = mcData.map((mc: any) => mc.name);
      setMcList(mcNames);

      // 문의 목록 불러오기 (서버 페이징)
      const { data, totalCount } = await fetchInquiries(currentPage, itemsPerPage);
      // 관리자 페이지와 동일하게 데이터 매핑
      const mapped = Array.isArray(data) ? data.map((item: any, idx: number) => {
        let secondPart = item.secondPart;
        if (typeof secondPart === 'boolean') {
          secondPart = secondPart ? '2부 있음' : '2부 없음';
        } else if (typeof secondPart === 'string') {
          if (secondPart.toLowerCase() === 'true') secondPart = '2부 있음';
          else if (secondPart.toLowerCase() === 'false') secondPart = '2부 없음';
        }
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
        let status = item.status;
        if (status === '예약완료') status = '확정';
        else if (status === '문의') status = '문의';
        let date = item.date || item.createdAt || '';
        let createdAt = item.createdAt || item.date || '';
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
      setInquiryList(mapped);
      setTotalCount(totalCount);
    };
    loadData();
  }, [currentPage]);

  const handleInquiryClick = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setShowPasswordModal(true);
    setPasswordInput("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === selectedInquiry.password) {
      setShowPasswordModal(false);
      // 상세 정보 표시 (새 모달이나 페이지로)
      alert(
        `💒 문의 내용 확인\n\n📝 제목: ${selectedInquiry.title}\n👤 작성자: ${selectedInquiry.author}\n💑 배우자: ${selectedInquiry.spouse}\n📞 연락처: ${selectedInquiry.phone}\n🎤 사회자: ${selectedInquiry.mc}\n🏰 웨딩홀: ${selectedInquiry.weddingHall}\n📅 예식날짜: ${selectedInquiry.ceremonyDate}\n⏰ 예식시간: ${selectedInquiry.ceremonyTime}\n📋 기타사항: ${selectedInquiry.otherNotes}`,
      );
    } else {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    }
  };

  // 예식 종류
  const ceremonyTypes = ["주례 없는 예식", "주례 있는 예식"];

  // 2부 진행 여부
  const secondPartOptions = ["2부 있음", "2부 없음"];

  // 처음 늘봄을 접한 경로
  const howDidYouHearOptions = [
    "지인 소개",
    "네이버 카페 - 멕마웨",
    "네이버 카페 - 광주결",
    "네이버 카페 - 다이렉트 카페",
    "네이버 블로그",
    "네이버 검색",
    "구글 검색",
    "인스타그램",
    "유튜브",
    "웨딩홀 및 플래너 소개",
    "그 외 사이트",
    "울 수 있게"
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 새로운 문의글 생성
    const newInquiry = {
      id: Date.now().toString(), // 고유 ID
      ...formData,
      date: new Date().toISOString().split("T")[0],
      status: "접수",
    };

    // API를 통해 저장
    const success = await saveInquiry(newInquiry);

    if (success) {
      // 상태 업데이트하여 목록 새로고침
      const updatedInquiries = await fetchInquiries();
      setInquiryList(updatedInquiries);

      console.log("예약 문의 데이터:", newInquiry);
      alert(
        "✅ 예약 문의가 정상적으로 접수되었습니다!\n\n💝 소중한 문의 감사드리며, 빠른 시일 내에 연락드리겠습니다.",
      );

      // 폼 초기화
      setFormData({
        title: "",
        password: "",
        author: "",
        spouse: "",
        phone: "",
        mc: "",
        weddingHall: "",
        ceremonyType: "",
        secondPart: "",
        ceremonyDate: "",
        ceremonyTime: "",
        howDidYouHear: "",
        linkUrl: "",
        otherNotes: "",
      });
      setShowLinkInput(false);
    } else {
      alert("문의 접수에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 페이지네이션 계산
  // 서버에서 이미 페이징된 데이터만 받으므로 프론트에서 slice 불필요
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentInquiries = (inquiryList ?? []);

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-8">
            <span>HOME</span> &gt; <span>예약문의</span>
          </div>

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              예약문의
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              문의 전, 예약 확인 달력을 통해 늘봄 사회자들의 진행 가능 여부를
              확인해주세요
            </p>
          </div>

          {/* Detailed Inquiry Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid for smaller fields - 2 columns on large screens, 1 column on small */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 제목 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    제목 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="예약 문의합니다"
                  />
                </div>

                {/* 비밀번호 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    비밀번호 *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="비밀번호"
                  />
                </div>

                {/* 작성자 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    작성자 *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="홍길동"
                  />
                </div>

                {/* 배우자 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    배우자 *
                  </label>
                  <input
                    type="text"
                    name="spouse"
                    value={formData.spouse}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="홍길순"
                  />
                </div>

                {/* 연락처 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="010-1234-5678"
                  />
                </div>

                {/* 사회자 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    사회자 *
                  </label>
                  <select
                    name="mc"
                    value={formData.mc}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">사회자 선택</option>
                    {mcList.map((mc) => (
                      <option key={mc} value={mc.replace(/�/g, '')}>
                        {mc.replace(/�/g, '')} 사회자
                      </option>
                    ))}
                    <option value="상관없음">상관없음</option>
                  </select>
                </div>

                {/* 웨딩홀명 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    웨딩홀명 *
                  </label>
                  <input
                    type="text"
                    name="weddingHall"
                    value={formData.weddingHall}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="강남웨딩홀"
                  />
                </div>

                {/* 예식종류 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    예식종류 *
                  </label>
                  <select
                    name="ceremonyType"
                    value={formData.ceremonyType}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    {ceremonyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2부 진행 여부 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    2부 진행
                    <br />
                    여부 *
                  </label>
                  <select
                    name="secondPart"
                    value={formData.secondPart}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    {secondPartOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 예식날짜 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    예식날짜 *
                  </label>
                  <input
                    type="date"
                    name="ceremonyDate"
                    value={formData.ceremonyDate}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                    style={{
                      position: "relative",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* 예식시간 */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">
                    예식시간 *
                  </label>
                  <input
                    type="text"
                    name="ceremonyTime"
                    value={formData.ceremonyTime}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="예: 오후 1시, 14:00 등"
                    style={{ position: "relative", width: "100%", cursor: "text" }}
                  />
                </div>
              </div>

              {/* 처음 늘봄을 접한 경로 */}
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium text-gray-700 w-20 flex-shrink-0 pt-2">
                  처음 늘봄을
                  <br />
                  접한 경로 *
                </label>
                <div className="flex-1">
                  <select
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={(e) => {
                      handleInputChange(e);
                      const selectedValue = e.target.value;
                      setShowLinkInput(
                        selectedValue === "네이버 블로그" ||
                          selectedValue === "그 외 사이트" ||
                          selectedValue === "네이버 검색" ||
                          selectedValue === "구글 검색" ||
                          selectedValue === "웨딩홀 및 플래너 소개",
                      );
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">선택</option>
                    {howDidYouHearOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  {showLinkInput && (
                    <input
                      type={
                        formData.howDidYouHear === "네이버 블로그" ||
                        formData.howDidYouHear === "그 외 사이트"
                          ? "url"
                          : "text"
                      }
                      name="linkUrl"
                      value={formData.linkUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mt-2"
                      placeholder={
                        formData.howDidYouHear === "네이버 블로그" ||
                        formData.howDidYouHear === "그 외 사이트"
                          ? "[선택] 링크를 입력해주세요 (예: https://...)"
                          : formData.howDidYouHear === "네이버 검색" ||
                              formData.howDidYouHear === "구글 검색"
                            ? "[선택] 어떤 검색어로 찾으셨나요?"
                            : formData.howDidYouHear === "웨딩홀 및 플래너 소개"
                              ? "[선택] 업체명을 입력해주세요"
                              : "[선택] 내용을 입력해주세요"
                      }
                    />
                  )}

                  <p className="text-sm text-gray-600 mt-2">
                    접한 경로를 써주신 분 중에서 한 달마다 세 분씩을 선정하여
                    3만원 할인 쿠폰을 드립니다.
                  </p>
                </div>
              </div>

              {/* 기타 사항 */}
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium text-gray-700 w-32 flex-shrink-0 pt-2">
                  기타 문의 사항
                </label>
                <textarea
                  name="otherNotes"
                  value={formData.otherNotes}
                  onChange={handleInputChange}
                  rows={5}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="기타 문의사항을 적어주세요"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white py-3 px-6 rounded-lg font-medium"
                >
                  문의하기
                </Button>
              </div>
            </form>
          </div>

          {/* Reservation Inquiry History */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              예약 문의 현황
            </h2>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
              <table className="w-full table-fixed text-sm text-gray-700 font-normal bg-white">
                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 text-center font-medium text-gray-700 w-16 bg-gray-50">번호</th>
                    <th className="px-4 pl-4 py-2 text-left font-medium text-gray-700 bg-gray-50">제목</th>
                    <th className="px-2 py-2 text-center font-medium text-gray-700 w-28 bg-gray-50" style={{ whiteSpace: 'nowrap' }}>작성자</th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 w-28 bg-gray-50" style={{ whiteSpace: 'nowrap' }}>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {currentInquiries.length > 0 ? (
                    currentInquiries.map((inquiry, index) => (
                      <tr
                        key={inquiry.id}
                        className="border-b hover:bg-gray-50 cursor-pointer h-10"
                        onClick={() => handleInquiryClick(inquiry)}
                      >
                        <td className="px-2 py-2 text-center w-16 h-10 align-middle">{totalCount - index}</td>
                        <td className="px-4 pl-4 py-2 text-left h-10 align-middle">
                          <div className="flex items-center space-x-2">
                            <span>{inquiry.title}</span>
                            {inquiry.status === "확정" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                확정
                              </span>
                            )}
                            {inquiry.status === "예약완료" && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                예약완료
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-center w-28 h-10 align-middle" style={{ whiteSpace: 'nowrap' }}>{inquiry.author}</td>
                        <td className="px-2 py-2 text-center w-28 h-10 align-middle text-xs text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">{(inquiry.date || inquiry.createdAt || '').split('T')[0]}</td>
                      </tr>
                    ))
                  ) : inquiryList.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        등록된 문의가 없습니다.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <div className="bg-gray-100 rounded-lg py-2 px-4 shadow-sm flex space-x-2">
                  {/* 페이지네이션 버튼들 기존 코드 그대로 이 안에 위치 */}
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="px-2 py-1 text-gray-700 hover:text-pink-500"
                  >
                    맨처음
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 10))}
                    disabled={currentPage <= 10}
                    className="px-2 py-1 text-gray-700 hover:text-pink-500"
                  >
                    -10
                  </button>
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
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 py-1 rounded text-sm ${currentPage === page ? "bg-pink-500 text-white" : "text-gray-700 hover:bg-gray-100"}`}
                      >
                        {page}
                      </button>
                    ));
                  })()}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 10))}
                    disabled={currentPage > totalPages - 10}
                    className="px-2 py-1 text-gray-700 hover:text-pink-500"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-2 py-1 text-gray-700 hover:text-pink-500"
                  >
                    맨끝
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Contact Icons */}
          <div className="mt-16 text-center">
            <div className="flex justify-center items-center space-x-2 mb-8">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>

            {/* <h2 className="text-xl font-medium text-gray-800 mb-8">
              고은천 사회자 직접 상담하기
            </h2> */}

            <div className="flex justify-center items-center space-x-8 md:space-x-12">
              <a
                href="tel:010-3938-2998"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">전화</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">인스타그램</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* 비밀번호 확인 모달 */}
      {showPasswordModal && selectedInquiry && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPasswordModal(false);
              setPasswordInput("");
              setPasswordError("");
            }
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">비밀번호 확인</h3>
            <p className="text-gray-600 mb-4">
              게시글을 확인하시려면 비밀번호를 입력해주세요.
            </p>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePasswordSubmit();
                }
              }}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                  setPasswordError("");
                }}
              >
                취소
              </Button>
              <Button
                className="bg-pink-500 hover:bg-pink-600"
                onClick={handlePasswordSubmit}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
