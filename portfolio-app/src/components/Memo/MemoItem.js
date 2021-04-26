import React from "react";
import "./MemoItem.scss";

const MemoItem = ({ memo }) => {
  const text = memo.text;
  return (
    <div className="memo" dangerouslySetInnerHTML={{ __html: text }}></div>
  );
};

export default MemoItem;
