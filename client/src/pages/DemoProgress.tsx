import React from "react";
import { useQuery } from "react-query";
import axios from "../api/axios";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { useAppSelector } from "../redux/store/hooks";
import { add, differenceInDays, format } from "date-fns";

interface Props {}

function calcProgressToBeMade(
  createdAt: Date,
  completionDate: Date,
  completed: boolean
) {
  if (completed) return 100;
  console.log(
    new Date(),
    add(new Date(), { days: 1 }),
    differenceInDays(add(new Date(), { days: 1 }), new Date())
  );
  console.log({ completionDate, isAvailable: !!completionDate });
  console.log(
    differenceInDays(
      !!completionDate
        ? new Date(completionDate)
        : add(new Date(), { days: 30 }),
      new Date(createdAt)
    )
  );
  const endDate = !!completionDate
    ? new Date(completionDate)
    : add(new Date(createdAt), { days: 30 });

  const diff1 = differenceInDays(
    !!completionDate ? new Date(completionDate) : add(new Date(), { days: 30 }),
    new Date(createdAt)
  );

  const diff2 = differenceInDays(
    !!completionDate ? new Date(completionDate) : add(new Date(), { days: 30 }),
    new Date()
  );
  return Math.round(100 - (diff2 / diff1) * 100);
}

interface ProgressContainerProps {
  title: string;
  workspaceId: string;
  containerId: string;
}

interface ProgressBarProps {
  text: string;
  completionDate: Date;
  completed: boolean;
  createdAt: Date;
}
interface ProgressCardProps {
  containerId: string;
  title: string;
  cardId: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  text,
  completionDate,
  createdAt,
  completed,
}) => {
  let daysLeft;
  let dateClassName = "";
  let dateInDayMonthFormat = "";
  let progressPercent = calcProgressToBeMade(
    createdAt,
    completionDate,
    completed
  );

  if (completionDate) {
    const formattedCompletionDate = new Date(completionDate);
    const formattedCreatedAtDate = new Date(createdAt);
    const monthFormat = format(formattedCompletionDate, "LLL");
    const dayFormat = format(formattedCompletionDate, "dd");

    dateInDayMonthFormat = `${monthFormat} ${dayFormat}`;

    const remainingDays = differenceInDays(
      formattedCompletionDate,
      formattedCreatedAtDate
    );
    daysLeft = `${remainingDays} ${remainingDays > 1 ? "days" : "day"}`;

    if (completed) {
      dateClassName = "bg-green-600";
    } else if (remainingDays >= 15) {
      dateClassName = "bg-blue-600";
    } else if (remainingDays >= 10) {
      dateClassName = "bg-purple-600";
    } else if (remainingDays >= 5) {
      dateClassName = "bg-yellow-600";
    } else if (remainingDays > 0) {
      dateClassName = "bg-orange-600";
    } else {
      dateClassName = "bg-red-600";
    }
  } else {
    daysLeft = null;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl">
        <h3>{text}</h3>
      </div>
      <div>
        <div className="p-1 bg-custom-light-dark rounded-xl">
          <div
            style={{
              width: `${progressPercent}%`,
            }}
            className={`${dateClassName}  h-4 rounded-xl `}
          >
            {progressPercent}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  cardId,
  containerId,
}) => {
  const { data: progressBarData, isLoading } = useQuery(
    ["todo-query", cardId],
    async () => {
      const res = await axios.get(`/todo/${containerId}/${cardId}/todo`);
      return res?.data?.data;
    }
  );

  if (isLoading) return <h1>Loading...</h1>;
  return (
    <div className="flex flex-col">
      {progressBarData.map((progressBar: any) => (
        <ProgressBar
          completed={progressBar.completed}
          completionDate={progressBar.completionDate}
          createdAt={progressBar.createdAt}
          text={progressBar.text}
          key={progressBar.id}
        />
      ))}
    </div>
  );
};

const ProgressContainer: React.FC<ProgressContainerProps> = ({
  containerId,
  title,
  workspaceId,
}) => {
  const { data: progressCardData } = useQuery(
    ["todo-card-query", containerId],
    async () => {
      const res = await axios.get(
        `/todo/${workspaceId}/${containerId}/todo-card`
      );
      return res?.data?.data;
    }
  );
  return (
    <div className="flex flex-col gap-4 border-2 border-custom-light-dark p-3 rounded-md">
      <div className="text-2xl">
        <h2>{title}</h2>
      </div>
      <div className="flex flex-col">
        {progressCardData?.map((progressCard: any) => (
          <ProgressCard
            key={progressCard.id}
            title={progressCard.title}
            cardId={progressCard.id}
            containerId={progressCard.todoContainerId}
          />
        ))}
      </div>
    </div>
  );
};

const DemoProgress: React.FC<Props> = () => {
  const { workspaceId } = useAppSelector((state) => state.workspace);

  const { data: progressContainerData, isLoading } = useQuery(
    "todo-container-query",
    async () => {
      const res = await axios.get(`/todo/${workspaceId}/todo-container`);
      return res.data?.data;
    },
    { enabled: !!workspaceId }
  );

  useNavigateToDashboard();

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div>
      {progressContainerData?.map((progressContainer: any) => (
        <ProgressContainer
          key={progressContainer.id}
          workspaceId={progressContainer.workspaceId}
          containerId={progressContainer.id}
          title={progressContainer.title}
        />
      ))}
    </div>
  );
};

export default DemoProgress;
