import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Card, { CardInfo } from "@/components/Card";
import NewCard from "@/components/Card/NewCard";
import SaveIcon from "@/assets/icons/SaveIcon";
import FolderIcon from "@/assets/icons/FolderIcon";
import { exportData } from "./utils/fileFunctions";

import "./app.scss";

type SectionType = { title?: string; cards: CardInfo[] };

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);

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
        name: `Elemento ${sections[sectionIndex].cards.length + 1}`,
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
      if (!confirm("Esto va a borrar todo el elemento, querés continuar?"))
        return;
      sections[sectionIndex].cards.splice(cardIndex, 1);
      setSections([...sections]);
    },
    [sections]
  );

  const handleSaveFile = async () => {
    exportData(
      sections,
      `Inventario_Onix_${new Date().toLocaleDateString("es-AR", {
        dateStyle: "short",
      })}`
    );
  };

  const handleLoadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      const result = JSON.parse(
        (e.target?.result as string) || "[]"
      ) as Partial<SectionType>[];
      console.log(result);
      if (result.filter((s) => s.cards).length > 0)
        setSections([...(result as SectionType[])]);
    };
  };

  useEffect(() => {
    const autoSave = localStorage.getItem("inv-auto-save");
    if (autoSave) {
      setSections([...JSON.parse(autoSave)]);
    }
  }, []);

  useMemo(() => {
    if (sections.length > 0)
      localStorage.setItem("inv-auto-save", JSON.stringify(sections));
  }, [sections]);

  return (
    <div className="app">
      <div className="header">
        <div className="content">
          <h1>Inventario de Onix</h1>
          <div className="actions">
            <button
              title="Cargar Archivo"
              onClick={() => inputRef.current?.click()}
            >
              <input
                hidden
                accept="application/JSON"
                ref={inputRef}
                type="file"
                onChange={handleLoadFile}
                multiple={false}
              />
              <FolderIcon />
            </button>
            <button title="Guardar Archivo" onClick={handleSaveFile}>
              <SaveIcon />
            </button>
          </div>
        </div>
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
      {sections.length > 0 && <hr />}
      <button className="new-section" onClick={handleAddSection}>
        + Agregar sección
      </button>
    </div>
  );
}

export default App;
