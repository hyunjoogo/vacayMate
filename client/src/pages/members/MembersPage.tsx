import React, { useCallback, useEffect, useState } from "react";
import usePage from "./usePage";
import TableStackedColumn from "./TableStackedColumn";
import * as Apis from "../../apis/apis";
import * as ApiErrorHandler from "../../apis/apiErrorHandler";
import filterParams from "../../common/functions/filterParams";
import { UserInfoDetail } from "../../common/types/commonTypes";
import SearchForm from "./SearchForm";
import MemberDetail from "./MemberDetail";
import useModal from "../../hooks/useModal";
import { createPortal } from "react-dom";

interface SelectedValues {
  name: string;
  email: "";
  role: "" | "admin" | "user";
  isLeave: "" | "true" | "false";
}

const MembersPage = () => {
  const { page, handlePage, fetchAfterSetPage } = usePage();
  const { showModal, openModal, closeModal } = useModal();
  const [modalComponent, setModalComponent] = useState(<></>);

  const [membersList, setMembersList] = useState<UserInfoDetail[]>([]);
  const [selectedValues, setSelectedValues] = useState<SelectedValues>({
    name: "",
    email: "",
    role: "",
    isLeave: "",
  });

  const fetchData = useCallback(
    async (nowPage: number = 0) => {
      const params = filterParams({
        name: selectedValues.name,
        email: selectedValues.email,
        role: selectedValues.role,
        isLeave: selectedValues.isLeave,
      });

      try {
        const { data } = await Apis.getMembersList(params, nowPage);
        console.log(data);
        setMembersList(data.data);
        fetchAfterSetPage(data.page);
      } catch (e) {
        ApiErrorHandler.all(e);
      }
    },
    [selectedValues]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateSearchParameters = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedValues({ ...selectedValues, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handlePage(0);
    // fetchData(0);
  };

  const handleClose = (result: string) => {
    console.log(result);
    closeModal();
  };

  const onDetail = (id: number) => {
    setModalComponent(<MemberDetail memberId={id} onClose={handleClose} />);
    openModal();
  };

  return (
    <>
      <TableStackedColumn
        items={membersList}
        tableTitle={
          <>
            <SearchForm
              onSubmit={onSubmit}
              updateSearchParameters={updateSearchParameters}
            />
          </>
        }
        fields={[
          { key: "name", isFixed: true },
          { key: "position", isFixed: false },
          { key: "email", isFixed: false },
          { key: "role", isFixed: true },
          { key: "isLeave", isFixed: true },
        ]}
        onDetail={onDetail}
      />
      {showModal && createPortal(modalComponent, document.body)}
    </>
  );
};

export default MembersPage;
