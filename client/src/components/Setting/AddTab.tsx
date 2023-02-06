import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { useMutation } from "react-query";
import { useAppSelector } from "../../redux/store/hooks";
import { addClient, addLancer } from "../../services/workspace";
import { Role } from "../../redux/slices/workspaceSlice";

interface Props {}

const convertEmailTextIntoArray = (data: string) => {
  return data.trim().replace(/,\s+/g, " ").split(" ");
};

interface p {
  userId: string;
  workspaceId: string;
}

interface AddLancerProps {
  type: "Lancer" | "Client";
  role: Role;
  mutationFn: ({ userId, workspaceId }: p) => (data?: any) => Promise<any>;
}

const AddUser: React.FC<AddLancerProps> = ({ mutationFn, type, role }) => {
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const { mutate } = useMutation(mutationFn({ workspaceId, userId }), {
    onSuccess: (data: any) => {
      console.log("data", data);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  const handleAdd = (values: any, { resetForm }: any) => {
    const { users } = values;
    const usersArrayForm = convertEmailTextIntoArray(users);
    mutate({ addedUsers: usersArrayForm, role });
    resetForm({ values: "" });
  };

  return (
    <Formik
      initialValues={{ users: "" }}
      validationSchema={Yup.object({
        lancer: Yup.array()
          .transform((value, originalValue) => {
            return convertEmailTextIntoArray(originalValue);
          })
          .of(
            Yup.string()
              .email(({ value }) => `${value} is not a valid Email Address`)
              .required()
          ),
      })}
      onSubmit={handleAdd}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          {formik.touched.users && formik.errors.users && (
            <p>{formik.errors.users}</p>
          )}
          <input
            type="text"
            className="bg-[#09090a] rounded px-3 py-2"
            placeholder={`Enter a ${type} Email`}
            {...formik.getFieldProps("users")}
          />
          <button
            disabled={formik.values.users ? false : true}
            type="submit"
            className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Add {type}
          </button>
        </form>
      )}
    </Formik>
  );
};

const AddTab: React.FC<Props> = () => {
  return (
    <div className="text-base flex gap-12">
      <AddUser role={Role.LANCER} type="Lancer" mutationFn={addLancer} />
      <AddUser role={Role.CLIENT} type="Client" mutationFn={addClient} />
    </div>
  );
};

export default AddTab;
