import React, { useRef } from "react";
import Sticker from "@/assets/logo.png";

import "./card.scss";

export type CardInfo = {
  count: number;
  reposition: number;
  img: string;
  name: string;
};

const Card: React.FC<{
  defaultData?: CardInfo;
  onChange?: (key: keyof CardInfo, value: string | number) => void;
  onClickRemove?: () => void;
}> = ({
  defaultData = {
    count: 0,
    reposition: 0,
    img: Sticker,
    name: "Nuevo Sticker",
  },
  onChange,
  onClickRemove,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="card">
      <div className="card-name">
        <p
          contentEditable
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onBlur={(e) => onChange?.("name", e.target.innerText)}
          dangerouslySetInnerHTML={{ __html: defaultData.name }}
        />
        <button className="delete" onClick={onClickRemove}>
          X
        </button>
      </div>
      <input
        hidden
        ref={inputRef}
        type="file"
        onChange={(e) =>
          onChange?.(
            "img",
            e.target.files?.[0]
              ? URL.createObjectURL(e.target.files[0])
              : Sticker
          )
        }
        multiple={false}
      />
      <img
        title={defaultData.name}
        alt="sticker"
        onClick={() => inputRef.current?.click()}
        src={defaultData.img || Sticker}
        className="card-img"
      />
      <div className="card-info">
        <div className="count">
          <p
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) =>
              !Number.isNaN(Number(e.target.innerText)) &&
              onChange?.("count", e.target.innerText)
            }
            dangerouslySetInnerHTML={{ __html: defaultData.count }}
          />
        </div>
        <div className="reposition">
          <div>+</div>{" "}
          <span
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) =>
              !Number.isNaN(Number(e.target.innerText)) &&
              onChange?.("reposition", e.target.innerText)
            }
            dangerouslySetInnerHTML={{ __html: defaultData.reposition }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
