import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisiteCourse } from './course.interface';

const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourse>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    prefix: {
      type: String,
      trim: true,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: [preRequisiteCoursesSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Course = model<TCourse>('Course', courseSchema);
