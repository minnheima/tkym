import "./Error.css";
function Error() {
  return (
    <div className="error-modal">
      <div className="error-content">
        <h2>
          <span className="warn-icon"></span>모바일 가로모드는 지원되지
          않습니다.
        </h2>
        <p>화면을 세로로 돌려서 이용해주세요.</p>
      </div>
    </div>
  );
}
export default Error;
