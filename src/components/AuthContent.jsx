import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

const Protected = styled.div`
  padding: 50px 20px;
  min-height: 200px;
  font-size: 1rem;
`;
const Input = styled.input`
  height: 30px;
  margin: 30px 10px 0;
`;

function AuthContent({ type, item, textFilePath, renderContent }) {
  const [inputPassword, setInputPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sentence, setSentence] = useState("");
  const loadTextFile = async () => {
    if (!textFilePath) return; // artwork일 경우 파일 로딩 안함
    try {
      const res = await fetch(textFilePath);
      const text = await res.text();
      setSentence(text);
    } catch (err) {
      console.error("텍스트 파일을 불러오지 못했습니다", err);
      setSentence("텍스트를 불러올 수 없습니다.");
    }
  };

  const handlePasswordCheck = (e) => {
    e.preventDefault();
    if (inputPassword === item.password) {
      setIsAuthorized(true);
      loadTextFile();
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  useEffect(() => {
    if (!item.rating || item.rating < 19) {
      setIsAuthorized(true);
      loadTextFile();
    }
  }, [item]);

  if (item.rating >= 19 && !isAuthorized) {
    return (
      <>
        <Protected className="protected-content">
          <p>
            이 작품은 성인 인증 후 열람 가능합니다.
            <br />
            비밀번호는
            <b>
              <a href={item.hint} target="_blank">
                [이 책]
              </a>
            </b>
            의 ISBN 뒷 6자리 입니다.
          </p>
          <form>
            <Input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
            <button onClick={handlePasswordCheck}>확인</button>
          </form>
        </Protected>
        <Link to={`/${type.toLowerCase()}`}>
          <button>← Back</button>
        </Link>
      </>
    );
  }
  return renderContent(sentence); // artwork는 sentence 없이도 렌더링 가능하게 처리
}
export default AuthContent;
