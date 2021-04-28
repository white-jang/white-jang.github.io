# 포트폴리오 토이 프로젝트

![미리보기이미지](/img/capture1.png)  
[바로가기](https://white-jang.github.io/#/, "포트폴리오 링크")

<br>

## ⏱ Installation
- SCSS
- React (yarn)
  - react-router-dom
  - node-sass
  - class-names
  - react-transition-group
  - react-typing-effect
  - unified, remark-rehype, remark-parse, react-virtualized
  - gh-pages

<br>

## 📂 File Structure 
**components**  
- 컴포넌트 모음
  - Header
  - PageList
  - 📂 Memo, Todo
- reset용 css 파일
  - Eric Meyer’s “Reset CSS” 2.0 인용, 커스텀
  - @font-face로 "네오둥근모 import
   
**components/Memo**  
- Memo 페이지 관련 컴포넌트 모음  

**components/Todo**  
- Todo 페이지 관련 컴포넌트 모음  

**src/containers**  
- PageList 안에 들어가는 레이아웃 컴포넌트들 (...-wraper) 모음

<br>

## 🌵 Branchs
- ✔ main : 개발 및 빌드한 기본 브랜치
- ✔ gh-pages : gh-pages 라이브러리에 따라 관리되는 배포용 브랜치

<br>

## 💻 Coding Convention
- Naming Rules
  - Components, SCSS Files : 파스칼표기법
  - Variable, Methods : 카멜표기법
  - Class : 띄어쓰기 '-'로 사용 `<div class='logo-item'></div>`
- Prettier, ESLint
  - 기본 설정 사용

<br>

## 📚 Libraries
- react-router-dom
  - Header를 통해 페이지를 이동할 수 있도록 하기 위해 이용
- node-sass
  - SCSS로 작성한 스타일을 적용시키기 위해 이용
- class-names
  - 조건부 스타일 적용을 위해 TodoListItem에서 이용
- react-transition-group
  - 페이지를 이동할 때 화면 전환 애니메이션을 적용시키기 위해 이용
  - 이 [게시글](https://medium.com/@wdjty326/react-router-dom-v5-route-%EC%A0%84%ED%99%98-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EC%B2%98%EB%A6%AC-935dfc6cc475)을 참고
- react-typing-effect
  - About 페이지에서 한 마디를 강조하고 디자인 컨셉에 맞추기 위하여 이용
  - [npmjs.com](https://www.npmjs.com/package/react-typing-effect)을 참고하여 이용 (패키지 도구를 yarn으로 사용했기 때문에 명령어는 다르게 사용)
- unified, remark-rehype, remark-parse, react-virtualized
  - Memo 페이지에서 마크다운 언어로 작성한 메모를 HTML로 변환하기 위해 이용
  - 이 [게시글](https://www.daleseo.com/unified-remark-rehype/)을 참고
- gh-pages
  - white-jang.github.io로 배포하기 위해 이용

<br>
