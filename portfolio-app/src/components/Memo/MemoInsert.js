import React, { useState, useCallback } from "react";
import unified from "unified";
import markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import html from "rehype-stringify";
import "./MemoInsert.scss";

const MemoInsert = ({ onInsert }) => {
  const [text, setText] = useState("");

  const onChange = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      const mdTree = unified()
        .use(markdown)
        .use(remark2rehype)
        .use(html)
        .processSync(text).contents;
      // 텍스트 형태의 Markdown을 구문 트리(abstract tree)로 바꾼 후 HTML 텍스트로 변환
      // remark-rehype 패키지를 이용해서 Markdown을 HTML로 변환
      // rehype-stringify 패키지를 이용해서 HTML을 텍스트 형태로 변환
      onInsert(mdTree);
      setText("");
      e.preventDefault(); // 함수 호출
    },
    [onInsert, text]
  );

  return (
    <div className="memo-insert">
      <form onSubmit={onSubmit}>
        <textarea
          name="text"
          value={text}
          placeholder="**별 두 개 안에 글씨를 넣으면 진하게 효과가 들어가요.**"
          onChange={onChange}
        ></textarea>
        <button type="submit">Create Memo</button>
      </form>
    </div>
  );
};

export default MemoInsert;
