import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.scss";
import { FaApple } from "react-icons/fa";

const Header = () => {
  const activStyle = {
    backgroundColor: "black",
    color: "white",
  };

  return (
    <div className="header-box">
      <FaApple />
      <ul>
        <li>
          <NavLink
            className="nav-item"
            exact
            activeStyle={activStyle}
            to="/"
            children="/"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-item"
            activeStyle={activStyle}
            to="/memo"
            children="memo"
          >
            Memo
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-item"
            activeStyle={activStyle}
            to="/todo"
            children="todo"
          >
            Todo
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Header;
