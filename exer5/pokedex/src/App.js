import './App.css';
import {useState, useEffect} from 'react';

const URL = "https://pokeapi.co/api/v2/pokemon";
async function getPokemonJSON(dexNumber) {
  const res = await fetch(`${URL}/${dexNumber}/`);
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json();
}

function App() {
  const [data, setData] = useState(null);
  const [id, setId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const pokemonJSON = await getPokemonJSON(id);
        if (!cancelled) setData(pokemonJSON);
      } catch (e) {
        if (!cancelled) setError(e.message || "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const name = data?.name ?? `#${id}`;
  const sprite =
    data?.sprites?.other?.["official-artwork"]?.front_default ||
    data?.sprites?.front_default ||
    null;
  const heightM = data ? (data.height / 10).toFixed(1) : null; // meters
  const weightKg = data ? (data.weight / 10).toFixed(1) : null; // kilograms

  const statVal = (n) =>
    data?.stats?.find((s) => s.stat.name === n)?.base_stat ?? "—";

  const hp = statVal("hp");
  const attack = statVal("attack");
  const defense = statVal("defense");
  const spAttack = statVal("special-attack");
  const spDefense = statVal("special-defense");
  const speed = statVal("speed");

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
            {activeTab === "info" ? (
              <div className="info">
                <h2>INFO</h2>
                <div className="info-panel">
                  <p>
                    <b>height:</b> {heightM ? `${heightM} m` : "—"}
                  </p>
                  <p>
                    <b>weight:</b> {weightKg ? `${weightKg} kg` : "—"}
                  </p>
                  <p>
                    <b>hp:</b> {hp ? `${hp} ` : "—"}
                  </p>
                  <p>
                    <b>attack:</b> {attack ? `${attack} ` : "—"}
                  </p>
                  <p>
                    <b>defense:</b> {defense ? `${defense} ` : "—"}
                  </p>
                  <p>
                    <b>special-attack:</b> {spAttack ? `${spAttack} ` : "—"}
                  </p>
                  <p>
                    <b>special-defense:</b> {spDefense ? `${spDefense} ` : "—"}
                  </p>
                  <p>
                    <b>speed:</b> {speed ? `${speed} ` : "—"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="moves">
                <h2>MOVES</h2>
                <div className="moves-panel">
                  {(data?.moves ?? [])
                    .map((m) => m.move.name.replace(/-/g, " "))
                    .join(", ")}
                </div>
              </div>
            )}
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
