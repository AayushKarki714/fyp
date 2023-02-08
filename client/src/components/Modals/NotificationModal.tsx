import React, { useEffect } from "react";
import axios from "../../api/axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { motion } from "framer-motion";
import handleStopPropagation from "../../utils/handleStopPropagation";
import { useAppSelector } from "../../redux/store/hooks";

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

  const notificationsQuery = useQuery(
    `notification-${userId}-query`,
    async () => {
      const res = await axios.get(`/notification/${userId}/get-notifications`);
      return res.data;
    }
  );

  useEffect(() => {
    markNotificationReadMutation.mutate();
  }, []);

  if (notificationsQuery.isLoading) {
    return <h1>Loading....</h1>;
  }

  const notificationsData = notificationsQuery.data?.data;
  console.log(notificationsData);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleStopPropagation}
      className="fixed h-[85vh] top-14 right-20 w-[360px] bg-custom-light-dark border-2 border-dark-gray shadow-md rounded-md p-2 text-2xl z-50 origin-top-right"
    >
      <h2>Notifications</h2>
    </motion.div>
  );
};

export default NotificationModal;
