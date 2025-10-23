"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getProjectListService,
  getAllProjectListService,
} from "@/services/projectService";
import { useSession } from "./SessionProvider";

// =======================
// Types
// =======================
export type ProjectItem = {
  projectId: number;
  projectKey: string;
  projectName: string;
};

type ProjectListContextType = {
  projects: ProjectItem[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
};

// =======================
// Context
// =======================
const ProjectListContext = createContext<ProjectListContextType | undefined>(
  undefined
);

// =======================
// Provider
// =======================
export function ProjectListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useSession();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    let data;
    if (user?.role === "ADMIN") {
      data = await getAllProjectListService();
    } else {
      data = await getProjectListService();
    }
    if (data?.items) {
      setProjects(data.items);
    } else {
      throw new Error("Invalid API response");
    }
  } catch (err: any) {
    setError(err.message || "Failed to load projects");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <ProjectListContext.Provider
      value={{ projects, loading, error, refreshProjects: loadProjects }}
    >
      {children}
    </ProjectListContext.Provider>
  );
}

// =======================
// Hook
// =======================
export function useProjectList() {
  const ctx = useContext(ProjectListContext);
  if (!ctx)
    throw new Error("useProjectList must be used within a ProjectListProvider");
  return ctx;
}
