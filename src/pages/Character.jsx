import "./Character.css";
function Character({ onClick }) {
  return (
    <div className="cha-wrap" onClick={onClick}>
      <div className="cha-row">
        <h2 className="cha-title">Character</h2>
        <ul className="cha-list">
          <li>
            TAKI(20)
            <div className="cha-frame taki"></div>
          </li>
          <li>
            YUMA(21)
            <div className="cha-frame yuma"></div>
          </li>
        </ul>
        <div className="story">
          <h3>Story</h3>
          <p className="story-p">
            애매한 시기의 전학으로 친구 하나 없이 학창시절을 마무리할 위기에
            처한
            <br /> 고교생 나카키타 유마.
            <br /> 어느 날 옆학교 1학년인 타카야마 리키가 말을 걸어오면서부터
            <br /> 두 사람은 매일 함께 귀가하게 되는데.... <br />
            “너 집이 이쪽 방향이 아니었어?” <br />
            “그래도 제 얼굴 보니까 행복하죠?”
            <br /> 친구가 갖고 싶은 거지 남자친구는 아니었다고! 하지만 어쩐지
            부정할 수가 없어!
            <br /> 고조되는 심장 박동 소리. 이 감정의 정체는 뭘까?!
            <br />
            “사실 정말 용기를 내서 말 걸었던 거예요.”
          </p>
        </div>
      </div>
    </div>
  );
}

export default Character;
