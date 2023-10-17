import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken = req.headers["authorization"];

  //tiene token
  if (headerToken != undefined && headerToken.startsWith("Bearer ")) {
    //extraigo el token para comparar

    try {
      const bearerToken = headerToken.slice(7);

      // valido el token
      jwt.verify(bearerToken, process.env.SECRET_KEY || "give1246");

      next();
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido'})
    }
  } else {
    res.status(401).json({
      msg: "Acceso Denegado",
    });
  }
};

export default validateToken;
