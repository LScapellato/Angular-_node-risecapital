import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {
  const { username, email, password, nickname , type} = req.body;

  try {
    // Verifico si el usuario existe en la BD
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({
        msg: `El usuario ${username} ya existe`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardamos el usuario
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      nickname,
      type
      
     
      
    });

    res.status(201).json({
      msg: `Usuario ${username} creado exitosamente!`,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al crear usuario',
      error: error,
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Validar si el usuario existe
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({
        msg: `Usuario ${username} no registrado en nuestros datos!`,
      });
    }

    // Validamos la clave
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({
        msg: 'Password incorrecto',
      });
    }

    // Generamos token
    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET_KEY || 'give1246',
      { expiresIn: '1h' }
    );

    res.json({
      msg: 'Login exitoso',
     token,
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Error al iniciar sesión',
      error: error,
    });
  }
};
