import React from "react";
import NewIcon from "@/assets/icons/NewIcon";
import "./card.scss";

const NewCard: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className="new card">
      <div className="card-name" />
      <button
        className="new-element"
        onClick={onClick}
        title="Agregar nuevo elemento"
      >
        <NewIcon
          width={42}
          height={42}
          fill="white"
          stroke="black"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </button>
      <div className="card-info" />
    </div>
  );
};

export default NewCard;
