import React from "react";
import TodoInsert from "../components/TodoInsert";
import TodoList from "../components/TodoList";
import TodoTemplate from "../components/TodoTemplate";
import "./Todo.scss";

const Todo = () => {
  return (
    <div className="todo-wraper">
      <TodoTemplate>
        <TodoInsert />
        <TodoList />
      </TodoTemplate>
    </div>
  );
};

export default Todo;
