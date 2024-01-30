import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";

export const uploadImage = async (filename : any, photo : any) => {
  const photoRef = ref(storage, filename);
  
  await uploadBytes(photoRef, photo);
  const downloadURL = await getDownloadURL(photoRef);
  return downloadURL;

}