import React, { useState, useRef, useCallback } from "react";
import TodoInsert from "../components/Todo/TodoInsert";
import TodoList from "../components/Todo/TodoList";
import TodoTemplate from "../components/Todo/TodoTemplate";
import "./Todo.scss";

const Todo = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "리액트의 기초 알아보기", checked: true },
    { id: 2, text: "컴포넌트 스타일링 해보기", checked: true },
    { id: 3, text: "일정 관리 앱 만들어보기", checked: false },
  ]);

  const nextId = useRef(4); // useRef를 사용하여 초기 id값 설정

  // todo 객체 생성 후 불변성을 유지하면서 업데이트
  // useCallback을 활용해서 렌더링 성능 최적화
  const onInsert = useCallback(
    (text) => {
      console.log(text);
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      setTodos(todos.concat(todo));
      nextId.current += 1;
    },
    [todos]
  );

  // 삭제 기능
  const onRemove = useCallback(
    (id) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos]
  );

  // 토글 기능
  const onToggle = useCallback(
    (id) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo
        )
      );
    },
    [todos]
  );

  return (
    <div className="todo-wraper">
      <TodoTemplate>
        <TodoInsert onInert={onInsert} />
        <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
      </TodoTemplate>
    </div>
  );
};

export default Todo;
