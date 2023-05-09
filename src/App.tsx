import Card, { CardInfo } from "@/components/Card";
import NewCard from "@/components/Card/NewCard";
import { Fragment, useCallback, useState } from "react";

type SectionType = { title?: string; cards: (CardInfo | undefined)[] };

function App() {
  const [sections, setSections] = useState<SectionType[]>([
    { title: "Nueva Seccion", cards: [] },
  ]);

  const handleAddCard = useCallback(
    (sectionIndex: number) => () => {
      setSections((prev) => {
        prev[sectionIndex].cards.push(undefined);
        return prev;
      });
    },
    []
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <h1 style={{ margin: 0 }}>Inventario de Onix</h1>
      {sections.map((section, sectionIndex) => (
        <Fragment key={`Section:${section.title}${sectionIndex + 1}`}>
          <hr />
          <h2 style={{ margin: 0 }}>{section.title}</h2>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {section.cards.map((card, index) => (
              <Card key={`Card${index + sectionIndex}`} defaultData={card} />
            ))}
            <NewCard onClick={handleAddCard(sectionIndex)} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default App;
