"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const headerToken = req.headers["authorization"];
    //tiene token
    if (headerToken != undefined && headerToken.startsWith("Bearer ")) {
        //extraigo el token para comparar
        try {
            const bearerToken = headerToken.slice(7);
            // valido el token
            jsonwebtoken_1.default.verify(bearerToken, process.env.SECRET_KEY || "give1246");
            next();
        }
        catch (error) {
            res.status(401).json({ msg: 'Token inválido' });
        }
    }
    else {
        res.status(401).json({
            msg: "Acceso Denegado",
        });
    }
};
exports.default = validateToken;
