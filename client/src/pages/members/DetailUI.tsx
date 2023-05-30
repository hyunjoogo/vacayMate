import React, { useEffect, useState } from "react";
import Profile from "./detailComponents/Profile";
import { MemberData } from "./MemberDetail";
import {
  UserInfoDetail,
  VacationsResponse,
} from "../../common/types/commonTypes";
import Vacations from "./detailComponents/Vacations";
import logo from "../../logo.svg";

interface DetailUiProps {
  handleModal?: (result: string) => void;
  memberData: MemberData | null;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const DetailUi = ({ handleModal, memberData }: DetailUiProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("vacations");
  const [tabs, setTabs] = useState([
    { name: "상세정보", key: "profile" },
    { name: "휴가현황", key: "vacations" },
    { name: "사용현황", key: "requests" },
  ]);

  useEffect(() => {
    console.log(memberData);
  }, []);

  const { vacations, user, ...otherKeys } =
    memberData ?? ({} as Partial<MemberData>);
  const memberVacations = vacations as VacationsResponse[];
  const profile = otherKeys as UserInfoDetail;
  // @ts-ignore
  return (
    <>
      <article>
        <div>
          <button
            onClick={() => {
              if (handleModal) {
                handleModal("cancel");
              }
            }}
          >
            클로즈
          </button>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div
              className="flex gap-x-3"
              // sm:flex sm:items-end sm:space-x-5
            >
              <div className="flex">
                <img
                  className="h-24 w-24 rounded-full ring-4 ring-white"
                  src={
                    profile?.userImg === "default.png" || null
                      ? logo
                      : profile?.userImg
                  }
                  alt="user Image"
                />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
                <div className="min-w-0 flex-1 ">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile?.name}
                  </h1>
                  <p className="truncate font-bold text-gray-900">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 sm:mt-2 2xl:mt-5">
          <div className="border-b border-gray-200">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <span
                    key={tab.name}
                    className={classNames(
                      tab.key === selectedTab
                        ? "border-pink-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer"
                    )}
                    aria-current={tab.key === selectedTab ? "page" : undefined}
                    onClick={() => setSelectedTab(tab.key)}
                  >
                    {tab.name}
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Profile list */}
        {selectedTab === "profile" && <Profile profile={profile} />}
        {selectedTab === "vacations" && (
          <Vacations memberVacations={memberVacations}></Vacations>
        )}
        {selectedTab === "requests" && <>134443</>}
      </article>
    </>
  );
};

export default DetailUi;
