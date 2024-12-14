import { Model } from 'mongoose';

export interface IUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'Admin' | 'Faculty' | 'Student';
  status: 'In-Progress' | 'Blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByCustomId(id: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
