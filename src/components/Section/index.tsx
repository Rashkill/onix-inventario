import { useCallback, useState } from "react";
import Card, { CardInfo } from "../Card";
import NewCard from "../Card/NewCard";
import { useModal } from "@/context/ModalContext";
import Firebase, { STICKERS_DB } from "@/utils/Firebase";
import { push, ref, remove, set } from "firebase/database";

const Section: React.FC<{
  sectionKey: string;
  title: string;
  cards?: Record<string, CardInfo>;
  onBlur?: (text: string) => void;
  onClickRemove?: () => void;
}> = ({
  sectionKey: index,
  title,
  cards: initialCards,
  onBlur,
  onClickRemove,
}) => {
  const { showPrompt, close } = useModal();

  const handleAddCard = useCallback(() => {
    push(ref(Firebase.Database, `${STICKERS_DB}/${index}/cards`), {
      name: `Elemento ${Object.keys(initialCards || {}).length + 1}`,
      count: 0,
      reposition: 0,
    });
  }, [initialCards, index]);

  const handleEditCard = useCallback(
    (cardKey: string) => (key: keyof CardInfo, value?: string | number) => {
      set(
        ref(
          Firebase.Database,
          `${STICKERS_DB}/${index}/cards/${cardKey}/${key}`
        ),
        typeof value === "number" && Number.isNaN(value)
          ? initialCards?.[cardKey][key]
          : value
      );
    },
    [initialCards, index]
  );

  const handleRemoveCard = useCallback(
    (cardKey: string) => () => {
      const modalIndex = showPrompt({
        title: `Borrar '${initialCards?.[cardKey].name}'`,
        text: "Seguro queres borrar este elemento?",
        buttons: [
          {
            title: "Si",
            onClick: () => {
              remove(
                ref(
                  Firebase.Database,
                  `${STICKERS_DB}/${index}/cards/${cardKey}`
                )
              );
              close(modalIndex);
            },
          },
          { title: "No", color: "secondary", onClick: () => close(modalIndex) },
        ],
      });
    },
    [initialCards, index, close, showPrompt]
  );

  return (
    <>
      <div className="section-title">
        <h2
          style={{ fontWeight: 500 }}
          contentEditable
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onBlur={(e) => onBlur?.(e.target.innerText)}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <button className="delete" onClick={onClickRemove}>
          Eliminar
        </button>
      </div>
      <div className="cards-wrap">
        {Object.keys(initialCards || {}).map((key, index) => (
          <Card
            key={`Card${index + title}`}
            data={initialCards?.[key]}
            onChange={handleEditCard(key)}
            onClickRemove={handleRemoveCard(key)}
          />
        ))}
        <NewCard onClick={handleAddCard} />
      </div>
    </>
  );
};

export default Section;
