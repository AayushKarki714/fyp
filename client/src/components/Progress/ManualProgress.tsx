import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import axios from "../../api/axios";
import { Role } from "../../redux/slices/workspaceSlice";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../../redux/store/hooks";
import verifyRole from "../../utils/verifyRole";
import CreateProgress from "../Modals/CreateProgress";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { toast } from "react-toastify";
import ProgressContainer from "./ProgressContainer";

const ManualProgress: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);
  console.log({ workspaceId });

  const progressContainerQuery = useQuery(
    "progress-container-query",
    async () => {
      const res = await axios.get(`progress/${workspaceId}/progress-container`);
      return res;
    },
    { enabled: !!workspaceId }
  );

  const progressContainerMutation = useMutation(
    async (payload: any) => {
      const res = await axios.post(
        `/progress/${user.id}/${workspaceId}/create-progress-container`,
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

  if (progressContainerQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  const progressContainerData = progressContainerQuery?.data?.data?.data || [];
  console.log({ progressContainerData });
  return (
    <>
      <div className="flex flex-col gap-3">
        {isAllowed && (
          <button
            className="flex items-center justify-center p-2 w-10 h-10 rounded-full ml-auto text-gray-400 hover:text-custom-light-green"
            onClick={() => setIsOpen(true)}
          >
            <FolderPlusIcon className="h-6" />
          </button>
        )}
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
              createdByUsername={progressContainer.user.userName}
              photo={progressContainer.user.photo}
              progressContainerId={progressContainer.id}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ManualProgress;
