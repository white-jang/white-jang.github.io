import React from "react";
import MemoItem from "./MemoItem";
import "./MemoList.scss";

const MemoList = ({ memos }) => {
  return (
    <div className="memo-list">
      {memos.map((memo) => (
        <MemoItem memo={memo} key={memo.id} />
      ))}
    </div>
  );
};

export default MemoList;
