import React from "react";
import "./card.scss";

const NewCard: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className="card">
      <div className="card-name" />
      <button className="new-sticker" onClick={onClick}>
        + Nuevo Sticker
      </button>
      <div className="card-info" />
    </div>
  );
};

export default NewCard;
