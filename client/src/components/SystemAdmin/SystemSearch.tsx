import React, { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import WorkspaceSearchResults from "./WorkspaceSearchResults";
import UserSearchResults from "./UserSearchResults";

function SearchBox({ value, onChange }: any) {
  return (
    <div className="flex flex-row gap-3">
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
    </div>
  );
}

const filterModeValues = ["workspace-search", "user-search"];

function SystemSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [filterMode, setFilterMode] = useState(filterModeValues[1]);

  return (
    <div>
      <div className="flex border-[2px] border-custom-light-dark p-4 rounded-md justify-between items-center">
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
          className="bg-[#09090a] rounded px-3 py-2 text-base text-gray-400 outline-none focus:outline-none"
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
          searchTerm={debouncedSearchTerm}
        />
      )}
      {filterMode === filterModeValues[1] && (
        <UserSearchResults
          filterMode={filterMode}
          searchTerm={debouncedSearchTerm}
        />
      )}
    </div>
  );
}

export default SystemSearch;
