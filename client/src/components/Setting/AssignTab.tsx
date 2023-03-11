import { useState } from "react";
import axios from "../../api/axios";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useAppDispatch, useAppSelector } from "../../redux/store/hooks";
import Overlay from "../Modals/Overlay";
import { motion } from "framer-motion";
import Modal from "../Modals/Modal";
import { useNavigate } from "react-router-dom";

interface AppointAsAdminCardProps {
  member: any;
  mutateFn: any;
}

const AppointAsAdminCard: React.FC<AppointAsAdminCardProps> = ({
  member,
  mutateFn,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Overlay isOpen={isModalVisible} onClick={() => setIsModalVisible(false)}>
        <Modal close={false}>
          <div className="p-2 flex items-center flex-col gap-6   w-[350px]">
            <h2 className="text-xl text-center">
              Are you sure you want to Appoint new Admin (Remember that you will
              no longer be part of the workspace if you assign another member an
              admin)
            </h2>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  mutateFn({ recieverId: member.userId });
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
              className="text-sm bg-green-600 hover:brightness-95 text-white py-2 px-4  rounded-md"
            >
              Appoint as Admin
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

function AssignTab() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { workspaceId } = useAppSelector((state) => state.workspace);
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const membersQuery = useQuery(`members-query`, async () => {
    const res = await axios.get(
      `/workspace/${userId}/${workspaceId}/get-members`
    );
    return res.data;
  });

  const { mutate } = useMutation(
    async (data: any) => {
      const res = await axios.patch(
        `/workspace/${workspaceId}/${userId}/appoint-admin`,
        data
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        // dispatch(switchWorkSpace({ workspaceId: "", role: Role.CLIENT }));
        // navigate("/dashboard", { replace: true });
        queryClient.invalidateQueries("notifications");
        queryClient.invalidateQueries("unread-notifications");
        console.log("data", data);
      },
      onError: (error) => {
        console.log("error", error);
      },
    }
  );

  if (membersQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  const membersData = membersQuery.data?.data;
  console.log(membersData);

  return (
    <div>
      <div className="grid grid-cols-responsive-remove gap-3">
        {membersData?.map((member: any) => {
          return (
            <AppointAsAdminCard
              key={member.userId}
              mutateFn={mutate}
              member={member}
            />
          );
        })}
      </div>
    </div>
  );
}

export default AssignTab;
