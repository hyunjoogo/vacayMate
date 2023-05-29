import React, { useEffect } from "react";
import { MemberData } from "./MemberDetail";

interface DetailUiProps {
  handleModal?: (result: string) => void;
  memberData: MemberData | null;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const tabs = [
  { name: "상세정보", href: "#", current: true },
  { name: "휴가현황", href: "#", current: false },
  { name: "사용현황", href: "#", current: false },
];

const DetailUi = ({ handleModal, memberData }: DetailUiProps) => {
  useEffect(() => {
    console.log(memberData);
  }, []);

  const { vacations, user, ...otherKeys } =
    memberData ?? ({} as Partial<MemberData>);

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
              className="flex"
              // sm:flex sm:items-end sm:space-x-5
            >
              <div className="flex">
                <img
                  className="h-24 w-24 rounded-full ring-4 ring-white"
                  src={otherKeys?.userImg}
                  alt=""
                />
              </div>
              <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
                <div className="min-w-0 flex-1 ">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {otherKeys?.name} 이메일
                  </h1>
                  <h1 className="truncate font-bold text-gray-900">
                    부서명 직책
                  </h1>
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
                  <a
                    key={tab.name}
                    href={tab.href}
                    className={classNames(
                      tab.current
                        ? "border-pink-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                      "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                    )}
                    aria-current={tab.current ? "page" : undefined}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Description list */}
        <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {Object.keys(otherKeys).map((field) => (
              <div key={field} className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">{field}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {otherKeys[field as keyof typeof otherKeys]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </>
  );
};

export default DetailUi;
