// import { ApiError } from "../utils/apierror.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import bcrypt from "bcrypt";
// export { registerUser, loginUser }; 
// const buildBaseUsername = (email, username) => {
//   if (typeof username === "string" && username.trim() !== "") {
//     return username.trim().toLowerCase();
//   }

//   return email
//     .trim()
//     .toLowerCase()
//     .split("@")[0]
//     .replace(/[^a-z0-9_]/g, "_");
// };

// const buildFullname = (fullname, username, email) => {
//   if (typeof fullname === "string" && fullname.trim() !== "") {
//     return fullname.trim();
//   }

//   if (typeof username === "string" && username.trim() !== "") {
//     return username.trim();
//   }

//   return email.trim().split("@")[0];
// };

// const generateUniqueUsername = async (baseUsername) => {
//   let candidate = baseUsername || "user";
//   let suffix = 0;

//   while (await User.findOne({ username: candidate })) {
//     suffix += 1;
//     candidate = `${baseUsername}_${suffix}`;
//   }

//   return candidate;
// };

// const registerUser = asyncHandler(async (req, res) => {
//   const { fullname, email, username, password } = req.body;

//   if (typeof email !== "string" || email.trim() === "") {
//     throw new ApiError(400, "email is required");
//   }

//   if (typeof password !== "string" || password.trim() === "") {
//     throw new ApiError(400, "password is required");
//   }

//   const normalizedEmail = email.trim().toLowerCase();
//   const baseUsername = buildBaseUsername(normalizedEmail, username);
//   const normalizedUsername = await generateUniqueUsername(baseUsername);
//   const normalizedFullname = buildFullname(fullname, username, normalizedEmail);

//   const existingUser = await User.findOne({
//     email: normalizedEmail,
//   });

//   if (existingUser) {
//     throw new ApiError(409, "User already exists with this email");
//   }

//   const newUser = await User.create({
//     fullname: normalizedFullname,
//     email: normalizedEmail,
//     username: normalizedUsername,
//     password: password.trim(),
//   });

//   const createdUser = await User.findById(newUser._id).select("-password");

//   return res
//     .status(201)
//     .json(new ApiResponse(201, createdUser, "User registered successfully"));
// });




// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     throw new ApiError(400, "Email and password required");
//   }

//   const user = await User.findOne({
//     email: email.toLowerCase(),
//   });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   if (!isPasswordValid) {
//     throw new ApiError(401, "Invalid password");
//   }

//   const loggedUser = await User.findById(user._id).select("-password");

//   return res.status(200).json(
//     new ApiResponse(200, loggedUser, "Login successful")
//   );
// });
// export { registerUser };
import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

// -------- helper functions --------

const buildBaseUsername = (email, username) => {
  if (typeof username === "string" && username.trim() !== "") {
    return username.trim().toLowerCase();
  }

  return email
    .trim()
    .toLowerCase()
    .split("@")[0]
    .replace(/[^a-z0-9_]/g, "_");
};

const buildFullname = (fullname, username, email) => {
  if (typeof fullname === "string" && fullname.trim() !== "") {
    return fullname.trim();
  }

  if (typeof username === "string" && username.trim() !== "") {
    return username.trim();
  }

  return email.trim().split("@")[0];
};

const generateUniqueUsername = async (baseUsername) => {
  let candidate = baseUsername || "user";
  let suffix = 0;

  while (await User.findOne({ username: candidate })) {
    suffix += 1;
    candidate = `${baseUsername}_${suffix}`;
  }

  return candidate;
};

// -------- REGISTER --------

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (!email?.trim()) {
    throw new ApiError(400, "email is required");
  }

  if (!password?.trim()) {
    throw new ApiError(400, "password is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const baseUsername = buildBaseUsername(normalizedEmail, username);
  const normalizedUsername = await generateUniqueUsername(baseUsername);
  const normalizedFullname = buildFullname(fullname, username, normalizedEmail);

  const newUser = await User.create({
    fullname: normalizedFullname,
    email: normalizedEmail,
    username: normalizedUsername,
    password: password.trim(),
  });

  const createdUser = await User.findById(newUser._id).select("-password");

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

// -------- LOGIN --------

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password required");
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  user.lastLoginAt = new Date();
  await user.save();

  const loggedUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new ApiResponse(200, loggedUser, "Login successful")
  );
});

// -------- EXPORT (ONLY ONCE) --------

export { registerUser, loginUser };
