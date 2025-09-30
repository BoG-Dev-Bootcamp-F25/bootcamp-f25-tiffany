import './App.css';

function App() {
  return (
    <div className="PokeDex">
      <header className="PokeDex">
        <h1>Exercise 5 - PokeDex!</h1>
        <div className="content">
          <div className="left-side">
            <img />
            <h3 className="name">name</h3>
            <p>
              <b>Types:</b>
            </p>
            <div className="arrows">
              <button className='arrow'>Prev</button>
              <button className='arrow'>Next</button>
            </div>
          </div>
          <div className="right-side">
            <h2>Moves</h2>
            <div className="buttons">
              <button className="infoBtn">Info</button>
              <button className="movesBtn">Moves</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
