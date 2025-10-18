"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "next/navigation";
import { getProjectDataService } from "@/services/projectService";

// =======================
// Types
// =======================
export type TaskItem = {
  id: number;
  projectId: number;
  projectKey: string;
  cycleId: number;
  cycleCount: number;
  sprintId: number;
  sprintCount: number;
  key: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priorities: string;
  estimatePoints: number | null;
  actualPoints: number | null;
  startDate: string | null;
  dueDate: string | null;
  finishedAt: string | null;
  assignedToId: number | null;
  assignedToName: string | null;
  auditedById: number | null;
  auditedByName: string | null;
  createdById: number | null;
  createdByName: string | null;
  updatedById: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectData = {
  projectId: number;
  projectKey: string;
  projectName: string;
  message?: string;
  items: TaskItem[];
};

function deslugify(title: string) {
  return title.replace(/_/g, " ");
}

// =======================
// Context Type
// =======================
type ProjectContextType = {
  project: ProjectData | null;
  loading: boolean;
  error: string | null;
  refreshProject: () => Promise<void>;
};

// =======================
// Context
// =======================
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// =======================
// Provider
// =======================
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectNameParam = params?.project_name as string | undefined;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjectData = useCallback(async () => {
    if (!projectNameParam) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getProjectDataService(deslugify(projectNameParam));
      setProject({
        projectId: data.projectId,
        projectKey: data.projectKey,
        projectName: data.projectName,
        message: data.message,
        items: data.items || [],
      });
    } catch (err: any) {
      console.error("Failed to load project data:", err);
      setError(err.message || "Failed to fetch project data");
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectNameParam]);

  useEffect(() => {
    if (projectNameParam) loadProjectData();
  }, [projectNameParam, loadProjectData]);

  const value: ProjectContextType = {
    project,
    loading,
    error,
    refreshProject: loadProjectData,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

// =======================
// Hook
// =======================
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
