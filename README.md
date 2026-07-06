# white-jang.github.io

개인 기술 블로그입니다.

[바로가기](https://white-jang.github.io)

<br>

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — 빌드 도구
- **Tailwind CSS** — 스타일링
- **react-router-dom v6** — HashRouter 기반 라우팅
- **unified / remark / rehype** — 마크다운 → HTML 변환
- **Shiki** — 코드 신택스 하이라이팅 (aurora-x 테마, 빌드 타임)
- **Supabase** — 조회수 · 좋아요 저장 (PostgreSQL + RPC)
- **GitHub Actions** — main 푸시 시 자동 배포

<br>

## 📂 File Structure

```
blog/
├── src/
│   ├── components/
│   │   ├── Header.tsx       # 상단 네비게이션 (Blog / About)
│   │   ├── BlogList.tsx     # 포스트 목록 + 태그 필터링
│   │   ├── BlogPost.tsx     # 개별 포스트 뷰
│   │   └── About.tsx        # 소개 페이지
│   ├── hooks/
│   │   ├── useTyping.ts     # 타이핑 애니메이션 훅
│   │   └── usePostStats.ts  # 조회수 · 좋아요 상태 훅 (Supabase)
│   ├── lib/
│   │   └── supabase.ts      # Supabase 클라이언트
│   ├── posts/               # 마크다운 포스트 파일 (.md)
│   ├── types/
│   │   └── post.ts          # Post / PostMeta 타입 정의
│   └── utils/
│       └── markdown.ts      # 포스트 로딩 유틸 (import.meta.glob)
├── vite.config.ts
└── tailwind.config.cjs
```

<br>

## ✍️ 포스트 작성 방법

`blog/src/posts/` 폴더에 마크다운 파일을 추가합니다.

파일명 형식: `YYYY-MM-DD-slug.md`

```markdown
---
title: 포스트 제목
date: 2025-06-26
tags: [typescript, react]
description: 포스트 한 줄 설명
---

본문 내용...
```

빌드 시 `import.meta.glob`으로 자동 수집되므로 별도 등록 없이 목록에 반영됩니다.

<br>

## 🌿 Branch

- `main` — 개발 및 소스 관리
- `gh-pages` — GitHub Actions로 자동 배포되는 브랜치

<br>

## 🔐 환경 변수

로컬 개발 시 `blog/.env` 파일을 생성하고 아래 값을 채웁니다.

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

GitHub 배포 시에는 Repository Settings → Secrets에 동일한 키를 등록합니다.

<br>

## 🚀 Commands

```bash
# 개발 서버
npm run dev

# 빌드
npm run build
```
