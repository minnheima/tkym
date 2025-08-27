import { Link } from "react-router-dom";

function BackBtn({ backTo }) {
  return (
    <>
      <Link to={backTo}>
        <button style={{ display: "block", margin: "30px auto 0" }}>
          ← Back
        </button>
      </Link>
    </>
  );
}

export default BackBtn;
