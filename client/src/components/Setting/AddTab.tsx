import React from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useMutation } from "react-query";
import { useAppSelector } from "../../redux/store/hooks";
import { addClient, addLancer } from "../../services/workspace";
import { Role } from "../../redux/slices/workspaceSlice";
import axios from "../../api/axios";

interface Props {}

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

  const handleAdd = (values: any) => {
    const { users } = values;
    mutate({ addedUsers: users, role });
  };

  return (
    <Formik
      validateOnChange={false}
      validationSchema={Yup.object().shape({
        users: Yup.array().of(
          Yup.string()
            .test(
              "Email is Allowed",
              "Email is not allowed",
              function (value, { createError }) {
                return new Promise((resolve, reject) => {
                  axios
                    .get(`/workspace/${workspaceId}/${value}/check-email`)
                    .then((res) => {
                      resolve(true);
                    })
                    .catch((err) => {
                      resolve(false);
                      return createError({
                        message: err?.response?.data?.message,
                      });
                    });
                });
              }
            )
            .email("Invalid Email")
            .required("Missing Required Email")
        ),
      })}
      initialValues={{ users: [""] }}
      onSubmit={handleAdd}
    >
      {({ values, touched, handleSubmit, errors }) => (
        <form onSubmit={handleSubmit}>
          <FieldArray
            name="users"
            render={(arrayHelpers) => (
              <div className="flex flex-col gap-4">
                {values.users && values.users.length > 0 ? (
                  values.users.map((user, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <Field
                        type="email"
                        className={`bg-[#09090a] rounded px-3 py-2`}
                        name={`users.${index}`}
                        placeholder={`Enter a ${role} Email`}
                      />
                      <ErrorMessage
                        component="div"
                        className="text-sm text-red-600"
                        name={`users.${index}`}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400"
                          onClick={() => arrayHelpers.insert(index + 1, "")}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <button type="button" onClick={() => arrayHelpers.push("")}>
                    Add a {role}
                  </button>
                )}
                {values.users[0] ? (
                  <div>
                    <button type="submit">Submit</button>
                  </div>
                ) : null}
              </div>
            )}
          />
        </form>
      )}
      {/* {(formik) => (
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
            // disabled={formik.values.users ? false : true}
            type="submit"
            className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Add {type}
          </button>
        </form>
      )} */}
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
