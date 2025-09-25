import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response } from "express";
import { generateFamilyId } from "../utils/generateFamilyId";


// ============================
// Create a new user
// ============================

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password, dateOfBirth } = req.body;

    if (!password) return res.status(400).json({ error: "Password is required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // generate family ID for the user
    const familyId = generateFamilyId(firstName);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      dateOfBirth,
      familyId,
    });

    // issue JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, familyId },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        familyId: user.familyId,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `"Server error" - ${err}` });
  }
};


// ============================
// Login
// ============================
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Password Wrong" });

    const token = jwt.sign(
      { id: user._id, email: user.email,role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Get current user (/me)
// ============================
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    // req.user is set by auth middleware
    const getUser = await User.findById(user.id).select("-passwordHash");
    if (!getUser) return res.status(404).json({ error: "User not found" });

    res.json(getUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, passwordHash, dateOfBirth } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      passwordHash, // already hashed in service/middleware
      dateOfBirth,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Get all users
// ============================
export const getUsers =async (req: Request, res: Response) =>{
  try {
    const users = await User.find().select("-passwordHash"); // exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Get one user by ID
// ============================
export const getUserById = async (req: Request, res: Response) =>{
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Update user
// ============================
export const updateUser = async (req: Request, res: Response) =>{
  try {
    const { id } = req.params;
    const updates = req.body;

    // do not allow direct password update here for security
    delete updates.passwordHash;

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Delete user
// ============================
export const deleteUser = async (req: Request, res: Response) =>{
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Add a family member
// ============================
export const addFamilyMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // userId
    const membersData = req.body; // expect an array of family members

    if (!Array.isArray(membersData)) {
      return res.status(400).json({ error: "Request body must be an array of family members" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // add multiple members at once
    user.family.push(...membersData);
    await user.save();

    res.status(201).json(user.family); // return newly added members
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// ============================
// Update a family member
// ============================
export const updateFamilyMember = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;
    const updates = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const member = user.family.id(memberId);
    if (!member) return res.status(404).json({ error: "Family member not found" });

    Object.assign(member, updates);
    await user.save();

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================
// Delete a family member
// ============================
export const deleteFamilyMember = async (req: Request, res: Response) => {
  try {
    const { id, memberId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const member = user.family.id(memberId);
    if (!member) return res.status(404).json({ error: "Family member not found" });

    user.family.pull({ _id: memberId });
    await user.save();

    res.json({ message: "Family member deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
