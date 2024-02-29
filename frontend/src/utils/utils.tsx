import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase/firebase-config";
import axios, { AxiosError } from "axios";

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

export const getAllData = async (url : string, setData : any, setLoading? : any,  showSnackbar? : any, key?: any) => {
  try {
    if(setLoading){
      setLoading(true);
    }
    const response = await axios.get(
      `http://localhost:8080/api${url}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      let extractedData = response.data;
      if (key) {
        extractedData = response.data[key];
      }
      setData(extractedData);
      console.log(extractedData)
    }

    if(setLoading){
      setLoading(false);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const responseData = axiosError.response?.data;
      if (
        typeof responseData === "object" &&
        responseData !== null &&
        "error" in responseData
      ) {
        if(showSnackbar){
          showSnackbar(responseData.error as string, "error");
        }
        console.error(responseData.error)
      }
    }
  } finally {
    if(setLoading){
      setLoading(false);
    }
  }
}

export const getMinimumPrice = (rooms: Room[]) => {
  let minPrice = 9999999999999;
  rooms.forEach((room) => {
    if (room.roomPrice < minPrice) {
      minPrice = room.roomPrice;
    }
  });
  return minPrice;
};
export const getMaximumPrice = (rooms: Room[]) => {
  let maxPrice = -1;
  rooms.forEach((room) => {
    if (room.roomPrice > maxPrice) {
      maxPrice = room.roomPrice;
    }
  });
  return maxPrice;
};