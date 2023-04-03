import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";
import AdditionalWorkspaceDetails from "./AdditionalWorkspaceDetails";

const DeleteWorkspaceCard = ({ name, id, logo, index, page }: any) => {
  const { admin } = useSystemAdmin();
  const [expand, setExpand] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${id}/delete-workspace`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(`workspace-analytics-${page}`);
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.3 }}
      className="bg-custom-black border-2 border-custom-light-dark flex items-center flex-col gap-3 p-6 rounded-md"
    >
      <img
        className="w-28 h-28 rounded-full border-2 border-custom-light-green"
        referrerPolicy="no-referrer"
        src={logo}
        alt={name}
      />
      <h2 className="text-xl text-gray-300">{name}</h2>
      <button
        onClick={() => mutate()}
        className="bg-red-600 self-stretch px-6 py-2 text-white rounded-md"
      >
        Delete
      </button>
      <button
        onClick={() => setExpand((prevVal) => !prevVal)}
        className={`flex ${
          expand ? "text-custom-light-green" : "text-gray-300 opacity-70"
        }  self-end items-center gap-1 text-xs mt-4 `}
      >
        <span>
          {expand ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 " />
          )}
        </span>
        View Details
      </button>
      {expand && <AdditionalWorkspaceDetails workspaceId={id} />}
    </motion.div>
  );
};

async function fetchWorkspaceDetails(page: number, admin: any) {
  const res = await systemAxios.get(
    `/system-admin/all/workspaces/?page=${page}`,
    {
      headers: { authorization: `Bearer ${(admin as any).token}` },
    }
  );
  return res.data?.data;
}

function WorkspaceAnalytics() {
  const [page, setPage] = useState(1);
  const pageCount = 4;
  const { admin } = useSystemAdmin();
  const queryClient = useQueryClient();
  const totalCount: any = queryClient.getQueryData("total-count");
  const totalPage = Math.ceil(totalCount.workspaceCount / pageCount);

  const { data, isLoading } = useQuery(`workspace-analytics-${page}`, () =>
    fetchWorkspaceDetails(page, admin)
  );

  const nextPageHandler = () => {
    setPage((prevPage) => (prevPage === totalPage ? prevPage : prevPage + 1));
  };

  const prevPageHandler = () => {
    setPage((prevPage) => (prevPage === 1 ? prevPage : prevPage - 1));
  };

  if (isLoading) return <Spinner isLoading={isLoading} />;
  console.log({ data });
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="grid flex-grow w-full  items-start grid-cols-4 gap-6 pb-5">
        <AnimatePresence>
          {data.length > 0 ? (
            data.map((workspace: any, index: number) => {
              return (
                <DeleteWorkspaceCard
                  page={page}
                  key={workspace.id}
                  index={index}
                  id={workspace.id}
                  logo={workspace.logo}
                  members={workspace.Member}
                  name={workspace.name}
                />
              );
            })
          ) : (
            <h2 className=" col-start-1 col-end-5 text-center mt-12 text-2xl text-gray-500">
              Not any Workspace Registered in the System
            </h2>
          )}
        </AnimatePresence>
      </div>
      {data?.length > 0 && (
        <div className="flex flex-row items-center justify-center  gap-6">
          <button
            onClick={prevPageHandler}
            className="w-10 h-10 rounded-full disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center bg-custom-light-green cursor-pointer"
            disabled={page === 1}
          >
            <ChevronLeftIcon className="h-5 w-5 text-white" />
          </button>
          <span className="text-custom-light-green">{page}</span>
          <button
            onClick={nextPageHandler}
            className="w-10 h-10 bg-custom-light-green disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center rounded-full cursor-pointer"
            disabled={page === totalPage}
          >
            <ChevronRightIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}

export default WorkspaceAnalytics;
