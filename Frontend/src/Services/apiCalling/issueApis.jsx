import { CreateIssueApi, GetMyIssuesApi, GetRaisedIssuesApi, UpdateIssueStatusApi } from "../apiMethod";
import { asList, mapIssue, unwrapData } from "./apiAdapters";

const handleGetMyIssues = async (params = {}) => asList(await GetMyIssuesApi(params)).map(mapIssue);
const handleGetRaisedIssues = async (params = {}) => asList(await GetRaisedIssuesApi(params)).map(mapIssue);
const handleCreateIssue = async (issue) => mapIssue(unwrapData(await CreateIssueApi(issue), {}));
const handleUpdateIssueStatus = async (id, status) => mapIssue(unwrapData(await UpdateIssueStatusApi(id, { status }), {}));

export { handleGetMyIssues, handleGetRaisedIssues, handleCreateIssue, handleUpdateIssueStatus };
