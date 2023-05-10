import { Fragment, useCallback, useState } from "react";
import Card, { CardInfo } from "@/components/Card";
import NewCard from "@/components/Card/NewCard";

import "./app.scss";

type SectionType = { title?: string; cards: CardInfo[] };

function App() {
  const [sections, setSections] = useState<SectionType[]>([{ cards: [] }]);

  const handleAddSection = useCallback(() => {
    sections.push({ title: `Sección ${sections.length + 1}`, cards: [] });
    setSections([...sections]);
  }, [sections]);

  const handleRemoveSection = useCallback(
    (sectionIndex: number) => {
      if (
        !confirm(
          "Esto va a borrar toda la seccion y su contenido, querés continuar?"
        )
      )
        return;
      sections.splice(sectionIndex, 1);
      setSections([...sections]);
    },
    [sections]
  );

  const handleChangeSectionTitle = useCallback(
    (sectionIndex: number, value: string) => {
      sections[sectionIndex].title = value;
      setSections([...sections]);
    },
    [sections]
  );

  const handleAddCard = useCallback(
    (sectionIndex: number) => () => {
      sections[sectionIndex].cards.push({
        name: `Sticker ${sections[sectionIndex].cards.length + 1}`,
        count: 0,
        reposition: 0,
      });
      setSections([...sections]);
    },
    [sections]
  );

  const handleEditCard = useCallback(
    (sectionIndex: number, cardIndex: number) =>
      (key: keyof CardInfo, value?: string | number) => {
        sections[sectionIndex].cards[cardIndex][key] = (
          typeof value === "number" && Number.isNaN(value)
            ? sections[sectionIndex].cards[cardIndex][key]
            : value
        ) as never;
        setSections([...sections]);
      },
    [sections]
  );

  const handleRemoveCard = useCallback(
    (sectionIndex: number, cardIndex: number) => () => {
      if (!confirm("Esto va a borrar todo el sticker, querés continuar?"))
        return;
      sections[sectionIndex].cards.splice(cardIndex, 1);
      setSections([...sections]);
    },
    [sections]
  );

  return (
    <div className="app">
      <div className="header">
        <h1>Inventario de Onix</h1>
        <hr />
      </div>
      <br />
      <br />
      <br />
      <br />
      {sections.map((section, sectionIndex) => (
        <Fragment key={`Section:${section.title}${sectionIndex + 1}`}>
          <div className="section-title">
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
            <button
              className="delete"
              onClick={() => handleRemoveSection(sectionIndex)}
            >
              Eliminar
            </button>
          </div>
          <div className="cards-wrap">
            {section.cards.map((card, index) => (
              <Card
                key={`Card${index + sectionIndex}`}
                data={card}
                onChange={handleEditCard(sectionIndex, index)}
                onClickRemove={handleRemoveCard(sectionIndex, index)}
              />
            ))}
            <NewCard onClick={handleAddCard(sectionIndex)} />
          </div>
        </Fragment>
      ))}
      <hr />
      <button className="new-section" onClick={handleAddSection}>
        + Agregar sección
      </button>
    </div>
  );
}

export default App;
