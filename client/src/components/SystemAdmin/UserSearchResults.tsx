import { useQuery } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";
import UserSearchResultsItem from "./UserSearchResultsItem";
import { AnimatePresence } from "framer-motion";

export default function UserSearchResults({ searchTerm, filterMode }: any) {
  const { admin } = useSystemAdmin();

  const { data: results, isLoading } = useQuery(
    `user-search-results-${searchTerm}`,
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

  return (
    <ul className="flex flex-col gap-4 mt-6">
      {results && Boolean(searchTerm) && results?.length === 0 && (
        <h2 className="text-red-600 ">No Search Results for {searchTerm}</h2>
      )}
      <AnimatePresence>
        {results?.map(({ email, id, photo, userName }: any) => (
          <UserSearchResultsItem
            key={id}
            userName={userName}
            photo={photo}
            searchTerm={searchTerm}
            email={email}
            userId={id}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
