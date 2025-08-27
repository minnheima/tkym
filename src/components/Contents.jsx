import "./Contents.css";
import { Link } from "react-router-dom";
import { useState } from "react";

import Nav from "./Nav";
import AfterText from "./AfterText";
import TopBtn from "./TopBtn";

function Contents({ data, title }) {
  const FICTION = "Fiction";
  const ARTWORK = "Artwork";
  const AFTER = "After";
  const [openItemID, setOpenItemID] = useState(null);
  const [sorted, setSorted] = useState(false);

  const defaultList = data.filter((item) => item.guest === false);
  const guestList = data.filter((item) => item.guest === true);

  const onToggleHandler = (id) => {
    setOpenItemID((prevId) => (prevId === id ? null : id));
  };
  const onSortHandler = () => {
    setSorted((prev) => !prev);
  };

  const getSortedData = () => {
    if (!sorted) {
      return data;
    }
    return [...data].sort((a, b) => {
      // 대소문자 구분 없이 비교하기 위해 toLowerCase() 사용
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  };
  return (
    <>
      <Nav />
      <div className="wrapper">
        <h2>{title}</h2>
        <div className="content-wrapper">
          {/* fiction 일 때 */}
          {title === FICTION && (
            <ul className="content-list" id="fic-list">
              {data.map((item) => (
                <li key={item.id}>
                  <Link to={`/fiction/${item.id}`}>
                    <p className="content-info">
                      <span id="title">
                        {item.title}
                        <span id="rating">{item.rating >= 19 && `✻`}</span>
                      </span>
                      <span>{item.name}</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* art 일 때 */}
          {title === ARTWORK && (
            <ul className="content-list" id="art-list">
              {defaultList.map((item) => (
                <li key={item.id}>
                  <Link to={`/artwork/${item.id}`}>
                    <img
                      className="art-thumb"
                      src={item.thumb}
                      alt={item.title}
                    />
                    <p className="content-info">
                      <span id="title" className="art-title">
                        {item.title}
                        <span id="rating">{item.rating >= 19 && `✻`}</span>
                      </span>
                      <span>{item.name}</span>
                    </p>
                  </Link>
                </li>
              ))}
              <div className="guest-wrap">
                <h3 className="guest">Guest</h3>
                <ul className="content-list" id="art-list">
                  {guestList.map((item) => (
                    <li key={item.id}>
                      <Link to={`/artwork/${item.id}`}>
                        <img
                          className="art-thumb"
                          src={item.thumb}
                          alt={item.title}
                        />
                        <p className="content-info">
                          <span id="title" className="art-title">
                            {item.title}
                            <span id="rating">{item.rating >= 19 && `✻`}</span>
                          </span>
                          <span>{item.name}</span>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </ul>
          )}
          {/*after 일 때 */}
          {title === AFTER && (
            <>
              <button className="order-btn" onClick={onSortHandler}>
                {sorted ? "ㄱ-ㄷ순" : "A-Z순"}
              </button>
              <ul className="content-list" id="after-list">
                {getSortedData().map((item) => (
                  <li
                    key={item.id}
                    onClick={() => onToggleHandler(item.id)}
                    className={openItemID === item.id ? "active" : ""}
                  >
                    {item.name}
                    {openItemID === item.id && (
                      <div className="after-text">
                        <AfterText file={item.file} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <TopBtn />
      </div>
    </>
  );
}
export default Contents;
