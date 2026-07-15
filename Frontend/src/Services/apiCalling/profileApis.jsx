import { GetProfileApi, UpdateProfileApi, UploadProfilePhotoApi, UploadResumeApi } from "../apiMethod";
import { mapProfileToApi, mapProfileToUi, unwrapData } from "./apiAdapters";

const handleGetProfile = async () => {
  try {
    const response = await GetProfileApi();
    return mapProfileToUi(unwrapData(response, {}));
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

const handleUpdateProfile = async (params) => {
  try {
    const response = await UpdateProfileApi(mapProfileToApi(params));
    return mapProfileToUi(unwrapData(response, mapProfileToApi(params)));
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
};

const handleUploadResume = async (file) => {
  const formData = new globalThis.FormData();
  formData.append("resume", file);
  return unwrapData(await UploadResumeApi(formData), {});
};

const handleUploadProfilePhoto = async (file) => {
  const formData = new globalThis.FormData();
  formData.append("photo", file);
  return unwrapData(await UploadProfilePhotoApi(formData), {});
};

export { handleGetProfile, handleUpdateProfile, handleUploadResume, handleUploadProfilePhoto };
