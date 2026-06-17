export function rebuildMemberAssignments(members, tasks) {
  return members.map((member) => ({
    ...member,
    assignedTasks: tasks
      .filter((task) => task.assignee === member.name)
      .map((task) => task.id),
  }));
}

export function getMembersWithWorkload(members, tasks) {
  return members.map((member) => {
    const assignedTasks = tasks.filter((task) => task.assignee === member.name);
    const activeTasks = assignedTasks.filter(
      (task) => task.status !== "Completed"
    );
    const blockedTasks = assignedTasks.filter((task) => task.status === "Blocked");

    return {
      ...member,
      assignedTasks: assignedTasks.map((task) => task.id),
      totalTasks: assignedTasks.length,
      activeTasks: activeTasks.length,
      blockedTasks: blockedTasks.length,
      workloadScore: activeTasks.length + blockedTasks.length,
    };
  });
}

export function getLowestWorkloadMember(members, tasks) {
  const membersWithWorkload = getMembersWithWorkload(members, tasks);

  return [...membersWithWorkload].sort((a, b) => {
    if (a.workloadScore !== b.workloadScore) {
      return a.workloadScore - b.workloadScore;
    }

    return a.totalTasks - b.totalTasks;
  })[0];
}
