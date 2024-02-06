export interface IUser{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  isSubscribe: boolean;
  gender: string;
  status: string;
  securityQuestions: SecurityQuestion[];
  profilePicture: string;
};

interface SecurityQuestion{
  question :string;
  answer: string;
}