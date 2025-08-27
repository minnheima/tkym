import "./TopBtn.css";
import { useState, useEffect } from "react";

function TopBtn() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const viewport = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      setShow(scrolled + viewport >= fullHeight - 2);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      className="top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    ></button>
  );
}
export default TopBtn;
