import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import  jwt  from "jsonwebtoken"

export const newUser = async (req: Request, res: Response) => {
  //extraigo el body de request
  const { username, password } = req.body;

  //verifico si el usuario existe en la bd

  const user = await User.findOne({ where: { username: username } });

  if (user) {
    return res.status(400).json({
      message: `El usuario ${username} ya existe`,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //guardamos el usuario
    await User.create({
      username: username,
      password: hashedPassword,
    });
    res.json({
      msg: `Usuario ${username} creado exitosamente!`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Error al crear usuario",
      error: error,
    });
  }
};

export const loginUser  = async (req: Request, res: Response) => {
  const { username, password } = req.body;

    // primer paso Validar si el usuario existe
    const user: any = await User.findOne({ where: { username: username } });

    if(!user) {
        return res.status(400).json({
            msg: `Usuario ${username} No registrado en nuestros datos!`,
      

        })
    }
    // Validamos la clave
   const passwordValid = await bcrypt.compare(password, user.password);
   if (!passwordValid) {
    return res.status(400).json({
      msg: 'Password Incorrecto'
    })

   }
    //Generamos token
     const token = jwt.sign({
        username: username
      },process.env.SECRET_KEY || 'give1246', {expiresIn: '50000'});

  res.json(token);
};
