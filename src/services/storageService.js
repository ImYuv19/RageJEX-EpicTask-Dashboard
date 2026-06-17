import {
  seedActivities,
  seedHistory,
  seedMembers,
  seedNotifications,
  seedProjects,
  seedSettings,
  seedTasks,
  seedUsers,
} from "../data/seedData.js";

export const STORAGE_KEYS = {
  users: "users",
  currentUser: "currentUser",
  projects: "projects",
  tasks: "tasks",
  members: "members",
  notifications: "notifications",
  history: "history",
  activities: "activities",
  settings: "settings",
  seeded: "ragejex_seeded",
};

const seedMap = {
  [STORAGE_KEYS.users]: seedUsers,
  [STORAGE_KEYS.projects]: seedProjects,
  [STORAGE_KEYS.tasks]: seedTasks,
  [STORAGE_KEYS.members]: seedMembers,
  [STORAGE_KEYS.notifications]: seedNotifications,
  [STORAGE_KEYS.history]: seedHistory,
  [STORAGE_KEYS.activities]: seedActivities,
  [STORAGE_KEYS.settings]: seedSettings,
};

export function readStorage(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeStorage() {
  Object.entries(seedMap).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      writeStorage(key, value);
    }
  });

  if (!localStorage.getItem(STORAGE_KEYS.seeded)) {
    writeStorage(STORAGE_KEYS.seeded, true);
  }
}

export function resetDemoCollections() {
  [
    STORAGE_KEYS.projects,
    STORAGE_KEYS.tasks,
    STORAGE_KEYS.members,
    STORAGE_KEYS.notifications,
    STORAGE_KEYS.history,
    STORAGE_KEYS.activities,
    STORAGE_KEYS.settings,
  ].forEach((key) => localStorage.removeItem(key));

  initializeStorage();
}

export function createId(prefix) {
  if (crypto?.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
