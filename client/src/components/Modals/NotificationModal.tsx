import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import handleStopPropagation from "../../utils/handleStopPropagation";
import NotificationType from "../../utils/NotificationType";
import InvitationStatus from "../../utils/InvitationStatus";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import { formatRelative } from "date-fns";
import { TrashIcon } from "@heroicons/react/24/solid";

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
      <div className=" p-2 rounded-md flex gap-4 items-center">
        <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={notification?.sender?.photo}
            alt={notification?.sender?.userName}
          />
        </figure>
        <div className="flex flex-col gap-1">
          <h3 className="text-base">
            The Admin of the Workspace {notification?.sender?.userName}{" "}
            {notification.message}
          </h3>
          <div className="flex justify-between items-center  gap-1">
            <p className="text-xs text-custom-light-green">
              {formatRelative(new Date(notification.createdAt), new Date())}
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
    <div className=" p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">
          {notification?.message.replace(
            "senderName",
            notification?.sender?.userName
          )}
        </h3>
        <div className="flex justify-between items-center  gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(notification.createdAt), new Date())}
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
        queryClient.invalidateQueries("workspace-query");
        queryClient.invalidateQueries("notifications");
      },
      onError(error) {},
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
    <div className=" p-2 rounded-md flex gap-4 items-center">
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
            {formatRelative(new Date(notification.createdAt), new Date())}
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
const AcceptDeclineAdmin: React.FC<AcceptDeclineInvitationProps> = ({
  type,
  notification,
}) => {
  const isAccepted =
    type === NotificationType.APPOINT_ADMIN_ACCEPTED ? true : false;
  return (
    <div className=" p-2 rounded-md flex gap-4 items-center">
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
            {formatRelative(new Date(notification.createdAt), new Date())}
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

const AcceptDeclineInvitation: React.FC<AcceptDeclineInvitationProps> = ({
  type,
  notification,
}) => {
  const isAccepted =
    type === NotificationType.ACCEPTED_INVITATION ? true : false;
  return (
    <div className=" p-2 rounded-md flex gap-4 items-center">
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
            {formatRelative(new Date(notification.createdAt), new Date())}
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
    <div className=" p-2 rounded-md flex gap-4 items-center">
      <figure className="  border-custom-light-green flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            notification?.invitation?.workspace?.logo ||
            notification?.workspace?.logo
          }
          alt={
            notification?.invitation?.workspace?.name ||
            notification?.workspace?.name
          }
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">{notification.message}</h3>
        <div className="flex justify-between items-center  gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(notification.createdAt), new Date())}
          </p>
        </div>
      </div>
    </div>
  );
};

interface AppointAdminNotificationProps {
  notification: any;
}

const AppointAdminNotification: React.FC<AppointAdminNotificationProps> = ({
  notification,
}) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async (data: any) => {
      const res = await axios.patch(
        `/workspace/${notification.workspaceId}/accept-admin-invitation`,
        data
      );
      return res.data;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries("unread-notifications");
        queryClient.invalidateQueries("workspace-query");
        queryClient.invalidateQueries("notifications");
      },
      onError(error) {},
    }
  );

  return (
    <div className="p-2 rounded-md flex gap-4 items-center">
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
            {formatRelative(new Date(notification.createdAt), new Date())}
          </p>
          <div className="text-sm flex items-center gap-2">
            <button
              onClick={() => {
                mutate({
                  newAdminId: notification.recieverId,
                  adminId: notification.senderId,
                  status: NotificationType.APPOINT_ADMIN_ACCEPTED,
                  notificationId: notification.id,
                });
              }}
              className="bg-green-600 py-2 px-4 text-white rounded-md"
            >
              Accept
            </button>
            <button
              onClick={() => {
                mutate({
                  newAdminId: notification.recieverId,
                  adminId: notification.senderId,
                  status: NotificationType.APPOINT_ADMIN_DECLINED,
                  notificationId: notification.id,
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

interface AdminAppointCreatorProps {
  notification: any;
}
const AdminAppointCreator: React.FC<AdminAppointCreatorProps> = ({
  notification,
}) => {
  return (
    <div className="p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">
          {notification.message.replace(
            "(recieverName)",
            notification?.reciever?.userName
          )}{" "}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(notification.createdAt), new Date())}
          </p>
        </div>
      </div>
    </div>
  );
};

interface NormalNotificationProps {
  notification: any;
}
const NormalNotification: React.FC<NormalNotificationProps> = ({
  notification,
}) => {
  return (
    <div className="p-2 rounded-md flex gap-4 items-center">
      <figure className=" flex-shrink-0 w-14 h-14   rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={notification?.sender?.photo}
          alt={notification?.sender?.userName}
        />
      </figure>
      <div className="flex flex-col gap-1">
        <h3 className="text-base">{notification.message}</h3>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-custom-light-green">
            {formatRelative(new Date(notification.createdAt), new Date())}
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
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async () => {
      const res = await axios.delete(
        `/notification/${userId}/${notification.id}/delete-notification`
      );
      return res.data;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries("notifications");
      },
      onError(error) {},
    }
  );

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
  } else if (type === NotificationType.APPOINT_ADMIN) {
    content = <AppointAdminNotification notification={notification} />;
  } else if (
    type === NotificationType.APPOINT_ADMIN_ACCEPTED ||
    type === NotificationType.APPOINT_ADMIN_DECLINED
  ) {
    content = <AcceptDeclineAdmin type={type} notification={notification} />;
  } else if (type === NotificationType.APPOINT_ADMIN_CREATOR) {
    content = <AdminAppointCreator notification={notification} />;
  } else {
    content = <NormalNotification notification={notification} />;
  }

  return (
    <div className="border-b relative group  border-custom-light-green">
      <div>{content}</div>
      {!(
        type === NotificationType.APPOINT_ADMIN ||
        type === NotificationType.INVITATION
      ) && (
        <div className="absolute right-0 top-2 hidden group-hover:flex">
          <button
            onClick={() => mutate()}
            className="text-gray-400 hover:text-custom-light-green"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

const NotificationModal: React.FC = () => {
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries("unread-notifications");
      },
      onError(error: any) {},
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
      className="fixed  h-[85vh] border-2  flex flex-col gap-3 top-14 right-20 w-[360px] bg-custom-light-dark  border-dark-gray shadow-md rounded-md p-2 pt-4 text-2xl z-50 origin-top-right overflow-y-auto overflow-x-hidden custom-scrollbar"
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
