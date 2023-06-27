import database from "firebase/database";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import { CardInfo } from "@/components/Card";

import SaveIcon from "@/assets/icons/SaveIcon";
import FolderIcon from "@/assets/icons/FolderIcon";

import { exportData } from "@/utils/fileFunctions";

import "./app.scss";
import { useModal } from "./context/ModalContext";

import Firebase, { STICKERS_DB } from "./utils/Firebase";
import Spinner from "./components/Spinner";
import Section from "./components/Section";

type SectionType = { title?: string; cards: Record<string, CardInfo> };

function App() {
  const { showPrompt, close } = useModal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sections, setSections] = useState<Record<string, SectionType>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSection = useCallback(() => {
    database.push(database.ref(Firebase.Database, STICKERS_DB), {
      title: `Sección ${Object.keys(sections).length + 1}`,
      cards: {},
    });
  }, [sections]);

  const handleRemoveSection = useCallback(
    (key: string) => {
      const modalIndex = showPrompt({
        title: `Borrar '${sections[key].title}'`,
        text: "Seguro queres borrar esta seccion? Esto tambien va a borrar todo el contenido.",
        buttons: [
          {
            title: "Si",
            onClick: () => {
              database.remove(
                database.ref(Firebase.Database, `${STICKERS_DB}/${key}`)
              );
              close(modalIndex);
            },
          },
          { title: "No", color: "secondary", onClick: () => close(modalIndex) },
        ],
      });
    },
    [sections, close, showPrompt]
  );

  const handleChangeSectionTitle = useCallback((key: string, value: string) => {
    database.set(
      database.ref(Firebase.Database, `${STICKERS_DB}/${key}/title`),
      value
    );
  }, []);

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

      if (result.filter((s) => s.cards).length > 0) {
        database.set(database.ref(Firebase.Database, STICKERS_DB), result);
      }
    };
  };

  useEffect(() => {
    setLoading(true);
    database
      .get(database.ref(Firebase.Database, STICKERS_DB))
      .then((snap) => {
        if (snap.exists()) setSections({ ...(snap.val() || {}) });
      })
      .finally(() => {
        setLoading(false);
        database.onValue(
          database.ref(Firebase.Database, STICKERS_DB),
          (snap) => {
            setSections({ ...(snap.val() || {}) });
          }
        );
      });
  }, []);

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
      {loading ? (
        <Spinner />
      ) : (
        Object.keys(sections).map((key, sectionIndex) => {
          const section = sections[key];
          return (
            <Section
              key={`Section:${section.title}${sectionIndex + 1}`}
              sectionKey={key}
              title={section.title || `Sección ${sectionIndex + 1}`}
              cards={section.cards}
              onBlur={(text) => handleChangeSectionTitle(key, text)}
              onClickRemove={() => handleRemoveSection(key)}
            />
          );
        })
      )}
      {Object.keys(sections).length > 0 && <hr />}
      <Button
        color="secondary"
        text="+ Agregar sección"
        onClick={handleAddSection}
        hidden={loading}
      />
    </div>
  );
}

export default App;
