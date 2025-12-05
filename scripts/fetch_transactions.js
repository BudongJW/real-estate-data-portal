/**
 * 실거래가 자동 수집 스크립트
 * - 국토부 OpenAPI 호출
 * - 법정동코드 + DEAL_YMD 조합으로 월별 실거래 데이터 수집
 * - Prisma로 PostgreSQL(DB)에 저장
 */

import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { parseStringPromise } from "xml2js";

const prisma = new PrismaClient();

// -------------------------
// 설정 부분
// -------------------------
const API_KEY = process.env.MOLIT_API_KEY; // 국토부 API 인증키
const LAWD_CODES = [
  "11110", // 종로구
  "11260", // 성북구 
  "11320", // 도봉구
  "11680", // 강남구
  "11560", // 영등포구
]; // 원하는 지역 확장 가능

// "YYYYMM" 형식의 최근 N개월 리스트 생성
function getRecentMonths(n) {
  const arr = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const ym =
      d.getFullYear().toString() +
      (d.getMonth() + 1).toString().padStart(2, "0");
    arr.push(ym);
  }
  return arr;
}

// 최근 3개월 수집 (원하면 변경 가능)
const MONTHS = getRecentMonths(3);

// -------------------------
// 실거래 호출 함수
// -------------------------
async function fetchDeals(lawdCode, ym) {
  const url =
    `http://api.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/` +
    `RTMSOBJSvc/getRTMSDataSvcAptTradeDev` +
    `?LAWD_CD=${lawdCode}&DEAL_YMD=${ym}&serviceKey=${API_KEY}`;

  const xml = await axios.get(url).then((res) => res.data);
  const json = await parseStringPromise(xml);

  if (!json?.response?.body?.[0]?.items?.[0]?.item) return [];
  return json.response.body[0].items[0].item;
}

// -------------------------
// DB 저장 함수
// -------------------------
async function saveDeals(items) {
  for (const it of items) {
    const apt = it.아파트?.[0] ?? "";
    const contractYM = it.년?.[0] + it.월?.[0].padStart(2, "0");
    const dealDay = it.일?.[0]?.padStart(2, "0");
    const price = parseInt(it.거래금액?.[0].replace(/,/g, ""), 10) || 0;

    const data = {
      si: it.시군구?.[0].split(" ")[0] ?? "",
      gu: it.시군구?.[0].split(" ")[1] ?? "",
      dong: it.법정동?.[0]?.trim() ?? "",
      aptName: apt.trim(),
      contractYM,
      contractDay: dealDay,
      area_m2: parseFloat(it.전용면적?.[0] ?? 0),
      floor: parseInt(it.층?.[0] ?? "0", 10),
      price_10k: price,
      builtYear: parseInt(it.건축년도?.[0] ?? "0", 10),
    };

    // 고유 ID 구성
    const uniqueId = `${data.aptName}-${data.contractYM}-${data.contractDay}-${data.area_m2}-${data.floor}`.replace(
      /\s+/g,
      "_"
    );

    await prisma.transaction.upsert({
      where: { id: uniqueId },
      update: {},
      create: { id: uniqueId, ...data },
    });
  }
}

// -------------------------
// 메인 로직
// -------------------------
async function main() {
  console.log("▶ 실거래 수집 시작");

  for (const ym of MONTHS) {
    for (const code of LAWD_CODES) {
      console.log(`▶ 수집중: DEAl_YMD=${ym}, LAWD_CD=${code}`);

      try {
        const items = await fetchDeals(code, ym);
        if (items.length === 0) {
          console.log(`  → 데이터 없음`);
          continue;
        }

        await saveDeals(items);
        console.log(`  → 저장 완료 (${items.length}건)`);
      } catch (err) {
        console.error("  X 오류:", err.message);
      }
    }
  }

  console.log("▶ 모든 수집 완료");
  await prisma.$disconnect();
}

main();
