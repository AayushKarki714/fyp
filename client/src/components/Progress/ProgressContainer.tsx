import { useState, useRef } from "react";
import axios from "../../api/axios";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ProgressBar from "./ProgressBar";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import ProgressModal from "../Modals/ProgressModal";
import { useAppSelector } from "../../redux/store/hooks";
import verifyRole from "../../utils/verifyRole";
import { Role } from "../../redux/slices/workspaceSlice";
import DeleteConfirmation from "../Modals/DeleteConfirmation";

interface Props {
  title: string;
  createdByUsername: string;
  photo: string;
  progressContainerId: string;
}

const ProgressContainer: React.FC<Props> = ({
  title,
  progressContainerId,
  createdByUsername,
  photo,
}) => {
  const queryClient = useQueryClient();
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [progressTitle, setProgressTitle] = useState<string>(title);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

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
        `/progress/${user.id}/${workspaceId}/${progressContainerId}/update-progress-title`,
        payload
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries("progress-container-query");
        setEditMode(false);
        toast(data?.data?.message);
      },
    }
  );

  const progressMutation = useMutation(
    async (data: any) => {
      const res = await axios.post(
        `/progress/${user.id}/${workspaceId}/${progressContainerId}/create-progress-bar`,
        data
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries([
          "progress-bar-query",
          progressContainerId,
        ]);
        setIsOpen(false);
        toast(data?.data?.message);
      },
    }
  );

  const deleteProgressContainerMutation = useMutation(
    async (deleteProgressContainerId: string) => {
      const res = await axios.delete(
        `/progress/${user.id}/${workspaceId}/${deleteProgressContainerId}/delete-progress-container`
      );
      return res;
    },
    {
      onError: (error: any) => {
        toast(error?.response?.data?.message);
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
    const { progressPercent } = data;
    if (Number(progressPercent) > 100 || Number(progressPercent) < 0)
      return toast("Percentage can be from  0 to 100");
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
  console.log({ progressBarData });

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
      <DeleteConfirmation
        isVisible={showConfirmationModal}
        message={`Do you want to delete Progress Container named ${title}?`}
        onCancel={() => setShowConfirmationModal(false)}
        onConfirm={handleDeleteProgresssContainer}
      />
      <div
        ref={progressContainerRef}
        className="flex flex-col gap-4 border-2 border-custom-light-dark rounded-md p-3 group"
      >
        <div className="flex justify-between items-center">
          {isAllowed && editMode ? (
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
          {isAllowed && (
            <div className="flex gap-2 items-center ">
              <button
                onClick={() => setIsOpen(true)}
                className="hidden group-hover:block text-sm text-gray-400 hover:text-custom-light-green"
              >
                <PlusCircleIcon className="h-5" />
              </button>
              <button
                onClick={() => setShowConfirmationModal(true)}
                className="hidden group-hover:block text-sm text-gray-400 hover:text-custom-light-green"
              >
                <TrashIcon className="h-5" />
              </button>
            </div>
          )}
        </div>
        <div className="grid  gap-4">
          {progressBarData?.map((progressBar: any) => (
            <ProgressBar
              key={progressBar.id}
              text={progressBar.title}
              progressId={progressBar.id}
              createdByUsername={progressBar?.user?.userName}
              photo={progressBar?.user?.photo}
              progressContainerId={progressContainerId}
              width={progressBar.progressPercent}
            />
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 text-base">
          <p className="text-gray-400 hover:text-white">
            by {createdByUsername}
          </p>
          <div className="h-8 w-8 rounded-full overflow-x-hidden">
            <img
              src={photo}
              alt={createdByUsername}
              className="w-full h-full object-containj"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressContainer;
