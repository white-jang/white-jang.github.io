import React from "react";
import {
  FaBloggerB,
  FaGithub,
  FaHtml5,
  FaCss3,
  FaPython,
  FaReact,
  FaJava,
  FaAndroid,
} from "react-icons/fa";
import { SiNotion } from "react-icons/si";
import { DiJavascript1, DiDjango, DiMysql } from "react-icons/di";
import ReactTypingEffect from "react-typing-effect";
import "./About.scss";

const About = () => {
  return (
    <div className="about-wraper">
      <div className="none-active-box">
        <h2>Who is White-Jang</h2>
        <hr />
        <div className="profile">
          <img src="/img/peach.png" alt="profile img" />
          <div className="profile-text">
            <h1>장하얀 (White Clair Jang)</h1>
            <span>2021 순천향대학교 컴퓨터공학과 졸업</span>
            <br />
            <span>2021 UNIT UPF 2기 멘티</span>
            <br />
            <span>2021 고려대학교 '고카톤' 심사위원상</span>
            <br />
            <span>2020 '멋쟁이사자처럼 X LOTTE 해커톤' 은상</span>
            <br />
          </div>
          <ReactTypingEffect
            className="typing"
            text={[
              `Hello, World!`,
              `I'm Clair...`,
              `제 취미는 영화, 음악 감상입니다.`,
              `사실... 게임도 좋아해요... ㅎㅎ`,
              `이렇게 말하니까 마치 언더테일 같네요!`,
              `이 페이지에 방문해주셔서 감사합니다.`,
            ]}
            speed={100}
            eraseSpeed={100}
          />
          <p>
            웹을 늘 사용하는 사람으로서 사용자 입장에서 친화적인 웹 서비스에
            대한 고민을 항상 했습니다. 예술을 좋아하고 이야기를 전달하는 것을
            좋아하며 다양한 사람들에 대해 생각하는 저와, '사용자에게 보여지는
            것'과 '확실한 정보의 전달', '접근성' 같은 웹 프론트엔드와 관련된
            속성들이 저와 꼭 맞는 분야라고 말해주는 것 같습니다.
          </p>
          <div className="links">
            <a href="https://github.com/white-jang">
              <FaGithub />
              GitHub
            </a>
            <a href="https://www.notion.so/remarkablewhite/Clair-White-Jang-151ace3ed5b54446958ae2bc83092788">
              <SiNotion />
              Notion
            </a>
            <a href="https://velog.io/@white-jang">
              <FaBloggerB />
              Velog
            </a>
          </div>
        </div>
      </div>
      <div className="active-box">
        <h2>The Skills she have.</h2>
        <div className="skills-box">
          <div>
            <h1>Familiar</h1>
            <FaHtml5 />
            <span>HTML</span>
            <FaCss3 />
            <span>CSS</span>
            <DiJavascript1 />
            <span>JavaScript</span>
            <FaPython />
            <span>Python</span>
            <FaGithub />
            <span>Git/GitHub</span>
          </div>
          <div>
            <h1>Moderate</h1>
            <FaReact />
            <span>React</span>
            <DiDjango />
            <span>Django</span>
            <FaJava />
            <span>JAVA</span>
          </div>
          <div>
            <h1>Tried</h1>
            <span>OpenCV</span>
            <FaAndroid />
            <span>Android (JAVA)</span>
            <DiMysql />
            <span>MySQL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
