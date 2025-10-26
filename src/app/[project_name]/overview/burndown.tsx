"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/providers/ProjectProvider";

export default function BurndownChart() {
  const { project } = useProject();
  const tasks = project?.items ?? [];

  // 🧮 Unique cycles
  const uniqueCycles = Array.from(new Set(tasks.map((t) => t.cycleCount)));
  const defaultCycle = Math.max(...uniqueCycles);

  const [selectedCycle, setSelectedCycle] = useState(defaultCycle);

  // 🧠 Filter by selected cycle
  const filteredByCycle = useMemo(
    () => tasks.filter((t) => t.cycleCount === selectedCycle),
    [tasks, selectedCycle]
  );

  // 🧩 Unique sprints in this cycle
  const sprintsInCycle = Array.from(
    new Set(filteredByCycle.map((t) => t.sprintCount))
  ).sort((a, b) => a - b);

  // 📊 Prepare Burndown data
  const chartData = useMemo(() => {
    if (filteredByCycle.length === 0 || sprintsInCycle.length === 0) return [];

    const totalPoints = filteredByCycle.reduce(
      (sum, t) => sum + (t.estimatePoints || 0),
      0
    );

    const totalSprints = sprintsInCycle.length;
    const idealStep = totalPoints / totalSprints;

    let remainingPoints = totalPoints;
    const data: { sprint: number; ideal: number; actual: number }[] = [];

    for (let i = 0; i < totalSprints; i++) {
      const sprint = sprintsInCycle[i];
      const sprintTasks = filteredByCycle.filter(
        (t) => t.sprintCount === sprint
      );

      // ✅ Actual burn — completed points in this sprint
      const donePoints = sprintTasks
        .filter((t) => t.status === "DONE")
        .reduce((sum, t) => sum + (t.estimatePoints || 0), 0);

      remainingPoints -= donePoints;

      // 🟦 Ideal line — evenly decreasing
      const idealRemaining = Math.max(totalPoints - idealStep * (i + 1), 0);

      data.push({
        sprint,
        ideal: idealRemaining,
        actual: Math.max(remainingPoints, 0),
      });
    }

    // Include starting point for smoother line (optional)
    data.unshift({ sprint: 0, ideal: totalPoints, actual: totalPoints });

    return data;
  }, [filteredByCycle, sprintsInCycle]);

  // 🔧 Cycle combobox
  const ComboBox = ({
    label,
    options,
    selected,
    setSelected,
  }: {
    label: string;
    options: number[];
    selected: number;
    setSelected: (val: number) => void;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[180px] justify-between"
        >
          {label} {selected}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt}
                onSelect={() => setSelected(opt)}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    opt === selected ? "opacity-100" : "opacity-0"
                  )}
                />
                {label} {opt}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-4">
      {/* 🔘 Filter */}
      <div className="flex w-full justify-end gap-4">
        <ComboBox
          label="Cycle"
          options={uniqueCycles}
          selected={selectedCycle}
          setSelected={setSelectedCycle}
        />
      </div>

      {/* 📈 Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 40, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sprint"
            label={{ value: "Sprint", position: "bottom", dy: 24 }}
          />
          <YAxis label={{ value: "Points", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend verticalAlign="top" align="center" />
          {/* 🟦 Ideal line */}
          <Line
            type="monotone"
            dataKey="ideal"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Ideal"
          />
          {/* 🟩 Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#2563eb"
            strokeWidth={3}
            dot
            name="Actual"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
