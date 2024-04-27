import firebaseApp from '@/config/firebase-config';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';

export const uploadImageToFirebaseAndReturnURL = async (file: File) => {
    try {
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `profile-pictures/${file.name}`);
        const UploadResponse = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(UploadResponse.ref);
        return downloadURL;

    } catch (error: any) {
        throw new Error(error.message);
    }
}