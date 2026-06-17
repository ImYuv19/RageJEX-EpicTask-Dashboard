import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants.js";
import { Card } from "../common/Card.jsx";

export function WorkloadChart({ members }) {
  const data = members.map((member) => ({
    name: member.name.split(" ")[0],
    total: member.totalTasks,
    active: member.activeTasks,
    blocked: member.blockedTasks,
  }));

  return (
    <Card
      title="Workload Chart"
      subtitle="Tasks per member and active workload comparison."
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
            <Bar dataKey="active" fill={CHART_COLORS.secondary} radius={[6, 6, 0, 0]} />
            <Bar dataKey="blocked" fill={CHART_COLORS.danger} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
