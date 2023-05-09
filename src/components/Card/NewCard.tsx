import React from "react";
import "./card.scss";

const NewCard: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className="card">
      <div className="card-name" />
      <div className="card-img" onClick={onClick}>
        + Nuevo Sticker
      </div>
      <div className="card-info" />
    </div>
  );
};

export default NewCard;
