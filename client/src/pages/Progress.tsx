import React, { useState } from "react";
import { PlusCircleIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

import Modal from "../components/Modals/Modal";
import Overlay from "../components/Modals/Overlay";
import ProgressModal from "../components/Modals/ProgressModal";
import CreateProgress from "../components/Modals/CreateProgress";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";
import cogoToast from "cogo-toast";

interface ProgressBarProps {
  width: number;
  text: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ width, text }) => {
  return (
    <>
      <p className="text-sm self-center">{text}</p>
      <div className="relative w-full h-[20px] overflow-hidden">
        <div
          style={{ width: `${width}%` }}
          title={`${width}%`}
          className="absolute left-0 top-0 h-full bg-custom-light-green rounded-md "
        />
      </div>
    </>
  );
};

interface ProgressContainerProps {
  title: string;
  progressContainerId: string;
}

const ProgressContainer: React.FC<ProgressContainerProps> = ({
  title,
  progressContainerId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Overlay
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Modal onClick={() => setIsOpen(false)}>
          <ProgressModal />
        </Modal>
      </Overlay>
      <div className="flex flex-col gap-4 border-2 border-custom-light-dark rounded-md p-3 group">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">{title}</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="hidden group-hover:block text-sm text-gray-300 hover:text-custom-light-green"
          >
            <PlusCircleIcon className="h-5" />
          </button>
        </div>
        <div className="grid  gap-2">
          <ProgressBar width={100} text="React" />
          <ProgressBar width={80} text="Golang" />
          <ProgressBar width={50} text="Typscript" />
          <ProgressBar width={30} text="Pre-react" />
        </div>
      </div>
    </>
  );
};

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
        setIsOpen(false);
        cogoToast.info(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          setIsOpen(false);
          queryClient.invalidateQueries("progress-container-query");
          cogoToast.success(data?.data?.message);
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
  );
};

export default Progress;
