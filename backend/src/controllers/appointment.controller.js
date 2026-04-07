import { Appointment } from "../models/appointment.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createAppointment = asyncHandler(async (req, res) => {
  const {
    userName,
    email,
    category,
    service,
    bookingType,
    date,
    time,
    numberOfPeople,
    notes,
    amount,
  } = req.body;

  if (!userName?.trim()) {
    throw new ApiError(400, "userName is required");
  }

  if (!email?.trim()) {
    throw new ApiError(400, "email is required");
  }

  if (!category?.trim()) {
    throw new ApiError(400, "category is required");
  }

  if (!date?.trim() || !time?.trim()) {
    throw new ApiError(400, "date and time are required");
  }

  const parsedPeople = Number(numberOfPeople) || 1;
  const parsedAmount = Number(amount) || 0;

  const appointment = await Appointment.create({
    userName: userName.trim(),
    email: email.trim().toLowerCase(),
    category: category.trim(),
    service: service?.trim() || "",
    bookingType: bookingType?.trim() || "",
    date: date.trim(),
    time: time.trim(),
    numberOfPeople: parsedPeople,
    notes: notes?.trim() || "",
    amount: parsedAmount,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, appointment, "Appointment booked successfully")
    );
});

const getAppointments = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email?.trim()) {
    throw new ApiError(400, "email is required");
  }

  const appointments = await Appointment.find({
    email: email.trim().toLowerCase(),
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments fetched successfully"));
});

const deleteAppointmentsByCategory = asyncHandler(async (req, res) => {
  const { email, category, bookingType } = req.query;

  if (!email?.trim()) {
    throw new ApiError(400, "email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const deleteFilter = {
    email: normalizedEmail,
  };

  if (bookingType?.trim()) {
    deleteFilter.bookingType = bookingType.trim();
  } else if (category?.trim()) {
    deleteFilter.category = category.trim();
  } else {
    throw new ApiError(400, "category or bookingType is required");
  }

  const deleted = await Appointment.deleteMany(deleteFilter);

  return res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: deleted.deletedCount || 0 },
      "Appointments removed successfully"
    )
  );
});

export { createAppointment, getAppointments, deleteAppointmentsByCategory };
