import mongoose from "mongoose";
import User from "../models/User.js";

// Small helper to check if a route param is a valid MongoDB ObjectId
// before we even query the database.
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// CREATE — POST /api/users
export async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are all required."
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user
    });
  } catch (error) {
    next(error); // duplicate email (11000) is handled in the error middleware
  }
}

// READ ALL — GET /api/users
export async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
}

// READ ONE — GET /api/users/:id
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id format."
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${id}.`
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

// UPDATE — PUT /api/users/:id
export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id format."
      });
    }

    // runValidators re-applies schema rules (e.g. required, minlength) on update
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${id}.`
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user
    });
  } catch (error) {
    next(error);
  }
}

// DELETE — DELETE /api/users/:id
export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id format."
      });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `No user found with id ${id}.`
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      data: user
    });
  } catch (error) {
    next(error);
  }
}
