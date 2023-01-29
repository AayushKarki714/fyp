import { Formik } from "formik";

interface Props {
  onUpdate: (data: any) => void;
  name: string;
}

const validateValues = (values: any) => {
  const errors: Record<string, string> = {};
  if (!values.name) {
    errors.name = "Missing Required Field *";
  }
  return errors;
};

function UpdateWorkspaceModal({ name, onUpdate }: Props) {
  const onSubmit = (values: any) => {
    onUpdate({ name: values.name });
  };

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={{ name }}
      validate={validateValues}
    >
      {(formik) => (
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-96 rounded-md"
        >
          <label htmlFor="gallerytitle">Workspace Name:</label>
          {formik.errors.name ? (
            <p className="text-red-600 text-xs">{formik.errors.name}</p>
          ) : null}
          <input
            id="workspace-name"
            type="text"
            placeholder="Enter a Workspace  name..."
            className="bg-[#09090a] rounded text-base p-2"
            {...formik.getFieldProps("name")}
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
}

export default UpdateWorkspaceModal;
