import { useState } from "react";
import { handleBulkChangeApplicantStatus, handleChangeApplicantStatus, handleExportApplicantsExcel, handleGenerateApplicantResume, handleGetApplicantFilterOptions, handleGetApplicants } from "../../../Services/apiCalling/appliedStudentsApis";
import { resumeFileName } from "../../../Utlis/Common/commonMethod";
import { ErrorMessage, SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import ResumePreviewModal from "../../modal/resumePreviewModal";
import ScheduleInterviewModal from "../interviews/scheduleInterviewModal";
import OperationsList from "../shared/OperationsList";
import AppliedStudentDetails from "./appliedStudentDetails";

const appliedStudentExportColumns = [
  { key: "student", label: "Student" },
  { key: "email", label: "Email" },
  { key: "company", label: "Company" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
  { key: "appliedAt", label: "Applied At" },
  { key: "appliedFromOpenLink", label: "Applied From Open Link" },
  { key: "resumeUsed", label: "Resume Used" },
  { key: "updatedBy", label: "Updated By" },
  { key: "notes", label: "Notes" },
  { key: "createdAt", label: "Application Created At" },
  { key: "updatedAt", label: "Application Updated At" },
  { key: "studentProfile.dob", label: "Date of Birth" },
  { key: "studentProfile.gender", label: "Gender" },
  { key: "studentProfile.mobile", label: "Mobile" },
  { key: "studentProfile.address", label: "Address" },
  { key: "studentProfile.profilePhoto", label: "Profile Photo" },
  { key: "studentProfile.education.tenth.percentage", label: "10th Percentage" },
  { key: "studentProfile.education.tenth.year", label: "10th Year" },
  { key: "studentProfile.education.tenth.board", label: "10th Board" },
  { key: "studentProfile.education.twelfth.percentage", label: "12th Percentage" },
  { key: "studentProfile.education.twelfth.year", label: "12th Year" },
  { key: "studentProfile.education.twelfth.board", label: "12th Board" },
  { key: "studentProfile.education.diploma.college", label: "Diploma College" },
  { key: "studentProfile.education.diploma.university", label: "Diploma University" },
  { key: "studentProfile.education.diploma.branch", label: "Diploma Branch" },
  { key: "studentProfile.education.diploma.cgpa", label: "Diploma CGPA" },
  { key: "studentProfile.education.diploma.passingYear", label: "Diploma Passing Year" },
  { key: "studentProfile.education.graduation.college", label: "Graduation College" },
  { key: "studentProfile.education.graduation.university", label: "Graduation University" },
  { key: "studentProfile.education.graduation.branch", label: "Graduation Branch" },
  { key: "studentProfile.education.graduation.cgpa", label: "Graduation CGPA" },
  { key: "studentProfile.education.graduation.passingYear", label: "Graduation Passing Year" },
  { key: "studentProfile.education.postGraduation.college", label: "Post Graduation College" },
  { key: "studentProfile.education.postGraduation.university", label: "Post Graduation University" },
  { key: "studentProfile.education.postGraduation.branch", label: "Post Graduation Branch" },
  { key: "studentProfile.education.postGraduation.cgpa", label: "Post Graduation CGPA" },
  { key: "studentProfile.education.postGraduation.passingYear", label: "Post Graduation Passing Year" },
  { key: "studentProfile.academicDetails.college", label: "College" },
  { key: "studentProfile.academicDetails.university", label: "University" },
  { key: "studentProfile.academicDetails.branch", label: "Branch" },
  { key: "studentProfile.academicDetails.cgpa", label: "CGPA" },
  { key: "studentProfile.academicDetails.percentage", label: "Percentage" },
  { key: "studentProfile.academicDetails.passingYear", label: "Passing Year" },
  { key: "studentProfile.academicDetails.placementEligibility", label: "Placement Eligibility" },
  { key: "studentProfile.academicDetails.activeBacklogs", label: "Active Backlogs" },
  { key: "studentProfile.academicDetails.totalBacklogs", label: "Total Backlogs" },
  { key: "studentProfile.technicalSkills", label: "Technical Skills" },
  { key: "studentProfile.softSkills", label: "Soft Skills" },
  { key: "studentProfile.languages", label: "Languages" },
  { key: "studentProfile.projects", label: "Projects" },
  { key: "studentProfile.internships", label: "Internships" },
  { key: "studentProfile.achievements", label: "Achievements" },
  { key: "studentProfile.certifications", label: "Certifications" },
  { key: "studentProfile.resume", label: "Resume" },
  { key: "studentProfile.socialLinks.github", label: "Github" },
  { key: "studentProfile.socialLinks.linkedin", label: "LinkedIn" },
  { key: "studentProfile.socialLinks.portfolio", label: "Portfolio" },
  { key: "studentProfile.preferredLocation", label: "Preferred Location" },
  { key: "studentProfile.expectedSalary", label: "Expected Salary" },
  { key: "studentProfile.currentStatus", label: "Current Student Status" },
  { key: "studentProfile.subscriptionStatus", label: "Subscription Status" },
  { key: "studentProfile.createdAt", label: "Student Profile Created At" },
  { key: "studentProfile.updatedAt", label: "Student Profile Updated At" },
];

// Withdrawn is student-owned, so ops can neither restatus nor schedule those.
const isActionable = (row) => row.status !== "Withdrawn";

// The server can skip part of a batch (already at that status, withdrawn, gone),
// so name the first few skips rather than silently reporting a smaller count.
const reportSkipped = (rows, skipped) => {
  if (!skipped.length) return;
  const nameById = new Map(rows.map((row) => [String(row.id), row.student || "Applicant"]));
  const detail = skipped.slice(0, 3).map((item) => `${nameById.get(String(item.application)) || "Applicant"} (${item.reason})`).join(", ");
  ErrorMessage(`${skipped.length} skipped: ${detail}${skipped.length > 3 ? "…" : ""}`);
};

const bulkStatusAction = (label, status) => ({
  label,
  message: (rows) => `${label} ${rows.length} applicant${rows.length === 1 ? "" : "s"}?`,
  run: async (rows) => {
    const result = await handleBulkChangeApplicantStatus(rows.map((row) => row.id), status);
    reportSkipped(rows, result.skipped);
    return result;
  },
  update: (items, rows, result) => {
    const updatedIds = new Set(result.data.map((item) => item.id));
    return items.map((item) => updatedIds.has(item.id) ? { ...item, status } : item);
  },
  success: (result) => `${result.updated} applicant${result.updated === 1 ? "" : "s"} ${status.toLowerCase()}`,
  disabled: (rows) => rows.every((row) => row.status === status)
});

export default function AppliedStudents({ openLinkOnly = false }) {
  // `scheduling` holds the applications the modal is opened for: one row for the
  // per-row action, the checked rows for the bulk action.
  const [scheduling, setScheduling] = useState(null);
  const [afterSchedule, setAfterSchedule] = useState(null);
  // The resume is generated from the applicant's profile on demand, so the row
  // only has to say who to build it for; the modal owns fetching and previewing.
  const [resumeTarget, setResumeTarget] = useState(null);
  const statusAction = (label, status) => ({
    label,
    message: (row) => `${label} ${row.student}?`,
    run: (row) => handleChangeApplicantStatus(row.id, status),
    update: (rows, row) => rows.map((item) => item.id === row.id ? { ...item, status } : item),
    success: `Applicant ${status.toLowerCase()}`,
    disabled: (row) => row.status === status
  });
  return (
    <>
      <OperationsList
        title={openLinkOnly ? "Open Link Applications" : "Applied Students"}
        searchPlaceholder="Search applicant, company, role, college, skills"
        fetchItems={(params) => handleGetApplicants(openLinkOnly ? { ...params, appliedFromOpenLink: true } : params)}
        fetchFilterOptions={() => handleGetApplicantFilterOptions(openLinkOnly ? { appliedFromOpenLink: true } : {})}
        searchKeys={["student", "company", "role", "college", "skills"]}
        primaryText={(row) => row.student || "Applicant"}
        primaryMeta={(row) => row.role}
        columns={[{ key: "student", label: "Student" }, { key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "college", label: "College" }, { key: "location", label: "Location" }, { key: "cgpa", label: "CGPA" }, { key: "skills", label: "Skills" }, { key: "backlogs", label: "Backlogs" }, { key: "status", label: "Status" }]}
        filterConfig={[{ key: "company", label: "Company" }, { key: "role", label: "Role" }, { key: "college", label: "College" }, { key: "status", label: "Status" }, { key: "location", label: "Location" }]}
        statusActions={[
          statusAction("Reject", "Rejected"),
          statusAction("Shortlist", "Shortlisted"),
          statusAction("Select", "Selected"),
          { label: "Schedule Interview", onClick: (row, setItems, loadItems) => { setScheduling([row]); setAfterSchedule(() => () => loadItems()); }, disabled: (row) => !isActionable(row) },
          {
            label: "Resume",
            onClick: (row) => setResumeTarget({
              key: row.id,
              title: row.student || "Applicant",
              subtitle: [row.role, row.company].filter(Boolean).join(" • ") || "Review the generated resume before downloading.",
              fileName: resumeFileName(row.student),
              load: () => handleGenerateApplicantResume(row.id)
            })
          }
        ]}
        selectable
        selectableWhen={isActionable}
        bulkActions={[
          bulkStatusAction("Reject", "Rejected"),
          bulkStatusAction("Shortlist", "Shortlisted"),
          bulkStatusAction("Select", "Selected"),
          {
            label: "Schedule Interview",
            onClick: (rows, { clearSelection, reload }) => {
              setScheduling(rows);
              setAfterSchedule(() => () => { clearSelection(); reload(); });
            }
          }
        ]}
        exportAction={(params) => handleExportApplicantsExcel(openLinkOnly ? { ...params, appliedFromOpenLink: true } : params)}
        exportColumns={appliedStudentExportColumns}
        hiddenListKeys={["student", "role"]}
        detailContent={(row) => <AppliedStudentDetails application={row} />}
        rowDetail={(row) => row ? Object.entries(row).map(([key, value]) => <p key={key}><b>{key}:</b> {String(value)}</p>) : null}
      />
      <ScheduleInterviewModal
        open={Boolean(scheduling && scheduling.length)}
        applications={scheduling || []}
        onClose={() => { setScheduling(null); setAfterSchedule(null); }}
        onSaved={() => afterSchedule?.()}
      />
      <ResumePreviewModal
        target={resumeTarget}
        onClose={() => setResumeTarget(null)}
        onDownloaded={() => SuccessMessage("Resume downloaded")}
      />
    </>
  );
}
