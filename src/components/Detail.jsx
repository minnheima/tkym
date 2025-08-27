// Detail.jsx
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import Nav from "./Nav";
import TopBtn from "./TopBtn";
import BackBtn from "./BackBtn";
import "./Detail.css";

// 큰 컴포넌트들을 lazy로 import
const AuthContent = lazy(() => import("./AuthContent"));
const Art = lazy(() => import("./Art"));
const TextPolisher = lazy(() => import("./TextPolisher"));

// 로딩 컴포넌트
const ComponentLoader = ({ text = "컴포넌트를 불러오는 중..." }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      minHeight: "100px",
    }}
  >
    <div>{text}</div>
  </div>
);

function Detail({ data, type }) {
  const { id } = useParams();
  const [loadedText, setLoadedText] = useState("");
  const item = data.find((i) => String(i.id) === id);

  useEffect(() => {
    if (type === "Fiction" && item?.id) {
      const loadTxtFile = async () => {
        try {
          const res = await fetch(`/data/fiction${item.id}.txt`);
          if (!res.ok) throw new Error("파일을 불러올 수 없습니다.");
          const text = await res.text();
          setLoadedText(text);
        } catch (err) {
          console.error(err);
          setLoadedText("텍스트 파일을 불러오지 못했습니다.");
        }
      };
      loadTxtFile();
    }
  }, [type, item]);

  if (!item)
    return (
      <div className="wrapper">
        <p>
          작품을 찾을 수 없습니다.
          <Link to={`/${type.toLowerCase()}`}>
            <button>← Back</button>
          </Link>
        </p>
      </div>
    );

  return (
    <>
      <Nav />
      <div className="wrapper">
        <h2>{type}</h2>
        <div className="content-wrapper" id="detail-edit">
          <p className="content-info" id="detail-info">
            <span id="title">{item.title}</span>
            <span>{item.name}</span>
          </p>
          <Suspense
            fallback={<ComponentLoader text="콘텐츠를 불러오는 중..." />}
          >
            <AuthContent
              type={type}
              item={item}
              renderContent={() =>
                (type === "Fiction" && (
                  <Suspense
                    fallback={
                      <ComponentLoader text="텍스트를 처리하는 중..." />
                    }
                  >
                    {item.iframe && (
                      <div
                        className="iframe-wrapper"
                        dangerouslySetInnerHTML={{ __html: item.iframe }}
                      />
                    )}

                    {loadedText && (
                      <TextPolisher
                        raw={loadedText}
                        hasSymbols={item.hasSymbols}
                        className="fic-content"
                      />
                    )}
                    <BackBtn backTo={`/${item.type.toLowerCase()}`} />
                  </Suspense>
                )) ||
                (type === "Artwork" && (
                  <Suspense
                    fallback={
                      <ComponentLoader text="아트워크를 불러오는 중..." />
                    }
                  >
                    <Art data={item} />
                    <BackBtn backTo={`/${item.type.toLowerCase()}`} />
                  </Suspense>
                ))
              }
            />
          </Suspense>
        </div>
        <TopBtn />
      </div>
    </>
  );
}

export default Detail;
