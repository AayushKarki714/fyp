import React, { useState } from "react";
import { toast } from "react-toastify";

interface FormItemProps {
  id: string;
  type: "text" | "number";
  label: string;
  placeholder: string;
  value: any;
  onChange: (event: any) => void;
}

const FormItem: React.FC<FormItemProps> = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-[#09090a] rounded px-3 py-2 focus:outline-none"
      />
    </div>
  );
};

interface Props {
  onSubmit: (data: any) => void;
}

const ProgressModal = ({ onSubmit }: Props) => {
  const [progressTitle, setProgressTitle] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<string>("");

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!progressTitle || !progressPercent)
      return toast("Please Fill all the Required Fields");

    if (!Number(progressPercent))
      return toast("Progress Percent is not in the Current Format");

    const payload = { title: progressTitle, progressPercent };
    onSubmit(payload);
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
        value={progressTitle}
        onChange={(event) => setProgressTitle(event.target.value)}
        placeholder="Enter a title"
      />
      <FormItem
        id="progess-bar-percentage"
        type="number"
        label="Percentage"
        value={progressPercent}
        onChange={(event) => setProgressPercent(event.target.value)}
        placeholder="Enter a percent"
      />
      <button className="px-6 py-2  bg-custom-light-green rounded-md text-black font-medium">
        Submit
      </button>
    </form>
  );
};

export default ProgressModal;
