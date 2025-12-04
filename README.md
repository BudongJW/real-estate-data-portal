# 🏠 Real Estate Data Hub  
한국 부동산 실거래·전세·가격지수 데이터를 조회하고 시각화하는 웹 플랫폼  
Next.js 기반 풀사이클(Front + API + DB) 프로젝트

---

## 📌 소개

**Real Estate Data Hub**는 한국 부동산 시장 데이터를 누구나 쉽게 조회할 수 있도록 하기 위한  
오픈 데이터 웹사이트 개발 프로젝트입니다.

- 실거래가 조회  
- 구/동 단위 가격 비교  
- 월별 가격 추세 시각화  
- 부동산 데이터 API 제공  
- CSV → DB 자동 적재 파이프라인 구축  

데이터 분석 레포지토리(**real-estate-data-lab**)와 연계되어  
웹 기반 시각화 및 서비스 운영을 목표로 합니다.

---

## 🚀 주요 기능

- 📊 **지역별 매매가 차트**  
- 🏘️ **구/동 기반 데이터 비교**  
- 🧭 **시/구 선택 UI (RegionPicker)**  
- 🔄 **Next API Routes로 실시간 데이터 제공**  
- 🗄️ **Prisma + PostgreSQL 기반 구조화된 DB**  
- 📦 **GitHub Actions를 통한 주기적 데이터 적재**  
- 🌐 **Vercel 자동 배포**

---

## 🛠 기술 스택

### **Frontend**
- Next.js 14 (App Router)
- React
- TypeScript
- TailwindCSS
- Chart.js + react-chartjs-2

### **Backend / API**
- Next.js API Routes
- Zod (입력 검증)
- Ky (HTTP Client)

### **Database**
- PostgreSQL (Supabase / Neon / RDS 등)
- Prisma ORM

### **DevOps**
- GitHub Actions(CSV → DB ingest pipeline)
- Vercel (프론트 + API 배포)
- .env 환경관리

---

## 🧰 개발 환경 세팅

### 1) 저장소 클론
```bash
git clone https://github.com/USERNAME/real-estate-data-hub.git
cd real-estate-data-hub
```

### 2) 패키지 설치
```bash
npm install
```

### 3) 환경변수 설정(.env)
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
```

## 🗄️ 데이터베이스 설정

### Prisma Client 생성
```bash
npx prisma generate
```

### DB 마이그레이션
```bash
npx prisma migrate dev --name init
```

### Prisma Studio로 DB 확인
```bash
npx prisma studio
```

## 🧩 로컬 서버 실행
```bash
npm run dev
```

## 🔄 데이터 적재(ingest) 자동화

GitHub Actions 워크플로우가 data/*.csv 파일을 읽어 DB에 upsert 하도록 구성되어 있다.  
스케줄 기반 자동 실행과 수동 실행을 모두 지원한다.

### GitHub Actions 워크플로우 실행 방법

1. GitHub → Actions → *Ingest CSV to DB* 워크플로우 선택  
2. "Run workflow" 클릭으로 수동 실행 가능  
3. 스케줄(cron)로 주기 실행됨

워크플로우 주요 단계 요약:
- 저장소 체크아웃
- Node 환경 세팅
- 의존성 설치
- Prisma 클라이언트 생성
- ingest 스크립트 실행 (DATABASE_URL 필요)

예시 환경변수(레포 Secrets 또는 Vercel env와 동일 키 사용):
    
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require

ingest 스크립트 예시(간단 개념, 실제 CSV 헤더에 맞춰 파싱 수정):

    // scripts/ingest.js (개요)
    // - data/sample.csv 읽기
    // - 각 행을 Prisma로 upsert
    // - 고유 식별키는 아파트명/연월/일/면적/층 조합 등으로 구성

---

## 🌐 배포 방법 (Vercel)

### 1) 프로젝트 연결
- Vercel 로그인 → New Project → GitHub 연동 → real-estate-data-hub 선택

### 2) 환경변수 설정
Vercel Dashboard → Settings → Environment Variables

    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require

### 3) 빌드/배포
- main 브랜치에 push 하면 자동 배포됨
- 수동으로 Redeploy 가능

배포 완료 후 접근 URL 예시:

    https://real-estate-data-hub.vercel.app/

### 4) 캐싱/성능 팁
- API Route에 캐시 헤더 설정(예: public, max-age=3600)
- 정적 세그먼트는 ISR(Incremental Static Regeneration) 고려
- 대용량 응답은 Pagination 적용

---

## 📌 향후 계획 (To-Do)

- [ ] 부동산 실거래 지도 시각화(Leaflet/Mapbox)  
- [ ] 전세가율 기반 위험도 점수화  
- [ ] 거래량 기반 열지도(Heatmap)  
- [ ] 지역별 검색 페이지 최적화  
- [ ] API Rate Limit/캐싱 추가  
- [ ] 사용자 즐겨찾기 기능  

---

## 📢 만든 사람

**부동산쟁이 견문록 | Real Estate Insight Creator**  
한국 부동산 콘텐츠를 만들고 있습니다.  









