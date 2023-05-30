import React, { useEffect, useState } from "react";
import * as Apis from "../../apis/apis";
import DetailUi from "./DetailUI";
import BasicModal from "../../components/modal/BasicModal";
import {
  UserInfoDetail,
  VacationsResponse,
} from "../../common/types/commonTypes";

interface MemberDetail {
  onClose: (arg0: string) => void;
  memberId: number;
}

export interface MemberData extends UserInfoDetail {
  user:
    | {
        id: number;
        userId: number;
        vacationId: number;
        useDate: string;
        usingType: string;
        usingDay: number;
        status: string;
        memo: string | null;
        createdAt: string;
        approvedAt: string | null;
        approvedBy: number | null;
        approvedMemo: string | null;
        refusedAt: string | null;
        refusedBy: number | null;
        refusedMemo: string | null;
        canceledAt: string | null;
        canceledBy: number | null;
        canceledMemo: string | null;
      }[]
    | [];
  vacations: VacationsResponse[] | [];
}

const MemberDetail = ({ onClose, memberId }: MemberDetail) => {
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
