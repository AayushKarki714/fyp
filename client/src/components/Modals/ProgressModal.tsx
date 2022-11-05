import React from "react";

interface FormItemProps {
  id: string;
  type: "text" | "number";
  label: string;
  placeholder: string;
}

const FormItem: React.FC<FormItemProps> = ({
  id,
  type,
  label,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="bg-[#09090a] rounded px-3 py-2 focus:outline-none"
      />
    </div>
  );
};

const ProgressModal = () => {
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="w-96 rounded-md select-none flex flex-col gap-4"
    >
      <FormItem
        id="progess-bar-name"
        type="text"
        label="Title"
        placeholder="Enter a title"
      />
      <FormItem
        id="progess-bar-percentage"
        type="number"
        label="Percentage"
        placeholder="Enter a percent"
      />
      <button className="px-6 py-2 bg-custom-light-green rounded-md text-black font-medium">
        Submit
      </button>
    </form>
  );
};

export default ProgressModal;
