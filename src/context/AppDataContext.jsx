import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  createId,
  initializeStorage,
  readStorage,
  resetDemoCollections,
  STORAGE_KEYS,
} from "../services/storageService.js";
import { validateProjectTemplate } from "../utils/validators.js";
import {
  getLowestWorkloadMember,
  getMembersWithWorkload,
  rebuildMemberAssignments,
} from "../utils/workload.js";

const AppDataContext = createContext(null);

function normalizeMilestones(value) {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBlockedBy(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return [value];
}

export function AppDataProvider({ children }) {
  useState(() => {
    initializeStorage();
    return true;
  });

  const [projects, setProjects] = useLocalStorage(STORAGE_KEYS.projects, []);
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEYS.tasks, []);
  const [members, setMembers] = useLocalStorage(STORAGE_KEYS.members, []);
  const [notifications, setNotifications] = useLocalStorage(
    STORAGE_KEYS.notifications,
    []
  );
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, {
    past: [],
    current: null,
    future: [],
    timeline: [],
  });
  const [activities, setActivities] = useLocalStorage(STORAGE_KEYS.activities, []);
  const [toasts, setToasts] = useState([]);
  const [search, setSearch] = useState("");

  const membersWithWorkload = useMemo(
    () => getMembersWithWorkload(members, tasks),
    [members, tasks]
  );

  const suggestedAssignee = useMemo(
    () => getLowestWorkloadMember(members, tasks),
    [members, tasks]
  );

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId)
    );
  }, []);

  const pushToast = useCallback((payload) => {
    const toast = {
      id: createId("toast"),
      type: payload.type || "info",
      message: payload.message,
      timestamp: new Date().toISOString(),
    };

    setToasts((currentToasts) => [toast, ...currentToasts].slice(0, 4));
  }, []);

  const addActivity = useCallback(
    (label, detail) => {
      const activity = {
        id: createId("activity"),
        label,
        detail,
        timestamp: new Date().toISOString(),
      };

      setActivities((currentActivities) =>
        [activity, ...currentActivities].slice(0, 50)
      );
    },
    [setActivities]
  );

  const enqueueNotification = useCallback(
    ({ type = "info", message }) => {
      const notification = {
        id: createId("notification"),
        type,
        message,
        timestamp: new Date().toISOString(),
        status: "queued",
      };

      setNotifications((currentNotifications) => [
        ...currentNotifications,
        notification,
      ]);
      pushToast(notification);
      return notification;
    },
    [pushToast, setNotifications]
  );

  const createProject = useCallback(
    (payload) => {
      const project = {
        id: createId("project"),
        name: payload.name.trim(),
        description: payload.description?.trim() || "",
        owner: payload.owner.trim(),
        milestones: normalizeMilestones(payload.milestones),
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: payload.status || "Planning",
        templateType: payload.templateType || "Standard",
      };
      const templateResult = validateProjectTemplate(project);

      if (!templateResult.approved) {
        enqueueNotification({
          type: "warning",
          message: `${project.name || "Project"} template was rejected.`,
        });
        return { ok: false, errors: templateResult.messages };
      }

      setProjects((currentProjects) => [project, ...currentProjects]);
      addActivity("Project Created", `${project.name} was created.`);
      enqueueNotification({
        type: "success",
        message: `${project.name} template approved and project created.`,
      });
      return { ok: true, project };
    },
    [addActivity, enqueueNotification, setProjects]
  );

  const updateProject = useCallback(
    (projectId, payload) => {
      const project = {
        ...payload,
        id: projectId,
        name: payload.name.trim(),
        description: payload.description?.trim() || "",
        owner: payload.owner.trim(),
        milestones: normalizeMilestones(payload.milestones),
      };
      const templateResult = validateProjectTemplate(project);

      if (!templateResult.approved) {
        return { ok: false, errors: templateResult.messages };
      }

      setProjects((currentProjects) =>
        currentProjects.map((item) => (item.id === projectId ? project : item))
      );
      addActivity("Project Updated", `${project.name} details were updated.`);
      enqueueNotification({
        type: "info",
        message: `${project.name} project details updated.`,
      });
      return { ok: true, project };
    },
    [addActivity, enqueueNotification, setProjects]
  );

  const deleteProject = useCallback(
    (projectId) => {
      const project = projects.find((item) => item.id === projectId);
      const remainingTasks = tasks
        .filter((task) => task.projectId !== projectId)
        .map((task) => ({
          ...task,
          blockedBy: (task.blockedBy || []).filter(
            (dependencyId) =>
              !tasks.some(
                (candidate) =>
                  candidate.projectId === projectId && candidate.id === dependencyId
              )
          ),
        }));

      setProjects((currentProjects) =>
        currentProjects.filter((item) => item.id !== projectId)
      );
      setTasks(remainingTasks);
      setMembers(rebuildMemberAssignments(members, remainingTasks));
      addActivity("Project Deleted", `${project?.name || "Project"} was deleted.`);
      enqueueNotification({
        type: "warning",
        message: `${project?.name || "Project"} and its tasks were removed.`,
      });
    },
    [
      addActivity,
      enqueueNotification,
      members,
      projects,
      setMembers,
      setProjects,
      setTasks,
      tasks,
    ]
  );

  const createTask = useCallback(
    (payload) => {
      const assignee =
        payload.assignee || suggestedAssignee?.name || members[0]?.name || "";
      const task = {
        id: createId("task"),
        title: payload.title.trim(),
        projectId: payload.projectId,
        assignee,
        duration: Number(payload.duration || 1),
        status: payload.status || "Todo",
        priority: payload.priority || "Medium",
        deadline: payload.deadline,
        delayDays: Number(payload.delayDays || 0),
        blockedBy: normalizeBlockedBy(payload.blockedBy),
      };
      const nextTasks = [task, ...tasks];

      setTasks(nextTasks);
      setMembers(rebuildMemberAssignments(members, nextTasks));
      addActivity("Task Assigned", `${task.title} assigned to ${task.assignee}.`);
      enqueueNotification({
        type: "success",
        message: `${task.title} assigned to ${task.assignee}.`,
      });
      return task;
    },
    [
      addActivity,
      enqueueNotification,
      members,
      setMembers,
      setTasks,
      suggestedAssignee,
      tasks,
    ]
  );

  const recordScheduleChange = useCallback(
    (task, nextDuration) => {
      const change = {
        id: createId("history"),
        taskId: task.id,
        taskTitle: task.title,
        previousDuration: Number(task.duration),
        newDuration: Number(nextDuration),
        timestamp: new Date().toISOString(),
      };

      setHistory((currentHistory) => ({
        past: [...currentHistory.past, change],
        current: change,
        future: [],
        timeline: [change, ...currentHistory.timeline],
      }));

      addActivity(
        "Deadline Changed",
        `${task.title} duration changed from ${task.duration} to ${nextDuration} days.`
      );
      enqueueNotification({
        type: "info",
        message: `${task.title} duration changed to ${nextDuration} days.`,
      });
    },
    [addActivity, enqueueNotification, setHistory]
  );

  const updateTask = useCallback(
    (taskId, payload) => {
      const previousTask = tasks.find((task) => task.id === taskId);
      if (!previousTask) return null;

      const nextTask = {
        ...previousTask,
        ...payload,
        title: payload.title?.trim() || previousTask.title,
        duration: Number(payload.duration || previousTask.duration),
        delayDays: Number(payload.delayDays || 0),
        blockedBy: normalizeBlockedBy(payload.blockedBy),
      };

      const nextTasks = tasks.map((task) =>
        task.id === taskId ? nextTask : task
      );

      setTasks(nextTasks);
      setMembers(rebuildMemberAssignments(members, nextTasks));

      if (Number(previousTask.duration) !== Number(nextTask.duration)) {
        recordScheduleChange(previousTask, nextTask.duration);
      } else {
        addActivity("Task Updated", `${nextTask.title} was updated.`);
        enqueueNotification({
          type: "info",
          message: `${nextTask.title} task details updated.`,
        });
      }

      return nextTask;
    },
    [
      addActivity,
      enqueueNotification,
      members,
      recordScheduleChange,
      setMembers,
      setTasks,
      tasks,
    ]
  );

  const deleteTask = useCallback(
    (taskId) => {
      const deletedTask = tasks.find((task) => task.id === taskId);
      const nextTasks = tasks
        .filter((task) => task.id !== taskId)
        .map((task) => ({
          ...task,
          blockedBy: (task.blockedBy || []).filter(
            (dependencyId) => dependencyId !== taskId
          ),
        }));

      setTasks(nextTasks);
      setMembers(rebuildMemberAssignments(members, nextTasks));
      addActivity("Task Deleted", `${deletedTask?.title || "Task"} was deleted.`);
      enqueueNotification({
        type: "warning",
        message: `${deletedTask?.title || "Task"} was deleted.`,
      });
    },
    [addActivity, enqueueNotification, members, setMembers, setTasks, tasks]
  );

  const undoSchedule = useCallback(() => {
    const latest = history.past[history.past.length - 1];
    if (!latest) return;

    const nextPast = history.past.slice(0, -1);
    const nextTasks = tasks.map((task) =>
      task.id === latest.taskId
        ? { ...task, duration: latest.previousDuration }
        : task
    );

    setTasks(nextTasks);
    setHistory({
      ...history,
      past: nextPast,
      current: nextPast[nextPast.length - 1] || null,
      future: [...history.future, latest],
    });
    pushToast({
      type: "warning",
      message: `Undo restored ${latest.taskTitle} to ${latest.previousDuration} days.`,
    });
  }, [history, pushToast, setHistory, setTasks, tasks]);

  const redoSchedule = useCallback(() => {
    const latest = history.future[history.future.length - 1];
    if (!latest) return;

    const nextFuture = history.future.slice(0, -1);
    const nextTasks = tasks.map((task) =>
      task.id === latest.taskId ? { ...task, duration: latest.newDuration } : task
    );

    setTasks(nextTasks);
    setHistory({
      ...history,
      past: [...history.past, latest],
      current: latest,
      future: nextFuture,
    });
    pushToast({
      type: "success",
      message: `Redo applied ${latest.taskTitle} at ${latest.newDuration} days.`,
    });
  }, [history, pushToast, setHistory, setTasks, tasks]);

  const dequeueNotification = useCallback(() => {
    const nextNotification = [...notifications]
      .filter((notification) => notification.status === "queued")
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];

    if (!nextNotification) return;

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === nextNotification.id
          ? { ...notification, status: "sent", sentAt: new Date().toISOString() }
          : notification
      )
    );
    addActivity("Queue Organized", `${nextNotification.message} was sent.`);
    pushToast({
      type: nextNotification.type,
      message: `Sent: ${nextNotification.message}`,
    });
  }, [addActivity, notifications, pushToast, setNotifications]);

  const createMember = useCallback(
    (payload) => {
      const member = {
        id: createId("member"),
        name: payload.name.trim(),
        role: payload.role.trim(),
        assignedTasks: [],
      };

      setMembers((currentMembers) => [...currentMembers, member]);
      addActivity("Member Added", `${member.name} was added as ${member.role}.`);
      enqueueNotification({
        type: "success",
        message: `${member.name} joined the team as ${member.role}.`,
      });
      return { ok: true, member };
    },
    [addActivity, enqueueNotification, setMembers]
  );

  const updateMember = useCallback(
    (memberId, payload) => {
      const oldMember = members.find((m) => m.id === memberId);
      if (!oldMember) return { ok: false, error: "Member not found" };

      const nameChanged = oldMember.name !== payload.name.trim();
      const updatedMember = {
        ...oldMember,
        name: payload.name.trim(),
        role: payload.role.trim(),
      };

      setMembers((currentMembers) =>
        currentMembers.map((m) => (m.id === memberId ? updatedMember : m))
      );

      if (nameChanged) {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.assignee === oldMember.name
              ? { ...task, assignee: updatedMember.name }
              : task
          )
        );
        addActivity(
          "Member Renamed",
          `${oldMember.name} is now known as ${updatedMember.name}.`
        );
      } else {
        addActivity("Member Updated", `${updatedMember.name} role was updated.`);
      }

      enqueueNotification({
        type: "info",
        message: `${updatedMember.name} details were updated.`,
      });

      return { ok: true, member: updatedMember };
    },
    [members, setMembers, setTasks, addActivity, enqueueNotification]
  );

  const deleteMember = useCallback(
    (memberId) => {
      const member = members.find((m) => m.id === memberId);
      if (!member) return;

      const remainingMembers = members.filter((m) => m.id !== memberId);
      const updatedTasks = tasks.map((task) =>
        task.assignee === member.name ? { ...task, assignee: "" } : task
      );

      setMembers(rebuildMemberAssignments(remainingMembers, updatedTasks));
      setTasks(updatedTasks);

      addActivity("Member Removed", `${member.name} was removed from the team.`);
      enqueueNotification({
        type: "warning",
        message: `${member.name} was removed from the team.`,
      });
    },
    [members, tasks, setMembers, setTasks, addActivity, enqueueNotification]
  );

  const resetApplicationData = useCallback(() => {
    resetDemoCollections();
    setProjects(readStorage(STORAGE_KEYS.projects, []));
    setTasks(readStorage(STORAGE_KEYS.tasks, []));
    setMembers(readStorage(STORAGE_KEYS.members, []));
    setNotifications(readStorage(STORAGE_KEYS.notifications, []));
    setHistory(readStorage(STORAGE_KEYS.history, {}));
    setActivities(readStorage(STORAGE_KEYS.activities, []));
    pushToast({
      type: "success",
      message: "Demo data reset to the original seed state.",
    });
  }, [
    pushToast,
    setActivities,
    setHistory,
    setMembers,
    setNotifications,
    setProjects,
    setTasks,
  ]);

  const value = useMemo(
    () => ({
      projects,
      tasks,
      members,
      membersWithWorkload,
      suggestedAssignee,
      notifications,
      history,
      activities,
      toasts,
      search,
      setSearch,
      createProject,
      updateProject,
      deleteProject,
      createTask,
      updateTask,
      deleteTask,
      undoSchedule,
      redoSchedule,
      enqueueNotification,
      dequeueNotification,
      addActivity,
      resetApplicationData,
      dismissToast,
      createMember,
      updateMember,
      deleteMember,
    }),
    [
      activities,
      addActivity,
      createProject,
      createTask,
      deleteProject,
      deleteTask,
      dequeueNotification,
      dismissToast,
      enqueueNotification,
      history,
      members,
      membersWithWorkload,
      notifications,
      projects,
      redoSchedule,
      resetApplicationData,
      suggestedAssignee,
      tasks,
      toasts,
      undoSchedule,
      updateProject,
      updateTask,
      search,
      setSearch,
      createMember,
      updateMember,
      deleteMember,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }

  return context;
}
