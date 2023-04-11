import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { motion } from "framer-motion";
import { useState } from "react";
import Overlay from "../Modals/Overlay";
import Modal from "../Modals/Modal";

interface RemoveLancerProps {}

const RemoveUserCard = ({ member, mutateFn }: any) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <>
      <Overlay isOpen={isModalVisible} onClick={() => setIsModalVisible(false)}>
        <Modal close={false}>
          <div className="p-2 flex items-center flex-col gap-6  h-[150px] w-[350px]">
            <h2 className="text-2xl text-center">
              Are you sure you want to delete the Member?
            </h2>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  mutateFn({ memberId: member.userId });
                }}
                className="bg-green-600 px-4 w-24 py-2 flex-grow rounded-md "
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalVisible(false)}
                className="bg-red-600 px-4 py-2 w-24 flex-grow rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </Overlay>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative flex  items-center gap-3 p-4  bg-custom-light-dark rounded-md overflow-hidden"
      >
        <div className="absolute text-sm -right-8 top-2  bg-green-600 px-8 py-2 rotate-45 transition-all duration-100">
          {member.role}
        </div>
        <div className="h-20 w-20 rounded-full overflow-hidden">
          <img
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            src={member.user?.photo}
            alt={member.user?.userName}
          />
        </div>
        <div className="text-2xl flex flex-col gap-2 ">
          <h2>{member.user?.userName}</h2>
          <div>
            <button
              onClick={() => setIsModalVisible(true)}
              className="text-sm bg-red-700 hover:brightness-95 text-white py-2 px-4  rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const RemoveMember: React.FC<RemoveLancerProps> = () => {
  const queryClient = useQueryClient();
  const { workspaceId, role } = useAppSelector((state) => state.workspace);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const membersQuery = useQuery(
    [`members-query`, workspaceId, role],
    async () => {
      const res = await axios.get(
        `/workspace/${userId}/${workspaceId}/get-members`
      );
      return res.data;
    }
  );

  const { mutate } = useMutation(
    async ({ memberId }: { memberId: string }) => {
      const res = await axios.delete(
        `/workspace/${userId}/${workspaceId}/${memberId}/delete-member`
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("members-query");
        console.log("data", data);
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  if (membersQuery.isLoading) {
    return <h1>Loading....</h1>;
  }
  const membersData = membersQuery.data?.data;

  return (
    <div className="grid grid-cols-responsive-remove gap-3">
      {membersData?.map((member: any) => {
        return (
          <RemoveUserCard
            key={member.userId}
            mutateFn={mutate}
            member={member}
          />
        );
      })}
    </div>
  );
};

export default RemoveMember;
