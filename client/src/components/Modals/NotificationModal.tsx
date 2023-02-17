import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import handleStopPropagation from "../../utils/handleStopPropagation";
import NotificationType from "../../utils/NotificationType";
import InvitationStatus from "../../utils/InvitationStatus";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { format, formatRelative } from "date-fns";

interface InvitationRequestProps {
  notification: any;
}

interface UpdateTitleNotificationProps {
  notification: any;
}

interface DeleteWorkspaceNotificationProps {
  notification: any;
}
const DeleteWorkspaceNotification: React.FC<
  DeleteWorkspaceNotificationProps
> = ({ notification }) => {
  return (
    <div>
      <div className="border-2 p-2 rounded-md flex gap-4 items-center">
        <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={notification?.sender?.photo}
            alt={notification?.sender?.userName}
          />
        </figure>
        <div className="flex flex-col gap-1">
          <h3 className="text-base">
            The Admin of the Workspace ({notification?.sender?.userName}){" "}
            {notification.message}
          </h3>
          <div className="flex justify-between items-center  gap-1">
            <p className="text-xs text-custom-light-green">
              {formatRelative(new Date(), new Date(notification.createdAt))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateTitleNotification: React.FC<UpdateTitleNotificationProps> = ({
  notification,
}: UpdateTitleNotificationProps) => {
  return (
    <div className="border-2 p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">{notification.message}</h3>
        <div className="flex justify-between items-center  gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(), new Date(notification.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
};

const InvitationRequest: React.FC<InvitationRequestProps> = ({
  notification,
}) => {
  const queryClient = useQueryClient();
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const { mutate } = useMutation(
    async (data: any) => {
      const res = await axios.patch(`/workspace/${userId}/invitation`, data);
      return res?.data;
    },
    {
      onSuccess(data) {
        console.log("data", data);
        queryClient.invalidateQueries("notifications");
      },
      onError(error) {
        console.log("error", error);
      },
    }
  );

  const handleUpdateInvitationStatus = ({
    notificationId,
    invitationStatus,
    invitationId,
  }: {
    notificationId: string;
    invitationStatus: InvitationStatus;
    invitationId: string;
  }) => {
    mutate({ notificationId, invitationStatus, invitationId });
  };

  return (
    <div className="border-2 p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">
          {notification.message} by {notification.sender?.userName}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(), new Date(notification.createdAt))}
          </p>
          <div className="text-sm flex items-center gap-2">
            <button
              onClick={() => {
                handleUpdateInvitationStatus({
                  notificationId: notification.id,
                  invitationId: notification.invitationId,
                  invitationStatus: InvitationStatus.ACCEPTED,
                });
              }}
              className="bg-green-600 py-2 px-4 text-white rounded-md"
            >
              Accept
            </button>
            <button
              onClick={() => {
                handleUpdateInvitationStatus({
                  notificationId: notification.id,
                  invitationId: notification.invitationId,
                  invitationStatus: InvitationStatus.DECLINED,
                });
              }}
              className="bg-red-600 py-2 px-4 text-white rounded-md"
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AcceptDeclineInvitationProps {
  type: NotificationType;
  notification: any;
}

const AcceptDeclineInvitation: React.FC<AcceptDeclineInvitationProps> = ({
  type,
  notification,
}) => {
  const isAccepted =
    type === NotificationType.ACCEPTED_INVITATION ? true : false;
  return (
    <div className="border-2 p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">
          {notification.message} by {notification.sender?.userName}
        </h3>
        <div className="flex justify-between items-center  gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(), new Date(notification.createdAt))}
          </p>
          <div
            className={`${
              isAccepted ? "bg-green-600" : "bg-red-600"
            } py-1 px-3 text-white text-xs rounded-md`}
          >
            <span>{isAccepted ? "Accepted" : "Declined"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InvitationCreatorProps {
  notification: any;
}

const InvitationCreator: React.FC<InvitationCreatorProps> = ({
  notification,
}) => {
  return (
    <div className="border-2 p-2 rounded-md flex gap-4 items-center">
      <figure className=" border-2 border-custom-light-green flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.invitation?.workspace?.logo}
          alt={notification?.invitation?.workspace?.name}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">{notification.message}</h3>
        <div className="flex justify-between items-center  gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(), new Date(notification.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
};

interface NotificationTemplateDeciderProps {
  type: NotificationType;
  notification: any;
}
const NotificationTemplateDecider: React.FC<
  NotificationTemplateDeciderProps
> = ({ type, notification }) => {
  let content;
  if (type === NotificationType.INVITATION) {
    content = <InvitationRequest notification={notification} />;
  } else if (
    type === NotificationType.ACCEPTED_INVITATION ||
    type === NotificationType.DECLINED_INVITATION
  ) {
    content = (
      <AcceptDeclineInvitation notification={notification} type={type} />
    );
  } else if (type === NotificationType.INVITATION_CREATOR) {
    content = <InvitationCreator notification={notification} />;
  } else if (type === NotificationType.WORKSPACE_TITLE_UPDATE) {
    content = <UpdateTitleNotification notification={notification} />;
  } else if (type === NotificationType.DELETE_WORKSPACE) {
    content = <DeleteWorkspaceNotification notification={notification} />;
  } else {
    content = <div>Hola</div>;
  }

  return <div>{content}</div>;
};

const NotificationModal: React.FC = () => {
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);

  const { mutate: markAsReadMutate } = useMutation(
    async () => {
      const res = await axios.patch(
        `/notification/${userId}/mark-notification-read`
      );
      return res.data;
    },
    {
      onSuccess(data: any) {
        console.log("data", data);
      },
      onError(error: any) {
        console.log("error", error);
      },
    }
  );

  const { data: notifications, isLoading } = useQuery(
    "notifications",
    async () => {
      const res = await axios.get(`/notification/${userId}/get-notifications`);
      return res.data?.data;
    }
  );

  useEffect(() => {
    markAsReadMutate();
  }, [markAsReadMutate]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleStopPropagation}
      className="fixed  h-[85vh] flex flex-col gap-3 top-14 right-20 w-[360px] bg-custom-light-dark border-2 border-dark-gray shadow-md rounded-md p-2 text-2xl z-50 origin-top-right overflow-y-auto overflow-x-hidden custom-scrollbar"
    >
      <h2>Notifications</h2>
      <div className="flex flex-col gap-3">
        {notifications?.map((notification: any) => (
          <div key={notification.id}>
            <NotificationTemplateDecider
              type={notification.type}
              notification={notification}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationModal;
