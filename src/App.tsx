import Card, { CardInfo } from "@/components/Card";
import NewCard from "@/components/Card/NewCard";
import { useState } from "react";

function App() {
  const [cards, setCards] = useState<(CardInfo | undefined)[]>([]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <h2>Inventario de Onix</h2>
      <div
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {cards.map((card, index) => (
          <Card key={`Card${index + 1}`} defaultData={card} />
        ))}
        <NewCard onClick={() => setCards((prev) => [...prev, undefined])} />
      </div>
    </div>
  );
}

export default App;
