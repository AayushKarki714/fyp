import React, { useRef, useState } from "react";
import {
  PlusCircleIcon,
  FolderPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Modal from "../components/Modals/Modal";
import Overlay from "../components/Modals/Overlay";
import ProgressModal from "../components/Modals/ProgressModal";
import CreateProgress from "../components/Modals/CreateProgress";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "../api/axios";
import { useAppSelector } from "../redux/store/hooks";
import useOnClickOutside from "../hooks/useOnClickOutside";
import ProgressBarModal from "../components/Modals/ProgressBarModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProgressBarProps {
  width: number;
  text: string;
  progressContainerId: string;
  progressId: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  width,
  text,
  progressId,
  progressContainerId,
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const percentRef = useRef<number>(width);

  const updatePercentMutation = useMutation(
    async (payload: any) => {
      const res = await axios.patch(
        `/progress/${progressContainerId}/${progressId}/update-progress-bar`,
        payload
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries([
            "progress-bar-query",
            progressContainerId,
          ]);
          handleModalClose();
          toast(data?.data?.message);
        }
      },
    }
  );

  function handleModalClose() {
    setIsModalOpen(false);
  }

  const handleProgressUpdate = (progressPercent: number) => {
    updatePercentMutation.mutate({ progressPercent });
  };

  return (
    <>
      <div onDoubleClick={() => setIsModalOpen(true)}>
        <p className="text-sm self-center">{text}</p>
        <div className="relative w-full h-[20px] overflow-hidden">
          <div
            style={{ width: `${width}%` }}
            title={`${width}%`}
            className="absolute left-0 top-0 h-full bg-custom-light-green rounded-md "
          />
        </div>
      </div>
      <Overlay isOpen={isModalOpen} onClick={handleModalClose}>
        <Modal onClick={handleModalClose}>
          <ProgressBarModal
            title={text}
            percent={width}
            onSubmit={handleProgressUpdate}
            prevPercent={percentRef.current}
          />
        </Modal>
      </Overlay>
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
  const queryClient = useQueryClient();
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [progressTitle, setProgressTitle] = useState<string>(title);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const progressBarQuery = useQuery(
    ["progress-bar-query", progressContainerId],
    async () => {
      const res = await axios.get(
        `/progress/${progressContainerId}/progress-bar`
      );
      return res;
    }
  );

  const updateProgressTitleMutation = useMutation(
    async (payload: any) => {
      const res = await axios.patch(
        `/progress/${progressContainerId}/update-progress-title`,
        payload
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        if (data.status === 200) {
          queryClient.invalidateQueries("progress-container-query");
          setEditMode(false);
          toast(data?.data?.message);
        }
      },
    }
  );

  const progressMutation = useMutation(
    async (data: any) => {
      const res = await axios.post(
        `/progress/${progressContainerId}/create-progress-bar`,
        data
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        if (data?.status === 201) {
          queryClient.invalidateQueries([
            "progress-bar-query",
            progressContainerId,
          ]);
          setIsOpen(false);
          toast(data?.data?.message);
        }
      },
    }
  );

  const deleteProgressContainerMutation = useMutation(
    async (deleteProgressContainerId: string) => {
      const res = await axios.delete(
        `/progress/${deleteProgressContainerId}/delete-progress-container`
      );
      return res;
    },
    {
      onError: (data) => {
        console.log("error", data);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries("progress-container-query");
        toast(data?.data?.message);
      },
    }
  );

  const handleDeleteProgresssContainer = () => {
    deleteProgressContainerMutation.mutate(progressContainerId);
  };

  const handleProgressUpload = (data: any) => {
    console.log("handleProgressUpload", data);
    progressMutation.mutate(data);
  };

  const handleProgressTitleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!progressTitle) return toast("Please Fill the Required Field");
    updateProgressTitleMutation.mutate({ title: progressTitle });
  };

  useOnClickOutside(progressContainerRef, () => {
    setEditMode(false);
    setProgressTitle(title);
  });

  if (progressBarQuery.isLoading) {
    return <h2>Loading...</h2>;
  }

  const progressBarData = progressBarQuery.data?.data?.data || [];

  return (
    <>
      <Overlay
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Modal onClick={() => setIsOpen(false)}>
          <ProgressModal onSubmit={handleProgressUpload} />
        </Modal>
      </Overlay>
      <div
        ref={progressContainerRef}
        className="flex flex-col gap-4 border-2 border-custom-light-dark rounded-md p-3 group"
      >
        <div className="flex justify-between items-center">
          {editMode ? (
            <form onSubmit={handleProgressTitleSubmit}>
              <input
                type="text"
                value={progressTitle}
                onChange={(event) => setProgressTitle(event.target.value)}
                className="outline-none bg-custom-light-dark px-2 py-1 text-base rounded-sm text-white"
              />
            </form>
          ) : (
            <h2 onClick={() => setEditMode(true)} className="text-2xl">
              {title}
            </h2>
          )}
          <div className="flex gap-2 items-center ">
            <button
              onClick={() => setIsOpen(true)}
              className="hidden group-hover:block text-sm text-gray-300 hover:text-custom-light-green"
            >
              <PlusCircleIcon className="h-5" />
            </button>
            <button
              onClick={handleDeleteProgresssContainer}
              className="hidden group-hover:block text-sm text-gray-300 hover:text-custom-light-green"
            >
              <TrashIcon className="h-5" />
            </button>
          </div>
        </div>
        <div className="grid  gap-2">
          {progressBarData.map((progressBar: any) => (
            <ProgressBar
              key={progressBar.id}
              text={progressBar.title}
              progressId={progressBar.id}
              progressContainerId={progressContainerId}
              width={progressBar.progressPercent}
            />
          ))}
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
