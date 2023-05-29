import React, { useEffect, useState } from "react";
import * as Apis from "../../apis/apis";
import DetailUi from "./DetailUI";
import BasicModal from "../../components/modal/BasicModal";

interface MemberDetail {
  onClose: (arg0: string) => void;
  memberId: number;
}

const MemberDetail = ({ onClose, memberId }: MemberDetail) => {
  const [memberData, setMemberData] = useState([
    {
      id: 4,
      name: "조윤심",
      email: "postam@gmail.com",
      position: null,
      department: null,
      role: "user",
      enter_date: null,
      is_leave: false,
      user_img: "default.png",
      created_at: "2023-04-13T06:50:15.000Z",
    },
  ]);

  const fetchData = async () => {
    const { data } = await Apis.getMemberDetail(memberId);
    console.log(data);
    setMemberData(data.data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BasicModal onClose={onClose}>
      <DetailUi memberData={memberData} />
    </BasicModal>
  );
};

export default MemberDetail;

// https://tailwindui.com/components/application-ui/data-display/description-lists#component-189e461eb3b78defcc758e837a875b6b
