export interface IUser{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: string;
  status: string;
  securityQuestions: SecurityQuestion[];
  profilePicture: string;
};

interface SecurityQuestion{
  question :string;
  answer: string;
}