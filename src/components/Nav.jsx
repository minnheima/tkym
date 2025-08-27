import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Nav.css";
import { useMediaQuery } from "react-responsive";

function Nav() {
  const isMobile = useMediaQuery({ maxWidth: 768 }); // 모바일 기준
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    if (!isMobile) return; // 모바일일 때만 스크롤 감지

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 상태 반영
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobile]); // isMobile이 바뀔 때마다 다시 적용

  return (
    <nav
      className="navi-list"
      style={{
        opacity: isMobile && isScrolled ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <ul>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : undefined)}
            end
          >
            home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/fiction"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {isMobile ? `chap1` : `chapter1`}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/artwork"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {isMobile ? `chap2` : `chapter2`}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/after"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            after
          </NavLink>
        </li>
        <li>
          <NavLink to="https://x.com/tkym_webzine" target="_blank">
            ✻
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default Nav;
