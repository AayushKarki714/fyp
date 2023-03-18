import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import systemAxios from "../../api/systemAxios";
import Spinner from "../Spinner/Spinner";
import { motion } from "framer-motion";
import { useSystemAdmin } from "../../context/AdminContext";

function DeRegisterCard({ email, userName, id, photo, index }: any) {
  const { admin } = useSystemAdmin();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${id}/deregister-user`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("user-analytics");
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.3 }}
      className="flex  text-center flex-col bg-custom-light-dark  rounded-md gap-5 p-6 hover:-translate-y-2 transition-all duration-200  cursor-pointer hover:shadow-lg"
    >
      <figure>
        <img referrerPolicy="no-referrer" src={photo} alt={userName} />
      </figure>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl text-custom-light-green">{userName}</h2>
        <p>{email}</p>
      </div>
      <div>
        <button
          onClick={() => mutate()}
          className="bg-red-500 px-4 py-3 text-white rounded-md"
        >
          De-Register
        </button>
      </div>
    </motion.div>
  );
}

function UserAnalytics() {
  const { admin } = useSystemAdmin();
  const { data, isLoading } = useQuery("user-analytics", async () => {
    const res = await systemAxios.get("/system-admin/all/users", {
      headers: { authorization: `Bearer ${(admin as any).token}` },
    });
    return res.data?.data;
  });

  if (isLoading) return <Spinner isLoading={isLoading} />;

  return (
    <div className="grid grid-cols-responsive-todo gap-6">
      {data?.map((user: any, index: number) => (
        <AnimatePresence key={user.id}>
          <DeRegisterCard
            index={index}
            email={user.email}
            userName={user.userName}
            photo={user.photo}
            id={user.id}
          />
        </AnimatePresence>
      ))}
    </div>
  );
}

export default UserAnalytics;
