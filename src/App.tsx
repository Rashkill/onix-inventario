import { Fragment, useCallback, useState } from "react";
import Card, { CardInfo } from "@/components/Card";
import NewCard from "@/components/Card/NewCard";

type SectionType = { title?: string; cards: (CardInfo | undefined)[] };

function App() {
  const [sections, setSections] = useState<SectionType[]>([
    { title: "Nueva Sección", cards: [] },
  ]);

  const handleChangeSectionTitle = useCallback(
    (sectionIndex: number, value: string) => {
      sections[sectionIndex].title = value;
      setSections([...sections]);
    },
    [sections]
  );

  const handleAddCard = useCallback(
    (sectionIndex: number) => () => {
      sections[sectionIndex].cards.push(undefined);
      setSections([...sections]);
    },
    [sections]
  );

  const handleAddSection = useCallback(() => {
    sections.push({ title: "Nueva Sección", cards: [] });
    setSections([...sections]);
  }, [sections]);

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
          <hr style={{ marginTop: 20 }} />
          <h2
            style={{ fontWeight: 500 }}
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) =>
              handleChangeSectionTitle(sectionIndex, e.target.innerText)
            }
            dangerouslySetInnerHTML={{
              __html: section.title || `Sección ${sectionIndex + 1}`,
            }}
          />
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
      <hr style={{ marginTop: 20 }} />
      <h2
        style={{ fontWeight: 500, cursor: "pointer" }}
        onClick={handleAddSection}
      >
        + Agregar sección
      </h2>
    </div>
  );
}

export default App;
