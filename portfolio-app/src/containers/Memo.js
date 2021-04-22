import React from "react";
import "./Memo.scss";

const Memo = () => {
  return (
    <div className="memo-wraper">
      <div className="memo">
        <h1>Memo</h1>
        <h3>**메모를 자유롭게 남겨주세요.**</h3>
        <span>
          메모는 마크다운 언어를 호환합니다. 마크다운 언어로 작성해주시면
          됩니다.
        </span>
        <form action="">
          <textarea
            name="text"
            id=""
            placeholder="**별 두 개 안에 글씨를 넣으면 진하게 효과가 들어가요.**"
          ></textarea>
          <button type="submit">Create Memo</button>
        </form>
      </div>
    </div>
  );
};

export default Memo;
