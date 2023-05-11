import React, { useEffect, useState } from "react";
import "./modal-component.scss";

type ModalComponentProps = {
  visible?: boolean;
  children?: React.ReactElement;
  onDismiss?: () => void;
};

const root = document.body;

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  children,
  onDismiss,
}) => {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    root.style.overflow = visible ? "hidden" : "";

    if (!visible) {
      onDismiss?.();
      setTimeout(() => setMount(false), 500);
    } else setMount(true);
  }, [visible]);

  if (!mount) return <></>;

  return (
    <div className={`modal-component ${visible ? "open" : "closed"}`}>
      {/* <div className="backdrop" /> */}
      <div className="modal">{children}</div>
    </div>
  );
};

export default ModalComponent;
