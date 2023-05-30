import React, { useEffect, useState } from "react";
import * as Apis from "../../apis/apis";
import DetailUi from "./DetailUI";
import BasicModal from "../../components/modal/BasicModal";
import {
  RequestResponse,
  UserInfoDetail,
  VacationsResponse,
} from "../../common/types/commonTypes";

interface MemberDetailProps {
  onClose: (arg0: string) => void;
  memberId: number;
}

export interface MemberData extends UserInfoDetail {
  requests: RequestResponse[] | [];
  vacations: VacationsResponse[] | [];
}

const MemberDetail = ({ onClose, memberId }: MemberDetailProps) => {
  const [memberData, setMemberData] = useState<MemberData | null>(null);

  const fetchData = async () => {
    const { data } = await Apis.getMemberDetail(memberId);
    setMemberData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {memberData !== null && (
        <BasicModal onClose={onClose}>
          <DetailUi memberData={memberData} />
        </BasicModal>
      )}
    </>
  );
};

export default MemberDetail;

// https://tailwindui.com/components/application-ui/data-display/description-lists#component-189e461eb3b78defcc758e837a875b6b
