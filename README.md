# 🚇 line4thon 18team - Frontend

서비스 소개: **DOTLO** — 저장한 장소와 여행 취향을 바탕으로 AI가 여행 일정을 생성하고, 자연어로 수정할 수 있는 여행 계획 서비스입니다.

## 🛠 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Language | TypeScript |
| Library | React |
| Build Tool | Vite |
| Package Manager | npm |
| IDE | VS Code (권장) |

## 👥 역할 분담

| 파트 | 담당 | 주요 업무 |
| --- | --- | --- |
| FE1 |  | 여행 준비·장소 수집 (서비스 진입, Takeout 업로드, 장소 검색·선택·삭제, 여행 조건 입력, 일정 생성 요청·로딩) |
| FE2 |  | 일정 결과·편집 (일자별 일정·이동시간 표시, 장소 삭제·순서 변경, 자연어 수정, 전후 비교·적용·되돌리기, 일정 저장·조회 연동) |

### 담당별 백엔드 연동

| 파트 | 연동 대상 |
| --- | --- |
| FE1 | BE1 파일 업로드 API, BE2 장소 검색 API, BE3 일정 생성 요청 API |
| FE2 | BE3 일정 생성 결과·수정·검증 API, BE2 경로 데이터, BE1 일정 저장·조회 API |

## 🚀 로컬 실행 방법

### 0. 준비

- Node.js 22.12 이상인 LTS 버전
- npm
- Git
- VS Code (권장)

설치 여부를 확인합니다.

```bash
node -v
npm -v
git --version
```

### 1. 레포 받기

본인 계정으로 **Fork** 한 뒤 clone 합니다.

```bash
git clone https://github.com/<내 아이디>/<포크한 레포 이름>.git
cd <포크한 레포 이름>
git remote add upstream https://github.com/line4thon-18team/frontend.git
```

### 2. 패키지 설치

```bash
npm ci
```

- 레포에 저장된 `package-lock.json` 기준으로 설치합니다.
- 패키지를 추가하거나 변경할 때는 `npm install`을 사용하고, 변경된 `package-lock.json`도 함께 커밋합니다.

### 3. 환경변수 파일 만들기

`.env.example`을 복사해서 `.env`를 만들고 값을 채웁니다. (`.env`는 git에 올라가지 않습니다)

**macOS / Linux / Git Bash**

```bash
cp .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| VITE_API_BASE_URL | 백엔드 API 주소 | http://localhost:8080 |

`.env.example`에는 다음 내용을 작성합니다.

```dotenv
VITE_API_BASE_URL=http://localhost:8080
```

- 코드에서는 `import.meta.env.VITE_API_BASE_URL`로 사용합니다.
- 환경변수를 변경한 뒤에는 개발 서버를 다시 실행합니다.
- `VITE_`로 시작하는 값은 브라우저에 공개되므로 비밀번호나 서버용 비밀키를 넣지 않습니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

→ 터미널에 표시된 주소로 접속합니다. 기본 주소는 `http://localhost:5173`입니다.

- API를 사용하는 기능은 백엔드 서버도 실행해야 합니다.
- 백엔드 기본 주소는 `http://localhost:8080`입니다.

### 5. 코드 검사·빌드

```bash
npm run lint
npm run build
```

빌드 결과를 로컬에서 확인하려면 다음 명령을 실행합니다.

```bash
npm run preview
```

## 🤝 협업 규칙

### 작업 흐름

1. **Issue 생성** — 할 일을 이슈로 먼저 등록
2. **최신 코드 받기** — `git switch main` → `git pull upstream main`
3. **브랜치 생성** — `git switch -c feat/기능이름`
4. **작업 후 확인** — `npm run lint`, `npm run build` 실행 및 담당 화면 동작 확인
5. **내 포크에 push** — `git push origin 브랜치이름`
6. **PR 생성** — 팀 레포 `main`으로, 설명에 `Closes #이슈번호`
7. **리뷰** — 팀원 **1명 승인** 후 머지

### 브랜치 이름

| 접두어 | 용도 | 예시 |
| --- | --- | --- |
| feat/ | 새 기능 | feat/takeout-upload |
| fix/ | 버그 수정 | fix/itinerary-order |
| refactor/ | 코드 개선 | refactor/place-card |
| docs/ | 문서 | docs/readme |
| chore/ | 설정, 기타 | chore/init-project |

### 커밋 메시지

```text
feat: Takeout 파일 업로드 화면 추가
fix: 일정 순서 변경 후 화면 갱신 오류 수정
docs: README 실행 방법 추가
```

`feat`, `fix`, `refactor`, `docs`, `chore`, `test` 중 하나로 시작합니다.

### 이슈 / PR 제목

`[Feat] 기능 설명`, `[Fix] 버그 설명`처럼 대괄호로 종류를 표시합니다.

### 프론트엔드 공통 규칙

- 컴포넌트 파일은 `PascalCase`로 작성합니다. 예: `PlaceCard.tsx`
- 공통 컴포넌트·타입을 변경할 때는 다른 담당자에게 공유합니다.
- API 요청 함수는 `api/`에서 관리합니다.
- API 요청 화면은 로딩·실패·데이터 없음 상태를 함께 처리합니다.
- 일정 데이터와 API 요청·응답 형식은 프론트엔드·백엔드가 합의한 형태를 사용합니다.
- UI가 변경된 PR에는 스크린샷과 확인 방법을 첨부합니다.
- `.env`, `node_modules`, `dist`는 커밋하지 않습니다.