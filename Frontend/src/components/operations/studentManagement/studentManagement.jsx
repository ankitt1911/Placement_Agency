import { useState } from "react";
import { handleDeleteStudent, handleDisableStudent, handleExportStudentsExcel, handleGenerateStudentResume, handleGetStudentFilterOptions, handleGetStudents } from "../../../Services/apiCalling/studentManagementApis";
import { resumeFileName } from "../../../Utlis/Common/commonMethod";
import { SuccessMessage } from "../../../Utlis/Toastify/ToastMessage";
import ResumePreviewModal from "../../modal/resumePreviewModal";
import OperationsList from "../shared/OperationsList";
import StudentDetails from "./studentDetails";

const studentExportColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "mobile", label: "Mobile" },
  { key: "address", label: "Address" },
  { key: "profilePhoto", label: "Profile Photo" },
  { key: "education.tenth.percentage", label: "10th Percentage" },
  { key: "education.tenth.year", label: "10th Year" },
  { key: "education.tenth.board", label: "10th Board" },
  { key: "education.twelfth.percentage", label: "12th Percentage" },
  { key: "education.twelfth.year", label: "12th Year" },
  { key: "education.twelfth.board", label: "12th Board" },
  { key: "education.diploma.college", label: "Diploma College" },
  { key: "education.diploma.university", label: "Diploma University" },
  { key: "education.diploma.branch", label: "Diploma Branch" },
  { key: "education.diploma.cgpa", label: "Diploma CGPA" },
  { key: "education.diploma.passingYear", label: "Diploma Passing Year" },
  { key: "education.graduation.college", label: "Graduation College" },
  { key: "education.graduation.university", label: "Graduation University" },
  { key: "education.graduation.branch", label: "Graduation Branch" },
  { key: "education.graduation.cgpa", label: "Graduation CGPA" },
  { key: "education.graduation.passingYear", label: "Graduation Passing Year" },
  { key: "education.postGraduation.college", label: "Post Graduation College" },
  { key: "education.postGraduation.university", label: "Post Graduation University" },
  { key: "education.postGraduation.branch", label: "Post Graduation Branch" },
  { key: "education.postGraduation.cgpa", label: "Post Graduation CGPA" },
  { key: "education.postGraduation.passingYear", label: "Post Graduation Passing Year" },
  { key: "academicDetails.college", label: "College" },
  { key: "academicDetails.university", label: "University" },
  { key: "academicDetails.branch", label: "Branch" },
  { key: "academicDetails.cgpa", label: "CGPA" },
  { key: "academicDetails.percentage", label: "Percentage" },
  { key: "academicDetails.passingYear", label: "Passing Year" },
  { key: "academicDetails.placementEligibility", label: "Placement Eligibility" },
  { key: "academicDetails.activeBacklogs", label: "Active Backlogs" },
  { key: "academicDetails.totalBacklogs", label: "Total Backlogs" },
  { key: "technicalSkills", label: "Technical Skills" },
  { key: "softSkills", label: "Soft Skills" },
  { key: "languages", label: "Languages" },
  { key: "projects", label: "Projects" },
  { key: "internships", label: "Internships" },
  { key: "achievements", label: "Achievements" },
  { key: "certifications", label: "Certifications" },
  { key: "resume", label: "Resume" },
  { key: "socialLinks.github", label: "Github" },
  { key: "socialLinks.linkedin", label: "LinkedIn" },
  { key: "socialLinks.portfolio", label: "Portfolio" },
  { key: "preferredLocation", label: "Preferred Location" },
  { key: "expectedSalary", label: "Expected Salary" },
  { key: "currentStatus", label: "Current Status" },
  { key: "subscriptionStatus", label: "Subscription Status" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
];

export default function StudentManagement() {
  // The resume is generated from the profile on demand, so the row only has to
  // say who to build it for; the modal owns fetching and previewing.
  const [resumeTarget, setResumeTarget] = useState(null);
  return (
    <>
      <OperationsList
        title="Student Management"
        searchPlaceholder="Search students, email, college, skills"
        fetchItems={handleGetStudents}
        fetchFilterOptions={handleGetStudentFilterOptions}
        searchKeys={["name", "email", "mobile", "college", "skills"]}
        columns={[{ key: "name", label: "Student" }, { key: "college", label: "College" }, { key: "branch", label: "Branch" }, { key: "cgpa", label: "CGPA" }, { key: "location", label: "Location" }, { key: "skills", label: "Skills" }, { key: "passingYear", label: "Passing Year" }, { key: "status", label: "Status" }]}
        filterConfig={[{ key: "college", label: "College" }, { key: "branch", label: "Branch" }, { key: "passingYear", label: "Year of Passing" }, { key: "qualification", label: "Qualification" }]}
        statusActions={[
          { label: (row) => row.status === "Disabled" ? "Enable" : "Disable", message: (row) => `${row.status === "Disabled" ? "Enable" : "Disable"} ${row.name}?`, run: (row) => handleDisableStudent(row.id), update: (rows, row, updated) => rows.map((item) => item.id === row.id ? { ...item, ...(updated?.id ? updated : {}), status: row.status === "Disabled" ? "Active" : "Disabled" } : item), success: (row) => row.status === "Disabled" ? "Student enabled" : "Student disabled" },
          {
            label: "Resume",
            onClick: (row) => setResumeTarget({
              key: row.id,
              title: row.name || "Student",
              subtitle: [row.college, row.branch].filter(Boolean).join(" • ") || "Review the generated resume before downloading.",
              fileName: resumeFileName(row.name),
              load: () => handleGenerateStudentResume(row.id)
            })
          }
        ]}
        deleteAction={{ run: (row) => handleDeleteStudent(row.id) }}
        exportAction={handleExportStudentsExcel}
        exportColumns={studentExportColumns}
        showIdChip={false}
        showProgressBar={false}
        hiddenListKeys={["name", "college", "cgpa", "passingYear"]}
        detailContent={(row) => <StudentDetails student={row} />}
        rowDetail={(row) => row ? Object.entries(row).map(([key, value]) => <p key={key}><b>{key}:</b> {String(value)}</p>) : null}
      />
      <ResumePreviewModal
        target={resumeTarget}
        onClose={() => setResumeTarget(null)}
        onDownloaded={() => SuccessMessage("Resume downloaded")}
      />
    </>
  );
}
