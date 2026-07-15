import { DeleteStudentApi, DisableStudentApi, DownloadResumeApi, EditStudentApi, ExportStudentsExcelApi, GetStudentFilterOptionsApi, GetStudentsApi } from "../apiMethod";
import { asList, mapProfileToApi, mapStudent, unwrapBlob, unwrapData, unwrapFilterOptions } from "./apiAdapters";

const handleGetStudents = async (params = {}) => asList(await GetStudentsApi(params)).map(mapStudent);
const handleGetStudentFilterOptions = async () => unwrapFilterOptions(await GetStudentFilterOptionsApi());
const handleEditStudent = async (student) => mapStudent(unwrapData(await EditStudentApi(student.id, mapProfileToApi(student)), student));
const handleDisableStudent = async (id) => mapStudent(unwrapData(await DisableStudentApi(id), {}));
const handleDeleteStudent = async (id) => DeleteStudentApi(id);
const handleDownloadResume = async (student) => unwrapBlob(await DownloadResumeApi(student.id));
const handleExportStudentsExcel = async (params = {}) => unwrapBlob(await ExportStudentsExcelApi(params));

export { handleGetStudents, handleGetStudentFilterOptions, handleEditStudent, handleDisableStudent, handleDeleteStudent, handleDownloadResume, handleExportStudentsExcel };
