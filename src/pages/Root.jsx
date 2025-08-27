import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Loading from "./Loading";
import { useState } from "react";
import Character from "./Character";
import { useMediaQuery } from "react-responsive";
import Error from "./Error";

function Root() {
  const [step, setStep] = useState(0);
  const isMobile = useMediaQuery({ maxHeight: 600 }); // 모바일 기준
  const isLandscape = useMediaQuery({ orientation: "landscape" });
  const showWarning = isMobile && isLandscape;

  const onClickHandler = () => {
    setStep((prev) => Math.min(prev + 1, 2));
  };

  return (
    <>
      {showWarning && <Error />}
      {step === 0 && <Loading onClick={onClickHandler} />}
      {step === 1 && <Character onClick={onClickHandler} />}
      {step === 2 && (
        <>
          <div className="main">
            <Outlet />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
export default Root;
