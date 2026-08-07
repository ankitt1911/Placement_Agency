const { updateStudentSchema } = require("../validators/opsValidators");
const opsStudentService = require("../services/opsStudentService");

const getStudents = async (req, res) => opsStudentService.fetchGetStudents(req, res);
const getStudentFilterOptions = async (req, res) => opsStudentService.fetchGetStudentFilterOptions(req, res);
const getStudentDetail = async (req, res) => opsStudentService.fetchGetStudentDetail(req, res);
const disableStudent = async (req, res) => opsStudentService.fetchDisableStudent(req, res);
const deleteStudent = async (req, res) => opsStudentService.fetchDeleteStudent(req, res);
const downloadStudentResume = async (req, res) => opsStudentService.fetchDownloadStudentResume(req, res);
const generateStudentResume = async (req, res) => opsStudentService.fetchGenerateStudentResume(req, res);
const exportStudents = async (req, res) => opsStudentService.fetchExportStudents(req, res);

const updateStudent = async (req, res) => {
  const { error } = updateStudentSchema.validate(req.body);
  if (error) return res.status(422).json({ success: false, message: error.details[0].message, statusCode: 422 });
  return opsStudentService.fetchUpdateStudent(req, res);
};

module.exports = { getStudents, getStudentFilterOptions, getStudentDetail, updateStudent, disableStudent, deleteStudent, downloadStudentResume, generateStudentResume, exportStudents };
