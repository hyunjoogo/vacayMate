import React from "react";
import SingleModal from "../../components/modal/SingleModal";

interface MemberDetail {
  onClose: (arg0: string) => void;
  memberId: number;
}

const MemberDetail = ({ onClose, memberId }: MemberDetail) => {
  console.log(onClose, memberId);
  return (
    <SingleModal onClose={onClose} title={"회원상세정보"}>
      <></>
    </SingleModal>
  );
};

export default MemberDetail;
