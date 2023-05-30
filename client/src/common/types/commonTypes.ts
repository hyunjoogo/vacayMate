export interface VacationsResponse {
  id: number;
  userId: number;
  type: string;
  memo: string | null;
  leftDays: number;
  totalDays: number;
  expirationDate: string;
}

export interface ProcessStatusTypes {
  approvedAt: string | null;
  approvedBy: number | null;
  approvedMemo: string | null;
  refusedAt: number | null;
  refusedBy: string | null;
  refusedMemo: string | null;
  canceledAt: string | null;
  canceledBy: number | null;
  canceledMemo: string | null;
}

export interface UserInfoDetail {
  id: number;
  name: string;
  email: string;
  position: string | null;
  department: string | null;
  role: string;
  enterDate: string | null;
  isLeave: boolean;
  userImg: string;
  createdAt: string;
}

export interface MemberResponse extends ProcessStatusTypes {
  id: number;
  userId: number;
  vacationId: number;
  useDate: string;
  usingType: string;
  usingDay: number;
  status: string;
  memo: string | null;
  createdAt: string;
  user: UserInfoDetail;
}
