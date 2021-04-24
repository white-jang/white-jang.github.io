import React from "react";
import "./MemoItem.scss";

const MemoItem = ({ memo }) => {
  const codes = "<p><strong>dDD</strong></p>";
  const text = memo.text;
  return (
    <div className="memo" dangerouslySetInnerHTML={{ __html: text }}></div>
  );
};

export default MemoItem