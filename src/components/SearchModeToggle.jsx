import { useStore } from '../store/useStore';

export default function SearchModeToggle() {
  const { searchMode, setSearchMode } = useStore();

  return (
    <div className="mb-6">
      <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-1">
        <button
          onClick={() => setSearchMode('property')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
            searchMode === 'property'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Search by Property
        </button>
        <button
          onClick={() => setSearchMode('salary')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
            searchMode === 'salary'
              ? 'bg-white/15 text-white shadow-sm'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          Search by Salary
        </button>
      </div>
    </div>
  );
}
