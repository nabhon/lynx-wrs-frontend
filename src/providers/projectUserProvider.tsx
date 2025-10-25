// src/providers/projectUserProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getProjectDataService, getUsersInProjectService, removeProjectMemberService } from "@/services/projectService";

export type ProjectMember = {
  id: number;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
};

export type ProjectUserContextType = {
  projectId: number | null;
  projectName: string | null;
  members: ProjectMember[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  removeMember: (userId: number) => Promise<void>;
};

const ProjectUserContext = createContext<ProjectUserContextType | undefined>(undefined);

function deslugify(name: string) {
  return name.replace(/_/g, " ");
}

export function ProjectUserProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slugName = params?.project_name as string | undefined;

  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // โหลด projectId จาก projectName (จำเป็นเพราะ API users ต้องใช้ projectId)
  const loadProjectMeta = useCallback(async () => {
    if (!slugName) return;
    try {
      const res = await getProjectDataService(deslugify(slugName));
      setProjectId(res.projectId);
      setProjectName(res.projectName);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load project meta");
      setProjectId(null);
      setProjectName(null);
    }
  }, [slugName]);

  const fetchMembers = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getUsersInProjectService(projectId);
      setMembers(res.users ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load project members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const refresh = useCallback(async () => {
    await fetchMembers();
  }, [fetchMembers]);

  const removeMember = useCallback(
    async (userId: number) => {
      if (!projectId) return;
      await removeProjectMemberService(projectId, userId);
      await refresh();
    },
    [projectId, refresh]
  );

  useEffect(() => {
    // step 1: resolve projectId
    (async () => {
      setLoading(true);
      await loadProjectMeta();
      setLoading(false);
    })();
  }, [loadProjectMeta]);

  useEffect(() => {
    // step 2: load members when got projectId
    if (projectId) {
      fetchMembers();
    }
  }, [projectId, fetchMembers]);

  const value = useMemo<ProjectUserContextType>(() => ({
    projectId,
    projectName,
    members,
    loading,
    error,
    refresh,
    removeMember,
  }), [projectId, projectName, members, loading, error, refresh, removeMember]);

  return (
    <ProjectUserContext.Provider value={value}>
      {children}
    </ProjectUserContext.Provider>
  );
}

export function useProjectUsers() {
  const ctx = useContext(ProjectUserContext);
  if (!ctx) throw new Error("useProjectUsers must be used within a ProjectUserProvider");
  return ctx;
}
