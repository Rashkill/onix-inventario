import FolderIcon from "@/assets/icons/FolderIcon";
import SaveIcon from "@/assets/icons/SaveIcon";
import Button from "@/components/Button";

import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import useHome from "./useHome";

const Home = () => {
  const {
    loading,
    inputRef,
    sections,
    handleChangeSectionTitle,
    handleRemoveSection,
    handleAddSection,
    handleLoadFile,
    handleSaveFile,
  } = useHome();

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
};

export default Home;
