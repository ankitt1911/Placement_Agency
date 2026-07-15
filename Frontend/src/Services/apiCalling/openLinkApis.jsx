import { ApplyViaOpenLinkApi, GetOpenLinkOpeningApi } from "../apiMethod";
import { mapJob, unwrapData } from "./apiAdapters";

const handleGetOpenLinkOpening = async (id) => mapJob(unwrapData(await GetOpenLinkOpeningApi(id), {}));
const handleApplyViaOpenLink = async (id, payload) => unwrapData(await ApplyViaOpenLinkApi(id, payload), {});

export { handleGetOpenLinkOpening, handleApplyViaOpenLink };
