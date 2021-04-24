import React, { useCallback, useRef, useState } from "react";
import MemoInsert from "../components/Memo/MemoInsert";
import MemoList from "../components/Memo/MemoList";
import "./Memo.scss";

const Memo = () => {
  const [memos, setMemos] = useState([
    {
      id: 1,
      x: 50,
      y: 150,
      text: "<h1>Our Project</h1>",
    },
  ]);

  const nextId = useRef(2);

  const onInsert = useCallback(
    // text, x, y 다 받아야 되는데 일단은 x,y 고정값
    (text) => {
      const memo = {
        id: nextId.current,
        x: 30,
        y: 200,
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
