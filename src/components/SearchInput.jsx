export function SearchInput({ searchKey, setSearchKey }) {
  return (
    <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-xl shadow-sm">
      <input
        type="text"
        placeholder="Search..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        className="flex-1 bg-transparent outline-none text-white placeholder-white/60"
      />
      <button className="text-sm px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
        Search
      </button>
    </div>
  );
}
