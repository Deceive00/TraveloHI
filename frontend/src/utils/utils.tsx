import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";

export const uploadImage = async (filename : any, photo : any) => {
  console.log(filename, photo);
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


export const promoRules = {
  promotionName: {
    required: "required*",
  },
  promotionPercentage: {
    required: "Percentage is required",
    min: {
      value: 1,
      message: "Percentage must be at least 1",
    },
    max: {
      value: 100,
      message: "Percentage cannot exceed 100",
    },
    pattern: {
      value: /^[1-9]\d*$/,
      message: "Percentage must be a positive integer",
    },
  },
  startDate: {
    required: "required*",
    validate: {
      greaterThanNow: (value : any) => {
        const today = new Date();
        if (value < today) {
          return 'Start date must be after today';
        }
      },
    },
  },
  endDate: {
    required: "required*",
    validate: {
      greaterThanNow: (value : any) => {
        const today = new Date();
        if (value < today) {
          return 'Start date must be after today';
        }
      },
    },
  },
  promotionCode: {
    required: "required*",
  },
  promotionType: {
    required: "required*",
    validate: {
      validType: (value: string) =>
        value === "Hotel" ||
        value === "Flight" ||
        "Promotion type must be either 'Hotel' or 'Flight'",
    },
  },
};