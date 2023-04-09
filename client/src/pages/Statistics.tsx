import { useState } from "react";
import { Role } from "../redux/slices/workspaceSlice";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { useQuery } from "react-query";
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

async function fetchPopularByRole(role: Role) {
  const res = await axios.get(`/statistics/users/${role}/popular`);
  return res?.data?.data;
}

interface StatisticsTabBtnProps {
  children: React.ReactNode;
  selectedTab: Role;
  tabType: Role;
  onSelectTab: () => any;
  isActive: boolean;
}

function StatisticsTabBtn({
  children,
  isActive,
  onSelectTab,
}: StatisticsTabBtnProps) {
  return (
    <motion.button
      className={`relative px-6 py-2 ${
        isActive ? "text-custom-light-green" : "text-gray-400"
      }`}
      onClick={onSelectTab}
    >
      {children}
      {isActive && (
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-1 bg-custom-light-green"
          layoutId="statistics-underline"
        ></motion.span>
      )}
    </motion.button>
  );
}

function Statistics() {
  const [selectedRoleTab, setSelectedRoleTab] = useState(Role.ADMIN);
  const { data, isLoading } = useQuery(
    ["popular", selectedRoleTab],
    fetchPopularByRole.bind(null, selectedRoleTab)
  );

  console.log({ data });

  return (
    <div className="w-full flex flex-col h-full">
      <div className="text-2xl flex items-center gap-8 justify-center border-b-[2px] border-custom-light-dark">
        {[Role.ADMIN, Role.LANCER, Role.CLIENT].map((roleType) => (
          <StatisticsTabBtn
            selectedTab={selectedRoleTab}
            tabType={roleType}
            isActive={selectedRoleTab === roleType}
            onSelectTab={() => {
              setSelectedRoleTab(roleType);
            }}
          >
            {roleType}
          </StatisticsTabBtn>
        ))}
      </div>
      <div
        className={`grid flex-grow p-6 ${
          isLoading ? "grid-cols-1" : "grid-cols-3 auto-rows-min"
        } gap-6`}
      >
        {isLoading ? (
          <p className="self-center justify-self-center w-full h-full">
            Loading...
          </p>
        ) : (
          data.map((userData: any) => {
            return (
              <div
                key={userData.id}
                className="flex gap-4 flex-col relative bg-custom-light-dark p-6 rounded-2xl cursor-pointer hover:-translate-y-2 duration-200 transition-all overflow-hidden"
              >
                <div className="absolute right-0 top-0 left-0 overflow-hidden translate-x-[40%] -translate-y-[40%]">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill={
                        selectedRoleTab === Role.ADMIN
                          ? "#F15A59"
                          : selectedRoleTab === Role.LANCER
                          ? "#8AD85C"
                          : "rgb(37,99,235)"
                      }
                      d="M23.9,-44.6C29.2,-38.3,30.4,-28.3,39.9,-20.3C49.3,-12.2,66.9,-6.1,70.3,2C73.7,10.1,63,20.1,57.1,34.3C51.2,48.5,50.2,66.8,41.5,66.4C32.8,66,16.4,46.9,4.6,39C-7.3,31,-14.5,34.4,-26.2,36.5C-37.9,38.7,-54.1,39.6,-58.6,33.3C-63.2,27,-56.1,13.5,-52.4,2.2C-48.6,-9.2,-48.1,-18.3,-43.1,-23.8C-38.1,-29.3,-28.5,-31,-20.6,-35.8C-12.6,-40.6,-6.3,-48.5,1.5,-51C9.3,-53.6,18.6,-51,23.9,-44.6Z"
                      transform="translate(100 100)"
                    />
                  </svg>
                </div>

                <div className="flex flex-col gap-1  relative ">
                  <figure className="w-20 h-20 rounded-full overflow-hidden">
                    <img
                      src={userData?.photo}
                      className="w-full h-full object-cover"
                      alt={userData?.userName}
                    />
                  </figure>
                  <h2 className="text-2xl">{userData?.userName}</h2>
                </div>
                <div className="text-lg relative ">
                  <div className="grid gap-x-2 grid-cols-[min-content_max-content]">
                    <BuildingOffice2Icon className="h-8 w-8 text-custom-light-green" />
                    <p className="self-end text-gray-300">
                      Total Workspaces: {userData?.totalCount}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Statistics;
