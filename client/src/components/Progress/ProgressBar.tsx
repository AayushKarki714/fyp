import { useState, useRef } from "react";
import axios from "../../api/axios";
import { useMutation, useQueryClient } from "react-query";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { toast } from "react-toastify";
import ProgressBarModal from "../Modals/ProgressBarModal";
import { useAppSelector } from "../../redux/store/hooks";
import verifyRole from "../../utils/verifyRole";
import { Role } from "../../redux/slices/workspaceSlice";

interface Props {
  width: number;
  text: string;
  progressContainerId: string;
  progressId: string;
}

const ProgressBar: React.FC<Props> = ({
  width,
  text,
  progressId,
  progressContainerId,
}) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const percentRef = useRef<number>(width);
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const { user } = useAppSelector((state) => state.auth);
  const isAllowed = verifyRole(role, [Role.ADMIN, Role.LANCER]);

  const updatePercentMutation = useMutation(
    async (payload: any) => {
      const res = await axios.patch(
        `/progress/${user.id}/${workspaceId}/${progressContainerId}/${progressId}/update-progress-bar`,
        payload
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
        handleModalClose();
        toast(data?.data?.message);
      },
    }
  );

  function handleModalClose() {
    setIsModalOpen(false);
  }

  const handleProgressUpdate = ({
    progressPercent,
    progressTitle,
  }: {
    progressPercent: number;
    progressTitle: string;
  }) => {
    updatePercentMutation.mutate({ progressPercent, progressTitle });
  };

  return (
    <>
      <div onDoubleClick={isAllowed ? () => setIsModalOpen(true) : () => {}}>
        <div className="flex gap-3">
          <div>
            <img src="" alt="Profile" />
          </div>
          <div className="flex-grow flex flex-col bg-red-500">
            <p className="text-sm ">{text}</p>
            <div className="relative w-full h-[20px] overflow-hidden">
              <div
                style={{ width: `${width}%` }}
                title={`${width}%`}
                className="absolute left-0 top-0 h-full bg-custom-light-green rounded-md "
              />
            </div>
          </div>
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

export default ProgressBar;
