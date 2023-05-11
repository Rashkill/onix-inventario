import React, { useCallback, useRef, useState } from "react";
import Sticker from "@/assets/logo.png";
import Spinner from "@/components/Spinner";

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
    name: "Nuevo Elemento",
  },
  onChange,
  onClickRemove,
}) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setLoading(true);
        await fileToBase64(e.target.files[0]).then((v) => onChange?.("img", v));
      }
      setLoading(false);
    },
    [onChange]
  );

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
        accept="image/*"
        ref={inputRef}
        type="file"
        onChange={onImageChange}
        multiple={false}
      />
      <div className="card-img" style={{ display: !loading ? "none" : "flex" }}>
        <Spinner />
      </div>
      <img
        style={{ display: loading ? "none" : "flex" }}
        title={data.name}
        alt="element"
        onClick={() => inputRef.current?.click()}
        src={data.img || Sticker}
        className={data.img ? "card-img" : "new-img"}
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
