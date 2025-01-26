import bcrypt from 'bcrypt';
import User from '../models/User.js';

const createUser = async (req, res) => {
  try {
    const {
      username, password, role, status,
    } = req.body;
    if (!username || !password || !role || !status) {
      return res
        .status(400)
        .json({ message: 'All fields are required: name, username, password, role!' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
      status,
    });
    return res
      .status(201)
      .json({
        message: 'User created successfully',
        user,
      });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.message.includes('duplicate key')) {
      return res
        .status(400)
        .json({ message: 'User already exists' });
    }

    return res
      .status(500)
      .json({
        message: 'Error creating user',
        error: error.message,
      });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res
      .status(200)
      .json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to retrieve users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      username, password, role, status,
    } = req.body;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.findByPk(req.params.id);
    if (user) {
      user.username = username || user.username;
      user.password = hashedPassword || user.password;
      user.role = role || user.role;
      user.status = status || user.status;
      await user.save();
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ error: 'User not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to update user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res
        .status(200)
        .json({ message: 'User deleted' });
    } else {
      res
        .status(404)
        .json({ error: 'User not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to delete user' });
  }
};

export {
  createUser, getUsers, getUserById, updateUser, deleteUser,
};
