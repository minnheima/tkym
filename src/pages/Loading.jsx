import "./Loading.css";

function Loading({ onClick }) {
  return (
    <div className="loading-wrap" onClick={onClick}>
      <div className="loading-frame">
        <h1 className="jp-title"></h1>
        <p className="en-title">1st TKYM Webzine</p>
      </div>
    </div>
  );
}
export default Loading;
