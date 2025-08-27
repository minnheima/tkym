import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

function Home({ artData, ficData }) {
  // const isHorizontal = useMediaQuery({ maxHeight: 414 }); // 모바일 기준

  type Fic = (typeof ficData)[number];

  type Art = (typeof artData)[number];
  const [randomArts, setRandomArts] = useState<Art[]>([]);
  const [randomFics, setRandomFics] = useState<Fic[]>([]);

  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    if (artData && ficData && artData.length > 0 && ficData.length > 0) {
      const count = Math.min(1, ficData.length);
      const selected = getRandomItems(ficData, count);
      const randomed = getRandomItems(artData, count);

      setRandomFics(selected);
      setRandomArts(randomed);
    }
  }, [artData, ficData]);

  return (
    <div className="main-wrapper">
      <div className="main-title"></div>
      <div className="sidebar sidebar_left">TOKIMEKI</div>
      <div className="sidebar sidebar_right">TK X YM</div>
      <div className="frame">
        <Link to="/artwork">
          <div className="frame-item1 frames">
            {randomArts.map((art) => (
              <p className="random-text" key={art.id}>
                {art.sentence}
              </p>
            ))}
          </div>
        </Link>
        <Link to="/fiction">
          <div className="frame-item2 frames">
            {randomFics.map((fic) => (
              <p key={fic.id} className="random-text">
                {fic.sentence}
              </p>
            ))}
          </div>
        </Link>
        <Link to="/after">
          <div className="frame-item3 frames">
            <p className="random-text">fin</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
