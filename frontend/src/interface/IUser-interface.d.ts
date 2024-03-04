interface IUser{
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
  walletCredits: number;
  phoneNumber: string;
  address: string;
};

interface SecurityQuestion{
  question :string;
  answer: string;
}

interface ISearchHistory{
  User: IUser;
  searchTerm: string;
  searchDate: Date;
}