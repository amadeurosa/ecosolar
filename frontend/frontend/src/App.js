import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [geracao, setGeracao] = useState([]);
  const [consumo, setConsumo] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/geracao")
      .then(response => response.json())
      .then(data => setGeracao(data));

    fetch("http://localhost:5000/api/consumo")
      .then(response => response.json())
      .then(data => setConsumo(data));
  }, []);

  return (
    <div className="container">
      <h1>EcoSolar - Painel de Monitoramento</h1>

      <div className="painel">
        <div className="bloco">
          <h2>Geração de Energia Solar</h2>
          <ul>
            {geracao.map((item) => (
              <li key={item.id}>
                {new Date(item.data_registro).toLocaleDateString()} - {item.energia_gerada} kWh
              </li>
            ))}
          </ul>
        </div>

        <div className="bloco">
          <h2>Consumo de Energia</h2>
          <ul>
            {consumo.map((item) => (
              <li key={item.id}>
                {new Date(item.data_registro).toLocaleDateString()} - {item.energia_consumida} kWh
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

