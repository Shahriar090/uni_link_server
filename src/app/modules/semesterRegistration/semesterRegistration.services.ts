import AppError from '../../errors/appError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import httpStatus from 'http-status-codes';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { registrationStatus } from './semesterRegistration.constants';
// create
const createSemesterRegistrationIntoDb = async (
  payload: TSemesterRegistration,
) => {
  // check if there any registered semester that is already upcoming or ongoing
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There Is Already An ${isThereAnyUpcomingOrOngoingSemester.status} Registered Semester!`,
      '',
    );
  }

  // check if the semester already exist
  const academicSemester = payload?.academicSemester;

  const isAcademicSemesterExist =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Academic Semester Found', '');
  }

  // check if the semester already register before

  const isSemesterRegistrationExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Semester Is Already Registered',
      '',
    );
  }

  // creating new semester
  const result = await SemesterRegistration.create(payload);
  return result;
};

// get all
const getAllSemesterRegistrationFromDb = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .sort()
    .filter()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

// get single
const getSingleSemesterRegistrationFromDb = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

// update
const updateSemesterRegistrationIntoDb = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // checking is semester registration exist or not
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Semester Found', '');
  }

  // if the requested semester registration is already ended, nothing will be updated

  const currentSemesterStatus = isSemesterRegistrationExist?.status;
  if (currentSemesterStatus === registrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This Semester Is Already ${currentSemesterStatus}`,
      '',
    );
  }

  // Status Updating Flow => UPCOMING => ONGOING => ENDED

  // preventing update upcoming to ended
  const requestedStatus = payload?.status;
  if (
    currentSemesterStatus === registrationStatus.UPCOMING &&
    requestedStatus === registrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Cannot Update Status Directly ${currentSemesterStatus} To ${requestedStatus}`,
      '',
    );
  }

  // preventing update ongoing to upcoming
  if (
    currentSemesterStatus === registrationStatus.ONGOING &&
    requestedStatus === registrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You Cannot Update Status Directly ${currentSemesterStatus} To ${requestedStatus}`,
      '',
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegistrationIntoDb,
  getAllSemesterRegistrationFromDb,
  getSingleSemesterRegistrationFromDb,
  updateSemesterRegistrationIntoDb,
};
