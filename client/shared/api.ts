// API 엔드포인트 환경변수 기반 통합
const BASE_URL = import.meta.env.VITE_API_URL || '';

// 타입 예시
export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  date?: string;
}
export interface MC {
  _id: string;
  name: string;
  region: string;
  profileImageBase64?: string;
  profileColor?: string;
  introduction?: string;
}
export interface Promotion {
  _id: string;
  title: string;
  image: string;
  link?: string;
  date?: string;
}
export interface Tip {
  _id: string;
  title: string;
  content: string;
  date?: string;
}
export interface Reservation {
  _id: string;
  author: string;
  ceremonyDate: string;
  ceremonyTime: string;
  weddingHall: string;
  status: string;
  [key: string]: any;
}

// 공통 fetcher
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  return response.json();
}

// 배너 목록
export const getBanners = (params = {}) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetcher<{ data: Banner[]; totalCount: number }>(`${BASE_URL}/banners?${query}`);
};
// 사회자 목록
export const getMCs = (params = {}) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetcher<{ data: MC[]; totalCount: number }>(`${BASE_URL}/mcs?${query}`);
};
// 프로모션 목록
export const getPromotions = (params = {}) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetcher<{ data: Promotion[]; totalCount: number }>(`${BASE_URL}/promotions?${query}`);
};
// 팁 목록
export const getTips = (params = {}) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetcher<{ data: Tip[]; totalCount: number }>(`${BASE_URL}/tips?${query}`);
};
// 예약 목록
export const getReservations = (params = {}) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetcher<{ data: Reservation[]; totalCount: number }>(`${BASE_URL}/reservations?${query}`);
};
// 예약 저장
export const saveReservation = (data: Partial<Reservation>) => {
  return fetcher<{ success: boolean }>(`${BASE_URL}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
// MC 저장
export const saveMC = (data: Partial<MC>) => {
  return fetcher<{ success: boolean }>(`${BASE_URL}/mcs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
// 배너 저장
export const saveBanner = (data: Partial<Banner>) => {
  return fetcher<{ success: boolean }>(`${BASE_URL}/banners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
// 프로모션 저장
export const savePromotion = (data: Partial<Promotion>) => {
  return fetcher<{ success: boolean }>(`${BASE_URL}/promotions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
// 팁 저장
export const saveTips = (data: Partial<Tip>) => {
  return fetcher<{ success: boolean }>(`${BASE_URL}/tips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}; 