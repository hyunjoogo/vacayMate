import React, { useEffect } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

interface DetailUiProps {
  handleModal?: (result: string) => void;
  memberData: [];
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
  const profile = {
    name: "Ricardo Cooper",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    coverImageUrl:
      "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    about: `
    <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,
    fields: {
      Phone: "(555) 123-4567",
      Email: "ricardocooper@example.com",
      Title: "Senior Front-End Developer",
      Team: "Product Development",
      Location: "San Francisco",
      Sits: "Oasis, 4th floor",
      Salary: "$145,000",
      Birthday: "June 8, 1990",
    },
  };

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
            <div className=" sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <img
                  className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  src={profile.imageUrl}
                  alt=""
                />
              </div>
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h1>
                </div>
                <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <button
                    type="button"
                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <EnvelopeIcon
                      className="-ml-0.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Message
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    <PhoneIcon
                      className="-ml-0.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    Call
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
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
            {Object.keys(profile.fields).map((field) => (
              <div key={field} className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">{field}</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile.fields[field as keyof typeof profile.fields]}
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
