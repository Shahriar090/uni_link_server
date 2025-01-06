import { model, Schema } from 'mongoose';
import { FacultyModel, TFaculty, TUserName } from './faculty.interface';
import { BloodGroup, Gender } from './faculty.constant';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name Is Required'],
    trim: true,
    maxlength: [20, 'Name Cannot Be More Than 20 Characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name Is Required'],
    trim: true,
    maxlength: [20, 'Name Cannot Be More Than 20 Characters'],
  },
});

const facultySchema = new Schema<TFaculty, FacultyModel>(
  {
    id: {
      type: String,
      required: [true, 'ID Is Required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID Required'],
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
      required: [true, 'Permanent Address Id Required'],
    },
    profileImage: { type: String, default: '' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

// generating full name
facultySchema.virtual('fullName').get(function () {
  return (
    this?.name?.firstName +
    '' +
    this?.name?.middleName +
    '' +
    this?.name?.lastName
  );
});

// filter out deleted documents
facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

facultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// checking if the user already exist
facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser;
};

// model
const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);

export default Faculty;
