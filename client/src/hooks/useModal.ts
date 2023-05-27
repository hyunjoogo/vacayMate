import { useRecoilState } from "recoil";
import { modalStateAtom } from "../recoil/atoms";
const useModal = () => {
  const [showModal, setShowModal] = useRecoilState(modalStateAtom);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setTimeout(() => setShowModal(false), 300);
  };

  return {
    showModal,
    openModal,
    closeModal,
  };
};

export default useModal;
