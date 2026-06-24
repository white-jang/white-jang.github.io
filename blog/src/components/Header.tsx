import { NavLink } from "react-router-dom";
import { FaApple } from "react-icons/fa";

export default function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-2 py-0.5 text-sm transition-colors duration-150 ${
      isActive ? "bg-black text-white" : "hover:bg-black hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black flex items-center gap-6 px-4 py-2 text-[22px]">
      <nav className="flex items-center gap-1">
        <NavLink to="/" end className={linkClass}>
          Blog
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
      </nav>
    </header>
  );
}
