import { CreateBroadcastApi, DeleteBroadcastApi, GetActiveBroadcastsApi, GetBroadcastsApi, ToggleBroadcastApi, UpdateBroadcastApi } from "../apiMethod";
import { asList, mapBroadcast, unwrapData } from "./apiAdapters";

const handleGetActiveBroadcasts = async () => asList(await GetActiveBroadcastsApi()).map(mapBroadcast);
const handleGetBroadcasts = async (params = {}) => asList(await GetBroadcastsApi(params)).map(mapBroadcast);
const handleCreateBroadcast = async (payload) => mapBroadcast(unwrapData(await CreateBroadcastApi(payload), {}));
const handleUpdateBroadcast = async (id, payload) => mapBroadcast(unwrapData(await UpdateBroadcastApi(id, payload), {}));
const handleToggleBroadcast = async (id) => mapBroadcast(unwrapData(await ToggleBroadcastApi(id), {}));
const handleDeleteBroadcast = async (id) => DeleteBroadcastApi(id);

export { handleGetActiveBroadcasts, handleGetBroadcasts, handleCreateBroadcast, handleUpdateBroadcast, handleToggleBroadcast, handleDeleteBroadcast };
