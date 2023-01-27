import React from "react";
import cogoToast from "cogo-toast";
import { Formik } from "formik";
import { CreateTodoProps } from "../../types/types";

const validateValues = (values: any) => {
  const errors: Record<string, string> = {};
  if (!values.title) {
    errors.title = "Missing Required Field *";
  }
  return errors;
};

const CreateTodo: React.FC<CreateTodoProps> = ({ onSubmit }) => {
  const handleSubmit = ({ title }: any) => {
    console.log("title", title);
    if (!title) cogoToast.error("Please Fill the Required Fields");
    onSubmit({ title });
  };

  return (
    <Formik
      initialValues={{ title: "" }}
      validate={validateValues}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-96 rounded-md"
        >
          <label htmlFor="gallerytitle">Todo Title:</label>
          {formik.errors.title ? (
            <p className="text-red-600 text-xs">{formik.errors.title}</p>
          ) : null}
          <input
            id="todoContainerTitle"
            type="text"
            placeholder="Enter a todo title..."
            className="bg-[#09090a] rounded text-base p-2"
            {...formik.getFieldProps("title")}
          />
          <button
            type="submit"
            className="bg-custom-light-green px-4 py-2 rounded-md text-base text-custom-black font-bold"
          >
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
};

export default CreateTodo;
