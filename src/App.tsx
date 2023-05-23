import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Button from "@/components/Button";
import { CardInfo } from "@/components/Card";

import SaveIcon from "@/assets/icons/SaveIcon";
import FolderIcon from "@/assets/icons/FolderIcon";

import { exportData } from "@/utils/fileFunctions";

import "./app.scss";
import { useModal } from "./context/ModalContext";
import { get, onValue, ref, set } from "firebase/database";
import Firebase, { STICKERS_DB } from "./utils/Firebase";
import Spinner from "./components/Spinner";
import Section from "./components/Section";

type SectionType = { title?: string; cards: CardInfo[] };

function App() {
  const { showPrompt, close } = useModal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSection = useCallback(() => {
    sections.push({ title: `Sección ${sections.length + 1}`, cards: [] });
    setSections([...sections]);
  }, [sections]);

  const handleRemoveSection = useCallback(
    (sectionIndex: number) => {
      const modalIndex = showPrompt({
        title: `Borrar '${sections[sectionIndex].title}'`,
        text: "Seguro queres borrar esta seccion? Esto tambien va a borrar todo el contenido.",
        buttons: [
          {
            title: "Si",
            onClick: () => {
              sections.splice(sectionIndex, 1);
              setSections([...sections]);
              close(modalIndex);
            },
          },
          { title: "No", color: "secondary", onClick: () => close(modalIndex) },
        ],
      });
    },
    [sections, close, showPrompt]
  );

  const handleChangeSectionTitle = useCallback(
    (sectionIndex: number, value: string) => {
      sections[sectionIndex].title = value;
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
    setLoading(true);
    get(ref(Firebase.Database, STICKERS_DB))
      .then((snap) => {
        if (snap.exists()) setSections(snap.val());
      })
      .finally(() => {
        setLoading(false);
        onValue(ref(Firebase.Database, STICKERS_DB), (snap) => {
          if (snap.val()) setSections(snap.val());
        });
      });
  }, []);

  useMemo(() => {
    if (sections.length > 0) set(ref(Firebase.Database, STICKERS_DB), sections);
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
      {loading ? (
        <Spinner />
      ) : (
        sections.map((section, sectionIndex) => (
          <Section
            key={`Section:${section.title}${sectionIndex + 1}`}
            index={sectionIndex}
            title={section.title || `Sección ${sectionIndex + 1}`}
            cards={section.cards}
            onBlur={(text) => handleChangeSectionTitle(sectionIndex, text)}
            onClickRemove={() => handleRemoveSection(sectionIndex)}
          />
        ))
      )}
      {sections.length > 0 && <hr />}
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
