import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import systemAxios from "../../api/systemAxios";
import { useSystemAdmin } from "../../context/AdminContext";
import Spinner from "../Spinner/Spinner";

function SearchBox({ value, onChange }: any) {
  return (
    <form className="flex flex-row gap-3">
      <input
        placeholder="Enter a Search Term"
        type="text"
        value={value}
        onChange={onChange}
        className="bg-[#09090a] rounded px-3 py-2"
      />
      <button className="px-6 py-2 bg-custom-light-green text-black font-medium rounded-md ">
        Search
      </button>
    </form>
  );
}

function WorkspaceSearchResultsItem({
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
        queryClient.invalidateQueries(`workspace-search-results-${searchTerm}`);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <li className="flex px-6 py-3  flex-row  gap-4 shadow-md rounded-md border-[2px] border-custom-light-dark">
      <div className="h-20 self-center w-20 rounded-full overflow-hidden border-[2px] border-custom-light-green">
        <img src={logo} alt={name} className="w-full h-full  " />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="flex items-center gap-1">
          <span>Workspace:</span>
          <span>{name}</span>
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
            <span>{adminEmail}</span>
          </p>
        </div>
        <button
          onClick={() => deleteWorkspace()}
          className="bg-red-600 text-white px-6 py-3 rounded-md"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function UserSearchResultsItem({
  userId,
  photo,
  userName,
  email,
  searchTerm,
}: any) {
  const { admin } = useSystemAdmin();
  const queryClient = useQueryClient();
  const { mutate: deleteUser } = useMutation(
    async () => {
      const res = await systemAxios.delete(
        `/system-admin/${userId}/deregister-user`,
        { headers: { authorization: `Bearer ${(admin as any).token}` } }
      );
      return res.data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(`user-search-results-${searchTerm}`);
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );
  return (
    <div className="flex flex-row gap-4 px-6 rounded-md py-3 border-[2px] border-custom-light-dark">
      <figure className="self-center w-14 h-14 rounded-full overflow-hidden">
        <img
          alt={userName}
          src={photo}
          className="w-full h-full object-cover"
        />
      </figure>
      <div>
        <h2 className="flex flex-col  gap-1 mb-3">
          <span className="text-2xl text-custom-light-green">{userName}</span>
          <span className="text-lg text-gray-400">{email}</span>
        </h2>
        <button
          onClick={() => deleteUser()}
          className="bg-red-600 text-white px-6 py-2 rounded-md self-center"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function UserSearchResults({ searchTerm, filterMode }: any) {
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

  console.log({ results });
  return (
    <ul className="flex flex-col gap-4 mt-6">
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
    </ul>
  );
}

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

  return (
    <ul className="flex flex-col gap-4 mt-6">
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
    </ul>
  );
}

const filterModeValues = ["workspace-search", "user-search"];

function SystemSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState(filterModeValues[1]);

  return (
    <div>
      <div className="flex justify-between items-center">
        <SearchBox
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e?.target.value)
          }
        />
        <select
          value={filterMode}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            setFilterMode(event.target.value)
          }
          className="bg-[#09090a] rounded px-3 py-2 text-base"
        >
          <option value={filterModeValues[0]}>{filterModeValues[0]}</option>
          <option value={filterModeValues[1]}>{filterModeValues[1]}</option>
        </select>
      </div>
      {Boolean(searchTerm) && (
        <p className="text-custom-light-green mt-5">Search for {searchTerm}</p>
      )}
      {filterMode === filterModeValues[0] && (
        <WorkspaceSearchResults
          filterMode={filterMode}
          searchTerm={searchTerm}
        />
      )}
      {filterMode === filterModeValues[1] && (
        <UserSearchResults filterMode={filterMode} searchTerm={searchTerm} />
      )}
    </div>
  );
}

export default SystemSearch;
