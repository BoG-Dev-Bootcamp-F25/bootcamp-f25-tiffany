import './App.css';
import {useState, useEffect, React} from 'react';
import Pokemon from './components/Pokemon.js'

function App() {
  const [data, setData] = useState(null);
  const [id, setId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        setData(null);

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (e) {
        if (e.name !== "AbortError")
          setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [id]);

  const name = data?.name ?? `#${id}`;
  const typeNames = (data?.types ?? []).map((t) => t.type.name);
  const moves = data?.moves?.slice(0, 12) || [];
  const sprite =
    data?.sprites?.other?.["official-artwork"]?.front_default ||
    data?.sprites?.front_default;
  const prev = () => setId((i) => Math.max(1, i - 1));
  const next = () => setId((i) => i + 1);
  return (
    <div className="PokeDex">
      <header className="PokeDex">
        <h1>Exercise 5 - PokeDex!</h1>
        <div className="content">
          <div className="left-side">
            <img src={sprite} alt={`${data?.name} artwork`} className="image" />
            <h3 className="name">{name}</h3>
            <div className="type">
              <p>
                <b>Types:</b>
              </p>
              <div className="all-types">
                {(data?.types ?? []).map(({ type }) => (
                  <p className={`typeName ${type.name.toLowerCase()}`}>
                    {type.name}
                  </p>
                ))}
              </div>
            </div>
            <div className="arrows">
              <button className="arrow" onClick={prev}>
                Prev
              </button>
              <button className="arrow" onClick={next}>
                Next
              </button>
            </div>
          </div>
          <div className="right-side">
            {activeTab === "info"?
              <div className="info">
                <h2>Info</h2>
                <div className="info-panel"></div>
              </div> :
              <div className="moves">
                <h2>Moves</h2>
                <div className="moves-panel"></div>
              </div>
            }
            <div className="buttons">
              <button
                className={activeTab === "info" ? "infoBtnOn" : "infoBtn"}
                onClick={() => setActiveTab("info")}
              >
                Info
              </button>
              <button
                className={activeTab === "moves" ? "movesBtnOn" : "movesBtn"}
                onClick={() => setActiveTab("moves")}
              >
                Moves
              </button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
