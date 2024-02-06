import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";

export const uploadImage = async (filename : any, photo : any) => {
  const photoRef = ref(storage, filename);
  
  await uploadBytes(photoRef, photo);
  const downloadURL = await getDownloadURL(photoRef);
  return downloadURL;

}
const currentDate = new Date();

export const rules = {
  'name' : {
    required: 'required*',
    minLength: { value: 5, message: 'Name must be at least 5 characters.' },
    pattern: { value: /^[A-Za-z ]+$/, message: 'Name must contain only letters and spaces.' }
  },
  email: {
    required: 'required*',
    pattern: {
      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Invalid email format. Example: hans.indrawan@gmail.com',
    },
  },
  dob: {
    required: 'required*',
    validate: (value: string) => {
      const dob = new Date(value);
      
      if (isNaN(dob.getTime())) {
        return 'Invalid date format.';
      }

      const age = currentDate.getFullYear() - dob.getFullYear();

      if (age < 13) {
        return 'You must be at least 13 years old.';
      }

      return true;
    },
  },
  gender: {
    required: 'Please select your gender.',
  },
  password: {
    required: 'required*',
    minLength: { value: 8, message: 'Password must be at least 8 characters.' },
    validate: (value : any) => {
      const requirementsRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?[\]\\|]).*$/;

      if (requirementsRegex.test(value)) {
        return true;
      }

      return 'Password must include capital letters, lowercase letters, numbers, and special symbols.';
    },
  },
  profilePicture:{

  }
} 
