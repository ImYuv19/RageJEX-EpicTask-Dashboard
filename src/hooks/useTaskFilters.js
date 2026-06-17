import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext.jsx";

export function useTaskFilters(tasks) {
  const { search, setSearch } = useAppData();
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        const matchesSearch =
          !normalizedSearch ||
          task.title.toLowerCase().includes(normalizedSearch) ||
          task.assignee.toLowerCase().includes(normalizedSearch);
        const matchesStatus = status === "All" || task.status === status;
        const matchesPriority = priority === "All" || task.priority === priority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === "risk") return Number(b.delayDays) - Number(a.delayDays);
        if (sortBy === "duration") return Number(b.duration) - Number(a.duration);
        if (sortBy === "priority") {
          const rank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return rank[b.priority] - rank[a.priority];
        }

        return new Date(a.deadline) - new Date(b.deadline);
      });
  }, [priority, search, sortBy, status, tasks]);

  return {
    filteredTasks,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    sortBy,
    setSortBy,
  };
}
