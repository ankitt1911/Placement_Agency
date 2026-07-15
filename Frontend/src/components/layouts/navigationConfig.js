import { BriefcaseBusiness, Building2, ClipboardList, LayoutDashboard, UserRound, UsersRound } from "lucide-react";

export const roleHome = {
  student: "/student/dashboard",
  operations: "/operations/dashboard"
};

export const navItems = {
  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { label: "Profile", path: "/student/profile", icon: UserRound },
    { label: "Openings", path: "/student/openings", icon: BriefcaseBusiness },
    { label: "Applied Jobs", path: "/student/applied-jobs", icon: ClipboardList }
  ],
  operations: [
    { label: "Dashboard", path: "/operations/dashboard", icon: LayoutDashboard },
    { label: "Student Management", path: "/operations/students", icon: UsersRound },
    { label: "Company Management", path: "/operations/companies", icon: Building2 },
    { label: "Job Openings", path: "/operations/job-openings", icon: BriefcaseBusiness },
    { label: "Applied Students", path: "/operations/applied-students", icon: ClipboardList },
    { label: "Open Link Applications", path: "/operations/open-link-applications", icon: ClipboardList }
  ]
};
