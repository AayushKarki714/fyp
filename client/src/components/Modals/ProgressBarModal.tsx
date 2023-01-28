import React, { useState } from "react";
import { toast } from "react-toastify";

interface FormItemProps {
  id: string;
  type: "text" | "number";
  label: string;
  placeholder: string;
  value: any;
  onChange?: (event: any) => void;
}

const FormItem: React.FC<FormItemProps> = ({
  id,
  type,
  label,
  placeholder,
  value,
  onChange = () => {},
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
  title: string;
  percent: number;
  prevPercent: number;
  onSubmit: (progressPercent: number) => void;
}

const ProgressBarModal = ({ title, percent, prevPercent, onSubmit }: Props) => {
  const [progressPercent, setProgressPercent] = useState<string>(
    String(percent)
  );

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (prevPercent >= Number(progressPercent))
      return toast("Percent can't go from high to low!!");
    onSubmit(Number(progressPercent));
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
        value={title}
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
      <button className="px-6 py-2 bg-custom-light-green rounded-md text-black font-medium">
        Submit
      </button>
    </form>
  );
};

export default ProgressBarModal;
