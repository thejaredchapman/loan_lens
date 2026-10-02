import { useStore } from '../store/useStore';

const MODES = [
  { id: 'property', label: 'I have a price in mind' },
  { id: 'salary', label: 'I know my salary' },
];

export default function SearchModeToggle() {
  const { searchMode, setSearchMode } = useStore();

  return (
    <div className="mb-6 flex flex-wrap gap-x-8 gap-y-2 border-b border-rule rise" style={{ '--i': 1 }} role="tablist">
      {MODES.map((m) => {
        const active = searchMode === m.id;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            onClick={() => setSearchMode(m.id)}
            className={`display text-xl pb-2 -mb-px cursor-pointer border-b-[3px] transition-colors ${
              active ? 'border-[var(--accent)] text-ink font-semibold' : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
