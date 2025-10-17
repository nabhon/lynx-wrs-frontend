import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
  FileText,
} from "lucide-react"

// ✅ Task types
export const types = [
  { value: "MIPO", label: "MIPO", icon: FileText },
  { value: "MRPO", label: "MRPO", icon: FileText },
  { value: "MIT", label: "MIT", icon: FileText },
  { value: "MRT", label: "MRT", icon: FileText },
  { value: "TGD", label: "TGD", icon: FileText },
  { value: "RGD", label: "RGD", icon: FileText },
  { value: "MGD", label: "MGD", icon: FileText },
  { value: "TPD", label: "TPD", icon: FileText },
  { value: "STD", label: "STD", icon: FileText },
  { value: "SCD", label: "SCD", icon: FileText },
  { value: "RD", label: "RD", icon: FileText },
  { value: "US", label: "US", icon: FileText },
  { value: "RPD", label: "RPD", icon: FileText },
  { value: "SWD", label: "SWD", icon: FileText },
  { value: "UCD", label: "UCD", icon: FileText },
  { value: "AD", label: "AD", icon: FileText },
  { value: "UCDS", label: "UCDS", icon: FileText },
  { value: "SQ", label: "SQ", icon: FileText },
  { value: "SD", label: "SD", icon: FileText },
  { value: "DBD", label: "DBD", icon: FileText },
  { value: "ER", label: "ER", icon: FileText },
  { value: "DD", label: "DD", icon: FileText },
  { value: "PN", label: "PN", icon: FileText },
  { value: "CHECK", label: "CHECK", icon: FileText },
  { value: "SRSD", label: "SRSD", icon: FileText },
  { value: "VCD", label: "VCD", icon: FileText },
  { value: "UXI", label: "UXI", icon: FileText },
  { value: "SMD", label: "SMD", icon: FileText },
  { value: "FMD", label: "FMD", icon: FileText },
  { value: "SDW", label: "SDW", icon: FileText },
  { value: "TRT", label: "TRT", icon: FileText },
  { value: "POT", label: "POT", icon: FileText },
  { value: "ETC", label: "ETC", icon: FileText },
  { value: "MFT", label: "MFT", icon: FileText },
  { value: "NWA", label: "NWA", icon: FileText },
]

export const sprints = [
  { value: 1, label: "Sprint 1" },
  { value: 2, label: "Sprint 2" },
  { value: 3, label: "Sprint 3" },
  { value: 4, label: "Sprint 4" },
  { value: 5, label: "Sprint 5" },
  { value: 6, label: "Sprint 6" },
  { value: 7, label: "Sprint 7" },
  { value: 8, label: "Sprint 8" },
  { value: 9, label: "Sprint 9" },
]

export const employees = [
  { value: "Alice Chen", label: "Alice" },
  { value: "David Kim", label: "David" },
  { value: "Maria Lopez", label: "Maria" },
  { value: "John Carter", label: "John" },
  { value: "Emma Davis", label: "Emma" },
  { value: "Michael Brown", label: "Michael" },
  { value: "Sophia Turner", label: "Sophia" },
  { value: "Daniel Wilson", label: "Daniel" },
  { value: "Olivia Clark", label: "Olivia" },
  { value: "Ethan Miller", label: "Ethan" },
]


export const cycles = [
  { value: 1, label: "Cycle 1" },
  { value: 2, label: "Cycle 2" },
  { value: 3, label: "Cycle 3" },
  { value: 4, label: "Cycle 4" },
]

// ✅ Task statuses
export const statuses = [
  {
    value: "TODO",
    label: "To Do",
    icon: HelpCircle,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "DONE",
    label: "Done",
    icon: CheckCircle,
  },
  {
    value: "CANCELED",
    label: "Canceled",
    icon: CircleOff,
  },
  {
    value: "ON_HOLD",
    label: "On Hold",
    icon: Circle,
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: FileText,
  },
  {
    value: "LATE",
    label: "Late",
    icon: Circle,
  },
  {
    value: "BLOCKED",
    label: "Blocked",
    icon: Circle,
  },
  {
    value: "REVISE",
    label: "Revise",
    icon: Circle,
  },
]

// ✅ Task priorities
export const priorities = [
  {
    label: "Low",
    value: "LOW",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "MEDIUM",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "HIGH",
    icon: ArrowUp,
  },
]
