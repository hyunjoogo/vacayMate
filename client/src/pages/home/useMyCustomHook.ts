import { UserContextValue } from "../../contexts/AppContext";
import { useRecoilValue } from "recoil";
import { userContextAtom } from "../../atom/atoms";

export const useMyCustomHook = () => {
  const userInfo: UserContextValue = useRecoilValue(userContextAtom);

  // Insert other Recoil state here...
  // Insert other hook logic here...
  return userInfo;
};
