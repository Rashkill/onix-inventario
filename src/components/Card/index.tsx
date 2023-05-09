import React, { useCallback, useRef, useState } from "react";
import Sticker from "@/assets/logo.png";

import "./card.scss";

export type CardInfo = {
  count: number;
  reposition: number;
  img: string;
  name: string;
};

const Card: React.FC<{ defaultData?: CardInfo }> = ({ defaultData }) => {
  const [info, setInfo] = useState<CardInfo>(
    defaultData || {
      count: 0,
      reposition: 0,
      img: Sticker,
      name: "Nuevo Sticker",
    }
  );

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = useCallback((key: keyof CardInfo, value: string) => {
    setInfo((prev) => {
      if (prev[key] === value) return prev;

      if (typeof prev[key] === "number")
        prev[key] = (Number(value) || prev[key]) as never;
      else if (key !== "img") prev[key] = (value || "-") as never;
      else prev[key] = (value || prev[key]) as never;

      return { ...prev };
    });
  }, []);

  return (
    <div className="card">
      <div className="card-name">
        <p
          contentEditable
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onBlur={(e) => handleChange("name", e.target.innerText)}
          dangerouslySetInnerHTML={{ __html: info.name }}
        />
      </div>
      <input
        hidden
        ref={inputRef}
        type="file"
        onChange={(e) =>
          handleChange(
            "img",
            e.target.files?.[0]
              ? URL.createObjectURL(e.target.files[0])
              : Sticker
          )
        }
        multiple={false}
      />
      <img
        title={info.name}
        alt="sticker"
        onClick={() => inputRef.current?.click()}
        src={info.img || Sticker}
        className="card-img"
      />
      <div className="card-info">
        <div className="count">
          <p
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) =>
              Number.isNaN(Number(e.target.innerText)) &&
              handleChange("count", e.target.innerText)
            }
            dangerouslySetInnerHTML={{ __html: info.count }}
          />
        </div>
        <div className="reposition">
          <div>+</div>{" "}
          <span
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) =>
              Number.isNaN(Number(e.target.innerText)) &&
              handleChange("reposition", e.target.innerText)
            }
            dangerouslySetInnerHTML={{ __html: info.reposition }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
