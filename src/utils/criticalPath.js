export function getTaskMap(tasks) {
  return tasks.reduce((map, task) => {
    map.set(task.id, task);
    return map;
  }, new Map());
}

export function getDependencyEdges(tasks) {
  return tasks.flatMap((task) =>
    (task.blockedBy || []).map((dependencyId) => ({
      from: dependencyId,
      to: task.id,
    }))
  );
}

export function getBlockedTasks(tasks) {
  const taskMap = getTaskMap(tasks);

  return tasks
    .filter((task) => task.status === "Blocked" || task.blockedBy?.length)
    .flatMap((task) =>
      (task.blockedBy || []).map((dependencyId) => ({
        blockingTask: taskMap.get(dependencyId),
        waitingTask: task,
        status: task.status,
      }))
    )
    .filter((item) => item.blockingTask && item.waitingTask);
}

export function calculateCriticalPath(tasks) {
  const taskMap = getTaskMap(tasks);
  const children = new Map();

  tasks.forEach((task) => {
    children.set(task.id, []);
  });

  tasks.forEach((task) => {
    (task.blockedBy || []).forEach((dependencyId) => {
      if (!children.has(dependencyId)) children.set(dependencyId, []);
      children.get(dependencyId).push(task.id);
    });
  });

  const memo = new Map();

  function dfs(taskId, visiting = new Set()) {
    if (memo.has(taskId)) return memo.get(taskId);
    const task = taskMap.get(taskId);

    if (!task || visiting.has(taskId)) {
      return { duration: 0, path: [] };
    }

    visiting.add(taskId);
    const nextTasks = children.get(taskId) || [];
    const bestChild = nextTasks
      .map((childId) => dfs(childId, new Set(visiting)))
      .sort((a, b) => b.duration - a.duration)[0] || {
      duration: 0,
      path: [],
    };

    const result = {
      duration: Number(task.duration || 0) + bestChild.duration,
      path: [task, ...bestChild.path],
    };

    memo.set(taskId, result);
    return result;
  }

  const roots = tasks.filter((task) => !task.blockedBy?.length);
  const candidates = (roots.length ? roots : tasks).map((task) => dfs(task.id));
  const best = candidates.sort((a, b) => b.duration - a.duration)[0] || {
    duration: 0,
    path: [],
  };

  return {
    totalDuration: best.duration,
    path: best.path,
    chain: best.path.map((task) => task.title),
    edges: getDependencyEdges(tasks),
  };
}
