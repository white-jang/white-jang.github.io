import { FaGithub, FaBloggerB } from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import { useTyping } from "../hooks/useTyping";

const TYPING_TEXTS = [
  "Hello, World!",
  "I'm White...",
  "Thank you for visiting this page.",
];

export default function About() {
  const typed = useTyping(TYPING_TEXTS, 80);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-wrap gap-8 justify-center items-start">
      {/* Profile card */}
      <div className="bg-white border border-black shadow-pixel w-[500px] max-w-full">
        <h2 className="text-xs text-center py-1 border-b border-black tracking-wide">
          Who is whitejang
        </h2>
        <div className="p-5">
          <div className="flex gap-4">
            <img
              src="/img/peach.png"
              alt="profile"
              className="w-28 h-28 object-cover flex-shrink-0"
            />
            <div className="text-sm">
              <h1 className="text-lg font-bold mt-1 mb-1.5">whitejang</h1>
              <p className="mt-4 text-sm text-justify leading-6 text-gray-700">
                위기는 기회로! 🚀
                <br />
                주니어 프론트엔드 개발자로서 공부하고 경험한 내용을 기록하는
                블로그입니다.
              </p>
            </div>
          </div>

          <p className="bg-black text-white text-sm px-2 py-1 mt-4 min-h-[2em] font-mono">
            {typed}
            <span className="animate-pulse">|</span>
          </p>

          <div className="flex gap-2 mt-4 flex-wrap">
            <a
              href="https://github.com/white-jang"
              className="flex items-center gap-1 px-2 py-0.5 text-sm border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
            >
              <FaGithub />
              GitHub
            </a>
            <a
              href="https://www.notion.so/remarkablewhite/Clair-White-Jang-151ace3ed5b54446958ae2bc83092788"
              className="flex items-center gap-1 px-2 py-0.5 text-sm border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
            >
              <SiNotion />
              Notion
            </a>
            <a
              href="https://velog.io/@white-jang"
              className="flex items-center gap-1 px-2 py-0.5 text-sm border border-transparent hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
            >
              <FaBloggerB />
              Velog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
