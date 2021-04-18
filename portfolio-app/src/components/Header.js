import React from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { FaApple } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header-box">
      <FaApple />
      <ul>
        <li>
          <Link className="nav-item" to="/">
            About
          </Link>
        </li>
        <li>
          <Link className="nav-item" to="/memo">
            Memo
          </Link>
        </li>
        <li>
          <Link className="nav-item">Todo</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
