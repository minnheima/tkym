import { useEffect, useState } from "react";
import TextPolisher from "./TextPolisher";

function AfterText({ file }) {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(file)
      .then((res) => res.text())
      .then((data) => setContent(data))
      .catch((err) => console.error("파일 불러오기 실패:", err));
  }, [file]);

  return <TextPolisher raw={content} className="after-content" />;
}

export default AfterText;
