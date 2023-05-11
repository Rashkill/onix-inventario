import Button from "@/components/Button";
import ModalComponent from "@/components/ModalComponent";
import React, { useCallback, useContext, useMemo, useState } from "react";

import "./modal-context.scss";

type ModalContent = string | JSX.Element;

type PromptConfig = {
  className?: string;
  title: string;
  text: string;
  icon?: JSX.Element;
  buttons?: { title: string; color?: string; onClick: () => void }[];
  buttonsDirection?: "row" | "column";
};

export type ModalContextProps = {
  showModal: (content: ModalContent) => number;
  showPrompt: (config: PromptConfig) => number;
  close: (index: number) => void;
};

export const UserContext = React.createContext<ModalContextProps>({
  showModal: () => -1,
  showPrompt: () => -1,
  close: () => null,
});

export const useModal = () => {
  return useContext(UserContext);
};

/**
 * @author Juan Becchio
 */
export const ModalContextProvider: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [modals, setModals] = useState<
    { index: number; content: string | JSX.Element; visible: boolean }[]
  >([]);

  const showModal = useCallback(
    (content: string | JSX.Element) => {
      modals.push({ index: modals.length, content, visible: true });
      setModals([...modals]);
      return modals.length - 1;
    },
    [modals]
  );

  const close = useCallback(
    (index: number) => {
      modals[index].visible = false;
      setModals([...modals]);
      setTimeout(() => {
        remove(index);
      }, 500);
    },
    [modals]
  );

  const remove = useCallback(
    (index: number) => {
      modals.splice(index, 1);
      setModals([...modals]);
    },
    [modals]
  );

  const showPrompt = useCallback(
    (config: PromptConfig) => {
      return showModal(
        <>
          <div className={config.className || "prompt-header"}>
            <h2>
              {config.icon} {config.title}
            </h2>
            <hr style={{ color: "lightgray" }} />
            <p>{config.text}</p>
          </div>
          <div className="modal-buttons">
            {config.buttons?.map((b, i) => (
              <Button
                key={`${i + modals.length} ${b.title}`}
                color={b.color || "secondary"}
                onClick={b.onClick}
                text={b.title}
              />
            ))}
          </div>
        </>
      );
    },
    [modals.length, showModal]
  );

  const values = useMemo(() => ({ showModal, showPrompt, close }), []);

  return (
    <UserContext.Provider value={values}>
      {modals.map((modal) => (
        <ModalComponent
          key={modal.index}
          visible={modal.visible}
          onDismiss={() => close(modal.index)}
        >
          <div className="modal-context">
            {typeof modal.content !== "string" ? (
              modal.content
            ) : (
              <div className="modal-content">
                {modal.content}
                <Button color="primary" onClick={() => close(modal.index)}>
                  Ok
                </Button>
              </div>
            )}
          </div>
        </ModalComponent>
      ))}

      {children}
    </UserContext.Provider>
  );
};

export default ModalContextProvider;
