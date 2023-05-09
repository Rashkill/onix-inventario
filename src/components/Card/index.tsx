import React, { useMemo, useRef } from "react";
import Sticker from "@/assets/logo.png";

import { fileToBase64 } from "@/utils/fileFunctions";
import "./card.scss";

export type CardInfo = {
  count: number;
  reposition: number;
  img?: string;
  name: string;
};

const Card: React.FC<{
  data?: CardInfo;
  onChange?: (key: keyof CardInfo, value?: string | number) => void;
  onClickRemove?: () => void;
}> = ({
  data = {
    count: 0,
    reposition: 0,
    name: "Nuevo Sticker",
  },
  onChange,
  onClickRemove,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const imgString = useMemo(() => data.img || Sticker, [data.img]);

  return (
    <div className="card">
      <div className="card-name">
        <p
          contentEditable
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          onBlur={(e) => onChange?.("name", e.target.innerText)}
          dangerouslySetInnerHTML={{ __html: data.name }}
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
          e.target.files?.[0] &&
          fileToBase64(e.target.files[0]).then((v) => onChange?.("img", v))
        }
        multiple={false}
      />
      <img
        title={data.name}
        alt="sticker"
        onClick={() => inputRef.current?.click()}
        src={imgString}
        className="card-img"
      />
      <div className="card-info">
        <div className="count">
          <p
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) => onChange?.("count", Number(e.target.innerText))}
            dangerouslySetInnerHTML={{ __html: data.count }}
          />
        </div>
        <div className="reposition">
          <div>+</div>{" "}
          <span
            contentEditable
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            onBlur={(e) => onChange?.("reposition", Number(e.target.innerText))}
            dangerouslySetInnerHTML={{ __html: data.reposition }}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
