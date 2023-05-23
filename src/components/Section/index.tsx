import { useCallback, useState } from "react";
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
    const newCards = [...cards];
    newCards.push({
      name: `Elemento ${cards.length + 1}`,
      count: 0,
      reposition: 0,
    });
    set(ref(Firebase.Database, `${STICKERS_DB}/${index}/cards`), newCards).then(
      () => setCards([...newCards])
    );
  }, [cards, index]);

  const handleEditCard = useCallback(
    (cardIndex: number) => (key: keyof CardInfo, value?: string | number) => {
      const newCards = [...cards];
      newCards[cardIndex][key] = (
        typeof value === "number" && Number.isNaN(value)
          ? cards[cardIndex][key]
          : value
      ) as never;
      set(
        ref(Firebase.Database, `${STICKERS_DB}/${index}/cards/${cardIndex}`),
        newCards[cardIndex]
      ).then(() => setCards([...newCards]));
    },
    [cards, index]
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
              const newCards = [...cards];
              newCards.splice(cardIndex, 1);
              set(
                ref(Firebase.Database, `${STICKERS_DB}/${index}/cards`),
                newCards
              ).then(() => setCards([...newCards]));
              close(modalIndex);
            },
          },
          { title: "No", color: "secondary", onClick: () => close(modalIndex) },
        ],
      });
    },
    [cards, index, close, showPrompt]
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
