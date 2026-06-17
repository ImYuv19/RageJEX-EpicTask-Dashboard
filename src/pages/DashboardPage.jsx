import {
  AlertTriangle,
  BriefcaseBusiness,
  CircleSlash,
  ListChecks,
  Timer,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ActivityFeed } from "../components/dashboard/ActivityFeed.jsx";
import { CriticalPathSummary } from "../components/dashboard/CriticalPathSummary.jsx";
import { KpiCard } from "../components/dashboard/KpiCard.jsx";
import { RecentNotifications } from "../components/dashboard/RecentNotifications.jsx";
import { Card } from "../components/common/Card.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { useMetrics } from "../hooks/useMetrics.js";
import { CHART_COLORS } from "../utils/constants.js";

const pieColors = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.success,
  CHART_COLORS.danger,
];

export function DashboardPage() {
  const { projects, tasks, members, notifications, activities } = useAppData();
  const metrics = useMetrics({ projects, tasks, members, notifications });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="RageJEX EpicTask Dashboard"
        title="Plan. Track. Deliver."
        description="A ClickUp-inspired project control panel for critical path, dependencies, risk, notification flow, and workload balance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          label="Total Projects"
          value={metrics.totalProjects}
          icon={BriefcaseBusiness}
          helper="Portfolio scope"
        />
        <KpiCard
          label="Total Tasks"
          value={metrics.totalTasks}
          icon={ListChecks}
          tone="secondary"
          helper="Across all projects"
        />
        <KpiCard
          label="Active Tasks"
          value={metrics.activeTasks}
          icon={Timer}
          tone="success"
          helper="Currently in progress"
        />
        <KpiCard
          label="Blocked Tasks"
          value={metrics.blockedTasks}
          icon={CircleSlash}
          tone="danger"
          helper="Dependency attention"
        />
        <KpiCard
          label="Overdue Tasks"
          value={metrics.overdueTasks}
          icon={AlertTriangle}
          tone="warning"
          helper="Past deadline"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card
          title="Task Status Distribution"
          subtitle="All tasks grouped by workflow status."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {metrics.statusDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card
          title="Team Workload Distribution"
          subtitle="Total and active task volume by team member."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.workloadDistribution}
                margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="tasks"
                  fill={CHART_COLORS.primary}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="active"
                  fill={CHART_COLORS.secondary}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card
          title="Deadline Risk Analysis"
          subtitle="Highest delay-day scores across risky tasks."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.riskDistribution}
                layout="vertical"
                margin={{ top: 10, right: 12, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={88} />
                <Tooltip />
                <Bar dataKey="risk" fill={CHART_COLORS.danger} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ActivityFeed activities={activities} />
        <RecentNotifications notifications={notifications} />
      </div>

      <CriticalPathSummary tasks={tasks} />
    </div>
  );
}
