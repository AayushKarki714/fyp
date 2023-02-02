import React, { useState } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import Modal from "../components/Modals/Modal";
import Overlay from "../components/Modals/Overlay";
import CreateProgress from "../components/Modals/CreateProgress";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressContainer from "../components/Progress/ProgressContainer";

const Progress: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const progressContainerQuery = useQuery(
    "progress-container-query",
    async () => {
      const res = await axios.get(`progress/${workspaceId}/progress-container`);
      return res;
    }
  );

  const progressContainerMutation = useMutation(
    async (payload: any) => {
      const res = await axios.post(
        `/progress/${workspaceId}/create-progress-container`,
        payload
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          setIsOpen(false);
          queryClient.invalidateQueries("progress-container-query");
          toast(data?.data?.message);
        }
      },
    }
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOnCreateProgressContainer = (title: string) => {
    progressContainerMutation.mutate({ title });
  };

  useNavigateToDashboard();

  if (progressContainerQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  const progressContainerData = progressContainerQuery?.data?.data?.data || [];

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center p-2 w-10 h-10 rounded-full ml-auto text-gray-400 hover:text-custom-light-green"
          onClick={() => setIsOpen(true)}
        >
          <FolderPlusIcon className="h-6" />
        </button>
        <Overlay isOpen={isOpen} onClick={closeModal}>
          <Modal onClick={closeModal}>
            <CreateProgress
              onSubmit={(data: string) => handleOnCreateProgressContainer(data)}
            />
          </Modal>
        </Overlay>
        <div className="flex flex-col gap-4">
          {progressContainerData.map((progressContainer: any) => (
            <ProgressContainer
              key={progressContainer.id}
              title={progressContainer.title}
              progressContainerId={progressContainer.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Progress;
