export function getRiskTasks(tasks) {
  return [...tasks]
    .map((task) => ({
      ...task,
      riskScore: Number(task.delayDays || 0),
    }))
    .sort((a, b) => b.riskScore - a.riskScore);
}

export function getTopRiskTasks(tasks, limit = 5) {
  return getRiskTasks(tasks)
    .filter((task) => task.riskScore > 0)
    .slice(0, limit);
}
