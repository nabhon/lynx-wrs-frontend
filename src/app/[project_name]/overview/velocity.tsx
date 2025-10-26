"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

export default function VelocityChart() {
  const { project } = useProject();
  const tasks = project?.items ?? [];

  const uniqueCycles = Array.from(new Set(tasks.map((t) => t.cycleCount)));
  const defaultCycle = Math.max(...uniqueCycles);

  const [selectedCycle, setSelectedCycle] = useState(defaultCycle);

  // 🧠 Filter tasks by selected cycle
  const filteredByCycle = useMemo(
    () => tasks.filter((t) => t.cycleCount === selectedCycle),
    [tasks, selectedCycle]
  );

  // 🧩 Get unique sprints in this cycle
  const sprintsInCycle = Array.from(
    new Set(filteredByCycle.map((t) => t.sprintCount))
  ).sort((a, b) => a - b);

  //
  // 📊 Compute velocity data
  //
  const chartData = useMemo(() => {
    return sprintsInCycle.map((sprint) => {
      const sprintTasks = filteredByCycle.filter(
        (t) => t.sprintCount === sprint
      );

      const donePoints = sprintTasks
        .filter((t) => t.status === "DONE")
        .reduce((sum, t) => sum + (t.estimatePoints || 0), 0);

      const plannedPoints = sprintTasks.reduce(
        (sum, t) => sum + (t.estimatePoints || 0),
        0
      );

      return {
        sprint,
        velocity: donePoints,
        planned: plannedPoints,
      };
    });
  }, [filteredByCycle, sprintsInCycle]);

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

      {/* 📊 Velocity Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={chartData}
          margin={{ top: 60, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="sprint"
            label={{ value: "Sprint", position: "bottom", dy: 0 }}
          />
          <YAxis
            label={{ value: "Points", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />

          {/* ✅ Legend at top, horizontal */}
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="top"
            wrapperStyle={{ top: 0 }}
          />

          {/* Bars */}
          <Bar
            dataKey="planned"
            fill="#94a3b8"
            name="Planned Points"
            barSize={40}
          />
          <Bar
            dataKey="velocity"
            fill="#2563eb"
            name="Completed Points"
            barSize={40}
          />

          {/* Line trend */}
          <Line
            type="monotone"
            dataKey="velocity"
            stroke="#90d5ff"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Velocity Trend"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
