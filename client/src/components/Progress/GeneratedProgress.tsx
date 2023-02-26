import React from "react";
import { useQuery } from "react-query";
import { add, differenceInDays } from "date-fns";
import axios from "../../api/axios";
import { useAppSelector } from "../../redux/store/hooks";
import useNavigateToDashboard from "../../hooks/useNavigateToDashboard";

interface Props {}

function calcProgressToBeMade(
  createdAt: Date,
  completionDate: Date | null,
  completed: boolean
) {
  let endDate;
  let leftDuration;
  let totalDuration;
  let currentDate = new Date();
  let startDate = new Date(createdAt);
  leftDuration = differenceInDays(currentDate, new Date(startDate)) || 1;

  if (completed) {
    return 100;
  } else if (!completionDate) {
    endDate = add(new Date(createdAt), { days: 30 });
    totalDuration = differenceInDays(new Date(endDate), new Date(startDate));
    return Math.round((leftDuration / totalDuration) * 100);
  }
  endDate = new Date(completionDate);
  totalDuration = differenceInDays(endDate, startDate);
  return Math.round((leftDuration / totalDuration) * 100) > 100
    ? 100
    : Math.round((leftDuration / totalDuration) * 100);
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
  let progressPercent = calcProgressToBeMade(
    createdAt,
    completionDate,
    completed
  );

  let dateClassName = "";
  if (completionDate) {
    const formattedCompletionDate = new Date(completionDate);
    const formattedCreatedAtDate = new Date(createdAt);
    const remainingDays = differenceInDays(
      formattedCompletionDate,
      formattedCreatedAtDate
    );

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
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="text-base">
        <h3>{text}</h3>
      </div>
      <div>
        <div
          className="p-1 bg-custom-light-dark rounded-xl"
          title={`${progressPercent}%`}
        >
          <div
            style={{ width: `${progressPercent}%` }}
            className={`${dateClassName || "bg-violet-800"} h-4 rounded-xl `}
          ></div>
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
    <div className="flex flex-col border-2 border-dark-gray rounded-md p-3 gap-2 ">
      <div>
        <h2 className="text-2xl">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">
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
      <div className="grid grid-cols-responsive-todo gap-3">
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

const GeneratedProgress: React.FC<Props> = () => {
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
    <div className="flex flex-col gap-3 mt-3">
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

export default GeneratedProgress;
