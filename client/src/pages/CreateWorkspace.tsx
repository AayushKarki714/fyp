import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAppSelector } from "../redux/store/hooks";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createWorkspace } from "../services/workspace";

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
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormItem: React.FC<IFormItem> = ({
  value,
  type,
  onChange,
  ...otherProps
}) => {
  return (
    <label>
      <input
        type={type}
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
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [lancerValues, setLancerValues] = useState([{ email: "" }]);
  const [clientValues, setClientValues] = useState([{ email: "" }]);
  const [selectedFile, setSelectedFile] = useState<null | File>(null);

  const { mutate, isLoading } = useMutation(createWorkspace, {
    onSuccess: (data) => {
      navigate("/dashboard");
      queryClient.invalidateQueries("unread-notifications");
      toast(`Workspace ${data?.workspace?.name} Created SucessFully`);
    },
    onError: (error: any) => {
      toast(error?.response?.data?.message || error.message);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    if (!file) return;
    setSelectedFile(file);
  };

  const addLancerField = () => {
    setLancerValues([...lancerValues, { email: "" }]);
  };

  const removeLancerField = () => {
    if (lancerValues.length === 1) return;
    setLancerValues(lancerValues.slice(0, -1));
  };

  const removeClientField = () => {
    if (clientValues.length === 1) return;
    setClientValues(clientValues.slice(0, -1));
  };

  const addClientField = () => {
    setClientValues([...clientValues, { email: "" }]);
  };

  const handleClientInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...clientValues];
    data[index]["email"] = event.target.value;
    setClientValues(data);
  };

  const handleLancerInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...lancerValues];
    data[index]["email"] = event.target.value;
    setLancerValues(data);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    let isValid = true;
    if (!selectedFile) return toast("Please Select a Logo");
    if (!title) return toast("Please Enter a title");

    const clientMap: Record<string, string> = {};

    clientValues.forEach((client) => {
      if (!client.email) {
        isValid = false;
        return toast("Please Fill a Client Email");
      } else if (!clientMap[client.email]) {
        clientMap[client.email] = client.email;
      } else {
        isValid = false;
        return toast("Duplicate Client Email Encountered");
      }
    });

    if (!isValid) return;

    const lancerMap: Record<string, string> = {};
    lancerValues.forEach((lancer) => {
      if (!lancer.email) {
        isValid = false;
        return toast("Please Fill a Lancer Email");
      } else if (!lancerMap[lancer.email] && !clientMap[lancer.email]) {
        lancerMap[lancer.email] = lancer.email;
      } else {
        isValid = false;
        return toast("Duplicate Email Encountered in Lancers Fields");
      }
    });
    formData.append(selectedFile.name, selectedFile);
    formData.append("name", title);
    formData.append("adminId", user.id);
    formData.append("lancerValues", JSON.stringify(lancerValues));
    formData.append("clientValues", JSON.stringify(clientValues)); // const payload = {
    if (isValid) mutate(formData);
  };

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <ProtectedRoute>
      <div className="custom-scrollbar h-[90vh] w-full flex flex-col items-center  overflow-y-auto bg-custom-black ">
        <h2 className="text-3xl font-medium my-3 ">Create Workspace</h2>

        <form onSubmit={handleFormSubmit}>
          <div className="flex flex-col justify-center mb-4 items-center">
            <label className="w-[200px] h-[200px] bg-[#434343] flex items-center justify-center rounded-md">
              <input
                className="w-0 h-0"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {preview && (
                <img
                  src={preview}
                  className="w-[170px] h-[170px] object-contain"
                  alt="workspace img"
                />
              )}
            </label>
            <p className="text-xl mt-2 font-normal">Add Logo</p>
          </div>

          <div className="mb-3 flex flex-col items-center gap-2">
            <label>Workspace Name</label>
            <FormItem
              type="text"
              value={title}
              placeholder="pathao..."
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {clientValues.map((val: any, index: number) => (
                <div key={index}>
                  <label>
                    <FormItem
                      type="email"
                      value={val.email}
                      placeholder="Enter Client's email..."
                      onChange={(event) =>
                        handleClientInputChange(event, index)
                      }
                    />
                  </label>
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={addClientField}>Add</Button>
                <Button onClick={removeClientField}>Remove</Button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {lancerValues.map((val: any, index: number) => (
                <div key={index}>
                  <FormItem
                    type="email"
                    value={val.email}
                    placeholder="Enter Lancer's email..."
                    onChange={(event) => handleLancerInputChange(event, index)}
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={addLancerField}>Add</Button>
                <Button onClick={removeLancerField}>Remove</Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Button
              disabled={isLoading}
              style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
              type="submit"
            >
              {isLoading ? "Creating Workspace..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CreateWorkspace;
