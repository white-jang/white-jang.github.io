import React, { useCallback, useRef, useState } from "react";
import MemoInsert from "../components/Memo/MemoInsert";
import MemoList from "../components/Memo/MemoList";
import "./Memo.scss";

const Memo = () => {
  const [memos, setMemos] = useState([
    {
      id: 1,
      text: "<h2>하얀의 개인 프로젝트</h2><p>아자아자! 파이팅~</p>",
    },
  ]);

  const nextId = useRef(2);

  const onInsert = useCallback(
    // text 값을 받고 x, y 값은 이 곳에서 랜덤 생성
    (text) => {
      const memo = {
        id: nextId.current,
        text,
      };
      setMemos(memos.concat(memo));
      nextId.current += 1;
    },
    [memos]
  );

  return (
    <div className="memo-wraper">
      <div className="memo-write-box">
        <h1>Memo</h1>
        <h3>**메모를 자유롭게 남겨주세요.**</h3>
        <span>
          메모는 마크다운 언어를 호환합니다. 마크다운 언어로 작성해주시면
          됩니다.
        </span>
        <MemoInsert onInsert={onInsert} />
      </div>
      <MemoList memos={memos} />
    </div>
  );
};

export default Memo;
