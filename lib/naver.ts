import crypto from 'crypto';

// ===== 네이버 데이터랩 API =====
// 검색어 트렌드 조회
export async function getSearchTrend(keywords: string[], startDate: string, endDate: string) {
  const url = 'https://openapi.naver.com/v1/datalab/search';

  const body = {
    startDate,
    endDate,
    timeUnit: 'month',
    keywordGroups: keywords.map((keyword, index) => ({
      groupName: keyword,
      keywords: [keyword],
    })),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`데이터랩 API 오류: ${response.status}`);
  }

  return response.json();
}

// ===== 네이버 쇼핑 검색 API =====
// 쇼핑 상품 검색
export async function searchShopping(query: string, display: number = 20) {
  const url = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=${display}&sort=sim`;

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
    },
  });

  if (!response.ok) {
    throw new Error(`쇼핑 검색 API 오류: ${response.status}`);
  }

  return response.json();
}

// ===== 네이버 블로그 검색 API =====
export async function searchBlog(query: string, display: number = 10) {
  const url = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=${display}&sort=sim`;

  const response = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID || '',
      'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET || '',
    },
  });

  if (!response.ok) {
    throw new Error(`블로그 검색 API 오류: ${response.status}`);
  }

  return response.json();
}

// ===== 네이버 검색광고 API (키워드 검색량) =====
// HMAC-SHA256 서명 생성
function generateSignature(timestamp: string, method: string, path: string): string {
  const secretKey = process.env.NAVER_AD_SECRET_KEY || '';
  const message = `${timestamp}.${method}.${path}`;
  return crypto.createHmac('sha256', secretKey).update(message).digest('base64');
}

// 연관 키워드 및 검색량 조회
export async function getKeywordStats(keywords: string[]) {
  const baseUrl = 'https://api.naver.com';
  const path = '/keywordstool';
  const method = 'GET';
  const timestamp = String(Date.now());

  const params = new URLSearchParams({
    hintKeywords: keywords.join(','),
    showDetail: '1',
  });

  const signature = generateSignature(timestamp, method, path);

  const response = await fetch(`${baseUrl}${path}?${params}`, {
    method,
    headers: {
      'X-Timestamp': timestamp,
      'X-API-KEY': process.env.NAVER_AD_API_KEY || '',
      'X-Customer': process.env.NAVER_AD_CUSTOMER_ID || '',
      'X-Signature': signature,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`검색광고 API 오류: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ===== 유틸리티 함수 =====
// 날짜 포맷팅 (YYYY-MM-DD)
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// 최근 N개월 전 날짜
export function getMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return formatDate(date);
}

// 오늘 날짜
export function getToday(): string {
  return formatDate(new Date());
}

// 가격 범위 분석
export function analyzePriceRange(items: Array<{ lprice: string }>) {
  const prices = items.map(item => parseInt(item.lprice));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return { min, max, avg };
}

// 판매처 분석
export function analyzeShops(items: Array<{ mallName: string }>) {
  const shopCounts: Record<string, number> = {};
  items.forEach(item => {
    shopCounts[item.mallName] = (shopCounts[item.mallName] || 0) + 1;
  });

  return Object.entries(shopCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));
}
