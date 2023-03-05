import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAppSelector } from "../redux/store/hooks";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createWorkspace } from "../services/workspace";
import { Formik, FieldArray, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../api/axios";

interface PreviewProps {
  file: File | null;
}
const Preview: React.FC<PreviewProps> = ({ file }) => {
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewImg(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return previewImg ? (
    <img
      src={previewImg}
      className="w-[170px] h-[170px] object-contain"
      alt="workspace img"
    />
  ) : null;
};

interface IButton {
  type?: "submit" | "button" | "reset";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  style?: object;
}

const Button: React.FC<IButton> = ({
  type = "button",
  children,
  onClick,
  disabled = false,
  style = {},
  ...otherProps
}) => {
  return (
    <button
      className="bg-[#8ad85c] text-black px-4 py-1 rounded-md font-medium disabled:cursor-not-allowed disabled:bg-slate-400"
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...style }}
      {...otherProps}
    >
      {children}
    </button>
  );
};

interface IFormItem {
  value: string;
  type: "email" | "text" | "password" | "number";
  placeholder?: string;
  id: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormItem: React.FC<IFormItem> = ({
  value,
  type,
  onChange,
  id,
  name,
  ...otherProps
}) => {
  return (
    <label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        {...otherProps}
        className="bg-[#09090a] rounded px-3 py-2"
      />
    </label>
  );
};

const CreateWorkspace: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const { mutate, isLoading } = useMutation(createWorkspace, {
    onSuccess(data) {
      console.log({ data });
      navigate("/dashboard");
      queryClient.invalidateQueries("unread-notifications");
      toast(`Workspce ${data?.workspace?.name} Created Successfully`);
    },
    onError(error) {
      console.log({ error });
    },
  });

  return (
    <ProtectedRoute>
      <div className="custom-scrollbar h-[90vh] w-full flex flex-col items-center  overflow-y-auto bg-custom-black pb-3 ">
        <h2 className="text-3xl font-medium my-3 ">Create Workspace</h2>
        <Formik
          validateOnChange={false}
          initialValues={{ file: null, name: "", lancers: [""], clients: [""] }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(),
            file: Yup.mixed().required(),
            clients: Yup.array().of(
              Yup.string()
                .test(
                  "clients-email_async_validation",
                  "Client Email Validation Error",
                  function (value) {
                    return new Promise((resolve, reject) => {
                      axios
                        .get(`/auth/${user.id}/${value}/email-exists`)
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
                .email("User is not registered!!")
                .required("Missing Required Fields")
            ),
            lancers: Yup.array().of(
              Yup.string()
                .test(
                  "lancers-email_async_validation",
                  "Lancer Email Validation Error",
                  function (value) {
                    return new Promise((resolve, reject) => {
                      axios
                        .get(`/auth/${user.id}/${value}/email-exists`)
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
                .email("User is not registered!!")
                .required("Missing Required Fields")
            ),
          })}
          onSubmit={(values) => {
            const { name, lancers, clients, file } = values;
            console.log({ name, lancers, clients, file });
            const formData = new FormData();
            formData.append("name", name);
            formData.append("adminId", user.id);
            formData.append("lancerValues", JSON.stringify(lancers));
            formData.append("clientValues", JSON.stringify(clients));
            if (file) {
              formData.append((file as any).name, file);
              mutate(formData);
            }
          }}
        >
          {({ values, handleSubmit, handleChange, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col justify-center mb-4 items-center">
                <label className="w-[200px] h-[200px] bg-[#434343] flex items-center justify-center rounded-md">
                  <input
                    className="w-0 h-0"
                    id="file"
                    name="file"
                    type="file"
                    onChange={(event) => {
                      setFieldValue(
                        "file",
                        (event.currentTarget as any).files[0]
                      );
                    }}
                    accept="image/*"
                  />
                  <ErrorMessage
                    name="file"
                    component="div"
                    className="text-xs text-red-600"
                  />
                  <Preview file={values.file} />
                </label>
                <p className="text-xl mt-2 font-normal">Add Logo</p>
              </div>
              <div className="mb-3 flex flex-col items-center gap-2">
                <label htmlFor="name">Workspace Name</label>
                <div className="flex flex-col gap-1">
                  <FormItem
                    name="name"
                    id="name"
                    type="text"
                    value={values.name}
                    placeholder="pathao..."
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-xs text-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div>
                  <FieldArray
                    name="clients"
                    render={(arrayHelpers) => (
                      <div className="flex flex-col gap-3">
                        {values.clients && values.clients.length > 0
                          ? values.clients.map((client, index) => (
                              <div key={index}>
                                <div className="flex flex-col gap-1">
                                  <Field
                                    name={`clients.${index}`}
                                    placeholder="Enter Client's email..."
                                    type="email"
                                    className="bg-[#09090a] rounded px-3 py-2"
                                  />
                                  <ErrorMessage
                                    component="div"
                                    className="text-xs text-red-600"
                                    name={`clients.${index}`}
                                  />
                                </div>
                              </div>
                            ))
                          : null}
                        <div className="flex gap-3">
                          <Button
                            onClick={() =>
                              arrayHelpers.insert(values.clients.length, "")
                            }
                          >
                            Add
                          </Button>
                          <Button
                            onClick={() =>
                              arrayHelpers.remove(values.clients.length - 1)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div>
                  <FieldArray
                    name="lancers"
                    render={(arrayHelpers) => (
                      <div className="flex flex-col gap-3">
                        {values.lancers && values.lancers.length > 0
                          ? values.lancers.map((lancer, index) => (
                              <div key={index}>
                                <div className="flex flex-col gap-1">
                                  <Field
                                    name={`lancers.${index}`}
                                    placeholder="Enter Lancer's email..."
                                    type="email"
                                    className="bg-[#09090a] rounded px-3 py-2"
                                  />
                                  <ErrorMessage
                                    component="div"
                                    className="text-xs text-red-600"
                                    name={`lancers.${index}`}
                                  />
                                </div>
                              </div>
                            ))
                          : null}
                        <div className="flex gap-3">
                          <Button
                            onClick={() =>
                              arrayHelpers.insert(values.lancers.length, "")
                            }
                          >
                            Add
                          </Button>
                          <Button
                            onClick={() =>
                              arrayHelpers.remove(values.clients.length - 1)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </div>
                {/* <div className="flex flex-col gap-3">
                  {[].map((val: any, index: number) => (
                    <div key={index}>
                      <FormItem
                        id={`email-lancer--${index}`}
                        name={`email-lancer--${index}`}
                        type="email"
                        value={val.email}
                        placeholder="Enter Lancer's email..."
                        onChange={(event) => console.log("ola")}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button>Add</Button>
                    <Button>Remove</Button>
                  </div>
                </div> */}
              </div>

              <div className="text-center mt-10">
                <Button
                  style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
                  type="submit"
                >
                  {isLoading ? "Creating Workspace" : "Create Workspace"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </ProtectedRoute>
  );
};

export default CreateWorkspace;
