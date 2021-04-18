import React from "react";
import "./About.scss";

const About = () => {
  return (
    <div className="about-wraper">
      <div className="none-active-box">
        <h2>Who is White-Jang</h2>
        <hr />
        <div className="profile">
          <img src="/img/peach.png" alt="profile img" />
          <h1>장하얀 (White Clair Jang)</h1>
          <span>2021 순천향대학교 컴퓨터공학과 졸업</span>
          <br />
          <span>2021 UNIT UPF 2기 멘티</span>
          <br />
          <span>2021 고카톤 심사위원상</span>
          <br />
          <span>2020 멋쟁이사자처럼 X LOTTE 해커톤 은상</span>
          <br />
          <p>
            웹을 늘 사용하는 사람으로서 사용자 입장에서 친화적인 웹 서비스에
            대한 고민을 항상 자주 했습니다. 예술을 좋아하고 이야기를 전달하는
            것을 좋아하며 다양한 사람들에 대해 생각하는 저와, '사용자에게
            보여지는 것'과 '확실한 정보의 전달', '접근성' 같은 웹 프론트엔드와
            관련된 속성들이 저와 꼭 맞는 분야라고 말해주는 것 같습니다.
          </p>
          <a href="">Velog</a>
          <a href="">Notion</a>
          <a href="">GitHub</a>
        </div>
      </div>
    </div>
  );
};

export default About;
