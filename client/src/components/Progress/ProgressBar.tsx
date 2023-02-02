import { useState, useRef } from "react";
import axios from "../../api/axios";
import { useMutation, useQueryClient } from "react-query";
import Modal from "../Modals/Modal";
import Overlay from "../Modals/Overlay";
import { toast } from "react-toastify";
import ProgressBarModal from "../Modals/ProgressBarModal";

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

export default ProgressBar;
