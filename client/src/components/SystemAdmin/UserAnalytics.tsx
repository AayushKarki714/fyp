import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "react-query";
import systemAxios from "../../api/systemAxios";
import Spinner from "../Spinner/Spinner";
import { motion, Variants } from "framer-motion";
import { useSystemAdmin } from "../../context/AdminContext";

const variants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: "100%",
  },
  animate: {
    opacity: 0,
    y: "100%",
    transition: {
      duration: 0.4,
      type: "tween",
    },
  },
};

function DeRegisterCard({ email, userName, id, photo }: any) {
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
    <motion.div className="flex  bg-custom-light-dark items-center  rounded-md gap-3 p-3 hover:-translate-y-2 transition-all duration-200  cursor-pointer hover:shadow-lg">
      <figure className="w-16 h-16 flex-shrink-0  rounded-full overflow-hidden">
        <img referrerPolicy="no-referrer" src={photo} alt={userName} />
      </figure>
      <div className="flex flex-col gap-1">
        <h2 className="text-lg text-custom-light-green">{userName}</h2>
        <p className="text-sm">{email}</p>
        <button
          onClick={() => mutate()}
          className="bg-red-600 text-sm mt-2 self-start  px-3 py-1 flex items-center justify-center text-white rounded-md"
        >
          Delete
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
