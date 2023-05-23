import { useCallback, useMemo, useState } from "react";
import Card, { CardInfo } from "../Card";
import NewCard from "../Card/NewCard";
import { useModal } from "@/context/ModalContext";
import Firebase, { STICKERS_DB } from "@/utils/Firebase";
import { ref, set } from "firebase/database";

const Section: React.FC<{
  index: number;
  title: string;
  cards?: CardInfo[];
  onBlur?: (text: string) => void;
  onClickRemove?: () => void;
}> = ({ index, title, cards: initialCards, onBlur, onClickRemove }) => {
  const { showPrompt, close } = useModal();
  const [cards, setCards] = useState<CardInfo[]>(initialCards || []);

  const handleAddCard = useCallback(() => {
    cards.push({
      name: `Elemento ${cards.length + 1}`,
      count: 0,
      reposition: 0,
    });
    setCards([...cards]);
  }, [cards]);

  const handleEditCard = useCallback(
    (cardIndex: number) => (key: keyof CardInfo, value?: string | number) => {
      cards[cardIndex][key] = (
        typeof value === "number" && Number.isNaN(value)
          ? cards[cardIndex][key]
          : value
      ) as never;
      setCards([...cards]);
    },
    [cards]
  );

  const handleRemoveCard = useCallback(
    (cardIndex: number) => () => {
      const modalIndex = showPrompt({
        title: `Borrar '${cards[cardIndex].name}'`,
        text: "Seguro queres borrar este elemento?",
        buttons: [
          {
            title: "Si",
            onClick: () => {
              cards.splice(cardIndex, 1);
              setCards([...cards]);
              close(modalIndex);
            },
          },
          { title: "No", color: "secondary", onClick: () => close(modalIndex) },
        ],
      });
    },
    [cards, close, showPrompt]
  );

  useMemo(() => {
    if (cards.length > 0 && index >= 0)
      set(ref(Firebase.Database, `${STICKERS_DB}/${index}/cards`), cards);
  }, [cards, index]);

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
        {cards.map((card, index) => (
          <Card
            key={`Card${index + title}`}
            data={card}
            onChange={handleEditCard(index)}
            onClickRemove={handleRemoveCard(index)}
          />
        ))}
        <NewCard onClick={handleAddCard} />
      </div>
    </>
  );
};

export default Section;
