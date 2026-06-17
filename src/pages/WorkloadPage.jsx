import { Plus, ListChecks, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AutoAssignPanel } from "../components/workload/AutoAssignPanel.jsx";
import { TeamMemberCard } from "../components/workload/TeamMemberCard.jsx";
import { WorkloadChart } from "../components/workload/WorkloadChart.jsx";
import { Card } from "../components/common/Card.jsx";
import { Modal } from "../components/common/Modal.jsx";
import { MemberForm } from "../components/workload/MemberForm.jsx";
import { Button } from "../components/common/Button.jsx";
import { Skeleton } from "../components/common/Skeleton.jsx";
import { PageHeader } from "../components/common/PageHeader.jsx";
import { useAppData } from "../context/AppDataContext.jsx";

function WorkloadStat({ label, value, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-50 text-primary dark:bg-violet-500/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="text-2xl font-black text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

function WorkloadSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <Card key={n}>
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <Skeleton className="h-80 w-full" />
        </Card>
        <Card>
          <Skeleton className="h-80 w-full" />
        </Card>
      </div>
    </div>
  );
}

export function WorkloadPage() {
  const {
    projects,
    tasks,
    membersWithWorkload,
    suggestedAssignee,
    createTask,
    createMember,
    updateMember,
    deleteMember,
    search,
  } = useAppData();

  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return membersWithWorkload.filter(
      (m) =>
        !term ||
        m.name.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term)
    );
  }, [membersWithWorkload, search]);

  const rankedMembers = useMemo(() => {
    return [...filteredMembers].sort(
      (a, b) => a.workloadScore - b.workloadScore
    );
  }, [filteredMembers]);

  const activeTasks = tasks.filter((task) => task.status !== "Completed");
  const averageLoad = membersWithWorkload.length
    ? (activeTasks.length / membersWithWorkload.length).toFixed(1)
    : 0;

  const handleDeleteMember = (memberId) => {
    const member = membersWithWorkload.find((m) => m.id === memberId);
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member?.name || "this member"}? All their assigned tasks will be unassigned.`
    );
    if (confirmed) {
      deleteMember(memberId);
    }
  };

  const selectedMember = modal?.type === "edit" ? modal.member : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team Workload Assignor"
        title="Workload"
        description="Team cards, workload statistics, charts, and an auto-assignment engine that selects the lowest workload member."
        actions={
          <Button icon={Plus} onClick={() => setModal({ type: "create" })}>
            Create Member
          </Button>
        }
      />

      {loading ? (
        <WorkloadSkeleton />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <WorkloadStat
              label="Team Members"
              value={membersWithWorkload.length}
              icon={Users}
            />
            <WorkloadStat
              label="Active Tasks"
              value={activeTasks.length}
              icon={ListChecks}
            />
            <WorkloadStat
              label="Average Load"
              value={averageLoad}
              icon={TrendingUp}
            />
            <WorkloadStat
              label="Suggested Assignee"
              value={suggestedAssignee?.name?.split(" ")[0] || "None"}
              icon={UserRoundCheck}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <WorkloadChart members={membersWithWorkload} />
            <AutoAssignPanel
              projects={projects}
              suggestedAssignee={suggestedAssignee}
              onCreateTask={createTask}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {rankedMembers.map((member, index) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                rank={index + 1}
                onEdit={() => setModal({ type: "edit", member })}
                onDelete={() => handleDeleteMember(member.id)}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        open={modal?.type === "create"}
        title="Create Team Member"
        description="Add a new member to the workspace roster. Workloads will automatically recalculate."
        onClose={closeModal}
      >
        <MemberForm onSubmit={createMember} onCancel={closeModal} />
      </Modal>

      <Modal
        open={modal?.type === "edit"}
        title="Edit Team Member"
        description="Update profile details and role configurations."
        onClose={closeModal}
      >
        {selectedMember ? (
          <MemberForm
            member={selectedMember}
            onSubmit={(values) => updateMember(selectedMember.id, values)}
            onCancel={closeModal}
          />
        ) : null}
      </Modal>
    </div>
  );
}
