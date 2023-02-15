import React, { useEffect } from "react";
import axios from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { motion } from "framer-motion";
import handleStopPropagation from "../../utils/handleStopPropagation";
import { useAppSelector } from "../../redux/store/hooks";
import { formatDistance } from "date-fns";

enum NotificationType {
  NORMAL = "NORMAL",
  INVITATION = "INVITATION",
}

enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

interface InvitationProps {
  notificationData: any;
}

const Invitation: React.FC<InvitationProps> = ({ notificationData }) => {
  const queryClient = useQueryClient();
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const updateInvitationMutation = useMutation(
    async (data: any) => {
      const res = await axios.patch(`/workspace/${userId}/invitation`, {
        ...data,
        notificationId: notificationData.id,
      });
      return res.data;
    },
    {
      onSuccess(data) {
        if ((data.message = "You ACCEPTED Sucessfully")) {
          queryClient.invalidateQueries("workspace-query");
          queryClient.invalidateQueries("notification-query");
          console.log(data);
        }
      },
      onError(error) {
        console.log("errir", error);
      },
    }
  );

  const handleInvitationStatus = ({
    invitationId,
    invitationStatus,
  }: {
    invitationId: string;
    invitationStatus: InvitationStatus;
  }) => {
    updateInvitationMutation.mutate({ invitationId, invitationStatus });
  };

  return (
    <div className="flex  items-center gap-4  bg-custom-black rounded-md p-2">
      <div>
        <figure className="w-20 h-20 rounded-full overflow-hidden border-2 border-custom-light-green">
          <img
            className="w-full h-full object-cover"
            src={notificationData?.workspace?.logo}
            alt="Workspace"
          />
        </figure>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-xl">{notificationData.message}</h3>
          <p className="text-sm text-gray-300">
            {formatDistance(new Date(), new Date(notificationData.createdAt))}{" "}
            ago
          </p>
        </div>
        <div className="flex gap-2 text-base">
          <button
            onClick={() =>
              handleInvitationStatus({
                invitationId: notificationData.invitationId,
                invitationStatus: InvitationStatus.ACCEPTED,
              })
            }
            className="px-4 py-2 hover:brightness-95 bg-green-600 rounded-md "
          >
            Accept
          </button>
          <button
            onClick={() =>
              handleInvitationStatus({
                invitationId: notificationData.invitationId,
                invitationStatus: InvitationStatus.DECLINED,
              })
            }
            className="px-4 py-2 hover:brightness-95 bg-red-600 rounded-md "
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationModal: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const markNotificationReadMutation = useMutation(
    async () => {
      const res = await axios.patch(
        `/notification/${userId}/mark-notification-read`
      );
      return res.data;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries("unread-notifications");
        console.log(data);
      },
      onError(error) {
        console.log("errir", error);
      },
    }
  );

  const notificationsQuery = useQuery("notification-query", async () => {
    const res = await axios.get(`/notification/${userId}/get-notifications`);
    return res.data;
  });

  useEffect(() => {
    markNotificationReadMutation.mutate();
  }, []);

  if (notificationsQuery.isLoading) {
    return <h1>Loading....</h1>;
  }

  const notificationsData = notificationsQuery.data?.data;
  console.log("notificationsData", notificationsData);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleStopPropagation}
      className="fixed  h-[85vh] flex flex-col gap-3 top-14 right-20 w-[360px] bg-custom-light-dark border-2 border-dark-gray shadow-md rounded-md p-2 text-2xl z-50 origin-top-right overflow-y-auto overflow-x-hidden custom-scrollbar"
    >
      <h2>Notifications</h2>
      {notificationsData.map((notificationData: any) => (
        <div key={notificationData.id}>
          {notificationData.type === NotificationType.INVITATION ? (
            <Invitation notificationData={notificationData} />
          ) : (
            <div className="flex items-center gap-4  bg-custom-black rounded-md p-2">
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-xl">{notificationData.message}</h3>
                  <p className="text-sm text-gray-300">
                    {formatDistance(
                      new Date(),
                      new Date(notificationData.createdAt)
                    )}{" "}
                    ago
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default NotificationModal;
