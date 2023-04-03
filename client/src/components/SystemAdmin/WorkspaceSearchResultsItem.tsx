import { useMutation, useQueryClient } from "react-query";
import { useSystemAdmin } from "../../context/AdminContext";
import systemAxios from "../../api/systemAxios";

export default function WorkspaceSearchResultsItem({
  logo,
  name,
  workspaceId,
  adminEmail,
  adminPhoto,
  adminUsername,
  searchTerm,
}: any) {
  const queryClient = useQueryClient();
  const { admin } = useSystemAdmin();
  const { mutate: deleteWorkspace } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${workspaceId}/delete-workspace`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        console.log({ data, hel: "this is from inside onSuccess" });
        queryClient.invalidateQueries(`workspace-search-results-${searchTerm}`);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <li className="flex px-6 py-3  flex-row  gap-4 shadow-md rounded-md border-[2px] border-custom-light-dark hover:-translate-y-2 transition-all duration-200 cursor-pointer">
      <div className="h-20 self-center w-20 rounded-full overflow-hidden border-[2px] border-custom-light-green">
        <img src={logo} alt={name} className="w-full h-full  " />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-1">
          <span>Workspace :</span>
          <span className="text-custom-light-green">{name}</span>
        </h2>
        <div className="flex flex-row gap-2">
          <figure className="w-10 h-10 self-center overflow-hidden rounded-full">
            <img
              className="w-full h-full object-cover"
              src={adminPhoto}
              referrerPolicy="no-referrer"
              alt={`${adminUsername}`}
              title={`${adminUsername}`}
            />
          </figure>
          <p className="flex flex-col gap-1">
            <span>{adminUsername}</span>
            <span className="text-gray-400">{adminEmail}</span>
          </p>
        </div>
        <button
          onClick={() => deleteWorkspace()}
          className="bg-red-600 text-white px-4 py-2 text-sm  rounded-md self-start"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
