import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalComponentsAtom, modalStateAtom } from "../atom/atoms";

// https://tailwindui.com/components/application-ui/overlays/modals

const Modal = () => {
  const isOpen = useRecoilValue(modalStateAtom);
  const [modalComponents] = useRecoilState(modalComponentsAtom);

  if (isOpen === false) {
    return null;
  }

  return (
    <>
      {modalComponents.map((component, index) => (
        <React.Fragment key={index}>{component}</React.Fragment>
      ))}
    </>
  );
};

export default Modal;
