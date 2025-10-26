// src/app/tasks/page.tsx
import {
  getMyWorkingTasksService,
  getMyPendingReviewTasksService,
  type MyTaskDto,
} from "@/services/taskService";
import TaskTabs from "@/components/tasks/TaskTabs";

export const dynamic = "force-dynamic"; // กัน cache ถ้าอยากดึงสดเสมอ

function sortTasks(a: MyTaskDto, b: MyTaskDto) {
  const da = a.dueDate ?? "";
  const db = b.dueDate ?? "";
  if (da !== db) return da.localeCompare(db);
  return (a.projectKey ?? "").localeCompare(b.projectKey ?? "");
}

export default async function MyWorkPage() {
  let active: MyTaskDto[] = [];
  let review: MyTaskDto[] = [];
  let error: string | null = null;

  try {
    const [w, r] = await Promise.all([
      getMyWorkingTasksService(),      // { message, items }
      getMyPendingReviewTasksService() // { message, items }
    ]);
    active = (w.items ?? []).toSorted(sortTasks);
    review = (r.items ?? []).toSorted(sortTasks);
  } catch (e: any) {
    error = e?.message ?? "Failed to load tasks";
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Work</h1>
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <TaskTabs active={active} review={review} />
      )}
    </div>
  );
}
