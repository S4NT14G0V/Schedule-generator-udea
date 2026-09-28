import { memo } from "react";

function QuickFilterTabsComponent({
  quickFilter,
  onQuickFilterChange,
  selectedCount = 0,
  hasAdvancedFilters = false,
  onResetAdvancedFilters,
}) {
  const tabs = [
    { id: "all", label: "Todas" },
    { id: "available", label: "Disponibles" },
    { id: "selected", label: `Seleccionadas (${selectedCount})` },
  ];

  return (
    <div className="flex items-center justify-between gap-1 flex-shrink-0 pt-0.5 select-none">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive = quickFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onQuickFilterChange(tab.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                isActive
                  ? "bg-primary text-white"
                  : "border border-zinc-200/80 dark:border-zinc-800 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {hasAdvancedFilters && (
        <button
          type="button"
          onClick={onResetAdvancedFilters}
          className="text-[11px] rounded-md px-2 py-1 text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer"
          title="Quitar filtros avanzados"
        >
          Quitar filtro
        </button>
      )}
    </div>
  );
}

export const QuickFilterTabs = memo(QuickFilterTabsComponent);
export default QuickFilterTabs;
