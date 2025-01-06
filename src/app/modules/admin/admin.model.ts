import { model, Schema } from 'mongoose';
import { AdminModel, TAdmin, TUserName } from './admin.interface';
import { BloodGroup, Gender } from './admin.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name Is Required'],
    trim: true,
    maxlength: [20, 'User Name Cannot Be More Than 20 Characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name Is Required'],
    trim: true,
    maxlength: [20, 'User Name Cannot Be More Than 20 Characters'],
  },
});

const adminSchema = new Schema<TAdmin, AdminModel>(
  {
    id: {
      type: String,
      required: [true, 'Id Is Required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User Id Is Required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation Is Required'],
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name Is Required'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} Is Not A Valid Gender',
      },
      required: [true, 'Gender Is Required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email Is Required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact No Is Required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact No Is Required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} Is Not A Valid Blood Group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address Is Required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address Is Required'],
    },
    profileImage: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

// generating full name
adminSchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    '' +
    this?.name?.middleName +
    '' +
    this?.name?.lastName
  );
});

// filter out deleted document
adminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

adminSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// checking if the user already exist
adminSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Admin.findOne({ id });
  return existingUser;
};

export const Admin = model<TAdmin, AdminModel>('Admin', adminSchema);
