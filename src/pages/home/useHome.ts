import { CardInfo } from "@/components/Card";
import { useModal } from "@/context/ModalContext";
import Firebase, { STICKERS_DB } from "@/utils/Firebase";
import { exportData } from "@/utils/fileFunctions";
import { push, ref, remove, set, get, onValue } from "firebase/database";
import { useRef, useState, useCallback, useEffect } from "react";

type SectionType = { title?: string; cards: Record<string, CardInfo> };

const useHome = () => {
  const { showPrompt, close } = useModal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [sections, setSections] = useState<Record<string, SectionType>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSection = useCallback(() => {
    push(ref(Firebase.Database, STICKERS_DB), {
      title: `Sección ${Object.keys(sections).length + 1}`,
      cards: {},
    });
  }, [sections]);

  const handleRemoveSection = useCallback(
    (key: string) => {
      const modalIndex = showPrompt({
        title: `Borrar '${sections[key].title}'`,
        text: "Seguro querés borrar esta seccion? Esto tambien va a borrar todo el contenido.",
        buttons: [
          {
            title: "Si",
            onClick: () => {
              remove(ref(Firebase.Database, `${STICKERS_DB}/${key}`));
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
    set(ref(Firebase.Database, `${STICKERS_DB}/${key}/title`), value);
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
      const isArray = e.target?.result?.slice(0, 1) === "[";
      const result = JSON.parse(
        (e.target?.result as string) || isArray ? "[]" : "{}"
      );

      if (isArray) {
        if (
          (result as Partial<{ title?: string; cards: CardInfo[] }>[]).filter(
            (s) => s.cards
          ).length > 0
        ) {
          set(ref(Firebase.Database, STICKERS_DB), []);
          (result as Partial<{ title?: string; cards: CardInfo[] }>[]).forEach(
            (section) => {
              const sectionKey = push(ref(Firebase.Database, STICKERS_DB), {
                ...section,
                cards: {},
              }).key;
              section.cards?.forEach((card) => {
                push(
                  ref(Firebase.Database, `${STICKERS_DB}/${sectionKey}/cards`),
                  card
                );
              });
            }
          );
        } else if (
          Object.values(
            result as Record<
              string,
              Partial<{ title?: string; cards: CardInfo[] }>
            >
          ).filter((s) => s.cards).length > 0
        )
          set(ref(Firebase.Database, STICKERS_DB), result);
      }
    };
  };

  useEffect(() => {
    setLoading(true);
    get(ref(Firebase.Database, STICKERS_DB))
      .then((snap) => {
        if (snap.exists()) setSections({ ...(snap.val() || {}) });
      })
      .finally(() => {
        setLoading(false);
        onValue(ref(Firebase.Database, STICKERS_DB), (snap) => {
          setSections({ ...(snap.val() || {}) });
        });
      });
  }, []);
  return {
    loading,
    inputRef,
    sections,
    handleChangeSectionTitle,
    handleRemoveSection,
    handleAddSection,
    handleLoadFile,
    handleSaveFile,
  };
};

export default useHome;
