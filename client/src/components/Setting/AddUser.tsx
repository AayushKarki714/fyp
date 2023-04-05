import { Formik, Field, ErrorMessage, FieldArray, Form } from "formik";
import { useMutation } from "react-query";
import { Role } from "../../redux/slices/workspaceSlice";
import { useAppSelector } from "../../redux/store/hooks";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { addMember } from "../../services/workspace";
import axios from "../../api/axios";

interface AddLancerProps {
  type: "Lancer" | "Client";
  role: Role;
}

const AddUser: React.FC<AddLancerProps> = ({ type, role }) => {
  const {
    user: { id: userId },
  } = useAppSelector((state) => state.auth);
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const { mutate } = useMutation(addMember({ workspaceId, userId }), {
    onSuccess: (data: any) => {
      toast(data?.message);
      console.log("data", data);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  const handleAdd = (values: any) => {
    const { users } = values;
    console.log("users");
    mutate({ addedUsers: users, role });
  };

  return (
    <Formik
      validateOnChange={false}
      validationSchema={Yup.object().shape({
        users: Yup.array().of(
          Yup.string()
            .test(
              "email_async_validation",
              "Email validation Error",
              function (value) {
                return new Promise((resolve, reject) => {
                  axios
                    .get(`/workspace/${workspaceId}/${value}/check-email`)
                    .then((res) => {
                      resolve(true);
                    })
                    .catch((err) => {
                      return resolve(
                        this.createError({
                          message: err?.response?.data?.message,
                        })
                      );
                    });
                });
              }
            )
            .email("Email is not valid ")
            .required("Missing Required Email")
        ),
      })}
      initialValues={{ users: [] }}
      onSubmit={handleAdd}
    >
      {({ values }) => (
        <Form>
          <FieldArray
            name="users"
            render={(arrayHelpers) => (
              <div className="flex flex-col gap-4">
                {values.users && values.users.length > 0 ? (
                  values.users.map((user, index) => (
                    <div key={index} className="flex items-center  gap-2">
                      <div className="flex flex-col items-start gap-1">
                        <Field
                          type="email"
                          className={`bg-[#09090a] rounded px-3 py-2`}
                          name={`users.${index}`}
                          placeholder={`Enter a ${role} Email`}
                        />

                        <ErrorMessage
                          component="div"
                          className="text-xs text-red-600"
                          name={`users.${index}`}
                        />
                      </div>
                      <div className="flex self-start gap-2">
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
                  <button
                    className="bg-custom-light-green px-4 py-2 text-black rounded-md font-medium"
                    type="button"
                    onClick={() => arrayHelpers.push("")}
                  >
                    Add a {role}
                  </button>
                )}
                {values.users.length > 0 && (
                  <div>
                    <button
                      className="bg-custom-light-green text-black px-4 py-2 text-white rounded-md"
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AddUser;
