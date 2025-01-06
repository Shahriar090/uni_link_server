import { Model } from 'mongoose';
import { USER_ROLES } from './user.constant';

export interface IUser {
  id: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  needsPasswordChange: boolean;
  role: 'Super_Admin' | 'Admin' | 'Faculty' | 'Student';
  status: 'In-Progress' | 'Blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByCustomId(id: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChange(
    passwordChangedTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): boolean;
}

export type TUserRoles = keyof typeof USER_ROLES;
