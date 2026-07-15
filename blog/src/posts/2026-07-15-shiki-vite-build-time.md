---
title: Shiki + Vite: 런타임 처리로 인한 번들 증가 문제 해결
date: 2026-07-15
tags: [vite, troubleshooting]
description: 블로그에 shiki를 적용하면서 생겼던 번들 문제를 해결한 기록
---

## 문제

`@shikijs/rehype`를 설치하고 빌드하자 `dist/` 아래 JS 청크 파일이 240개 넘게 생성됐다.
초기 번들도 `index.js` 486KB + `wasm.js` 622KB (oniguruma WASM) 로 급증했다.

```
dist/assets/javascript-wDzz0qaB.js   174KB
dist/assets/typescript-BPQ3VLAy.js   181KB
dist/assets/wasm-CG6Dc4jp.js         622KB  ← oniguruma WASM
dist/assets/index-D_NAKz1Q.js        486KB
... (240개+)
```

## 원인

마크다운을 **브라우저 런타임**에서 처리하는 구조였다.

```
사용자가 포스트 접근
  → getPost() 호출
  → unified 파이프라인 실행 (브라우저에서)
  → Shiki 하이라이터 초기화
  → WASM 다운로드 + 언어 그래머 로드
```

Shiki 내부에서 언어 그래머를 `import()` 로 동적으로 불러오는데,
Vite의 정적 분석이 **가능한 모든 언어 파일을 청크로 생성**해버렸다.
실제로 15개 언어만 지정했지만 전체 언어 목록이 `dist/`에 포함됐다.

## 해결책

마크다운 처리를 **빌드 타임으로 이동** — Vite 플러그인으로 `.md` 파일을 빌드 중에 HTML로 변환한다.

### 핵심 아이디어

`.md` 파일을 import할 때 Vite 플러그인이 가로채서 미리 처리된 JS 객체로 반환한다.

```ts
// vite-plugin-md.ts
export function mdPlugin(): Plugin {
  return {
    name: "vite-plugin-md",
    async transform(code, id) {
      if (!id.endsWith(".md")) return null;

      // 빌드 타임에 Shiki + unified 실행 (Node.js)
      const html = await processMarkdown(code);
      const post = { slug, title, date, tags, description, html };

      // 브라우저에는 순수 JSON만 전달
      return { code: `export default ${JSON.stringify(post)}` };
    },
  };
}
```

브라우저에서 `.md`를 import하면 이미 처리된 `Post` 객체를 받는다.

### 추가로 해결한 문제: CJS vs ESM 충돌

`unified`, `shiki` 등이 ESM-only 패키지라 Vite의 CJS 로더와 충돌했다.

```
Error [ERR_REQUIRE_ESM]: require() of ES Module unified/index.js not supported.
```

**해결**: `package.json`에 `"type": "module"` 추가 후, `module.exports`를 쓰는 설정 파일들을 `.cjs`로 변경.

```
tailwind.config.js  →  tailwind.config.cjs
postcss.config.js   →  postcss.config.cjs
```

## 변경 파일 목록

| 파일                     | 변경 내용                                                        |
| ------------------------ | ---------------------------------------------------------------- |
| `vite-plugin-md.ts`      | 신규 — 빌드타임 마크다운 변환 플러그인                           |
| `vite.config.ts`         | `mdPlugin()` 추가                                                |
| `tsconfig.node.json`     | `vite-plugin-md.ts` include 추가                                 |
| `src/vite-env.d.ts`      | `*.md` 모듈 타입 선언 추가                                       |
| `src/utils/markdown.ts`  | 런타임 처리 코드 제거, 단순 glob import로 변경                   |
| `src/pages/BlogPost.tsx` | async/useEffect 제거, 동기 호출로 변경                           |
| `package.json`           | `"type": "module"` 추가, 빌드 전용 패키지 devDependencies로 이동 |
| `tailwind.config.js`     | `.cjs`로 변경                                                    |
| `postcss.config.js`      | `.cjs`로 변경                                                    |

## 결과

| 항목             | 이전                  | 이후        |
| ---------------- | --------------------- | ----------- |
| JS 청크 파일 수  | 240개+                | 1개         |
| JS 번들 크기     | 486KB + WASM 622KB    | 180KB       |
| gzip             | ~387KB                | 60KB        |
| 포스트 로딩 방식 | async (WASM 다운로드) | 즉시 (동기) |

## 요약

Node.js 기본값이 CJS  
 ↓  
shiki/unified는 ESM-only라 충돌  
 ↓  
package.json에 "type": "module" 추가 (ESM으로 변경)  
 ↓  
tailwind.config.js, postcss.config.js가 module.exports (CJS 문법)와 충돌  
 ↓  
.cjs 확장자로 변경 → "이 파일만 CJS로 읽어줘"
