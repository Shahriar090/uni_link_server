export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'Admin' | 'Faculty' | 'Student';
  status: 'In-Progress' | 'Blocked';
  isDeleted: boolean;
};
