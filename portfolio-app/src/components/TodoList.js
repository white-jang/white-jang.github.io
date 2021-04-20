import React from "react";
import "./TodoList.scss";
import TodoListItem from "./TodoListItem";

const TodoList = () => {
  return (
    <div className="TodoList">
      <TodoListItem />
      <TodoListItem />
    </div>
  );
};

export default TodoList;
