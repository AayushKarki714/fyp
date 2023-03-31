import { useQuery } from "react-query";
import { useSystemAdmin } from "../../context/AdminContext";
import systemAxios from "../../api/systemAxios";
import Spinner from "../Spinner/Spinner";
import WorkspaceSearchResultsItem from "./WorkspaceSearchResultsItem";
import { AnimatePresence } from "framer-motion";

function WorkspaceSearchResults({ searchTerm, filterMode }: any) {
  const { admin } = useSystemAdmin();

  const { data: results, isLoading } = useQuery(
    `workspace-search-results-${searchTerm}`,
    async () => {
      const res = await systemAxios.get(
        `/system-admin/${searchTerm}/${filterMode}`,
        {
          headers: {
            authorization: `Bearer ${(admin as any).token}`,
          },
        }
      );
      return res.data?.data;
    },
    {
      enabled: Boolean(searchTerm),
    }
  );

  if (isLoading) return <Spinner isLoading={isLoading} />;
  console.log({ results });

  return (
    <ul className="flex flex-col gap-4 mt-6">
      {results && Boolean(searchTerm) && results?.length === 0 && (
        <h2 className="text-red-600 ">No Search Results for {searchTerm}</h2>
      )}

      <AnimatePresence>
        {results?.map(
          ({ logo, id, name, admin: { email, photo, userName } }: any) => (
            <WorkspaceSearchResultsItem
              key={id}
              name={name}
              logo={logo}
              adminEmail={email}
              workspaceId={id}
              adminPhoto={photo}
              adminUsername={userName}
            />
          )
        )}
      </AnimatePresence>
    </ul>
  );
}

export default WorkspaceSearchResults;
