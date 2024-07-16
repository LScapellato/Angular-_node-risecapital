"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, nickname, type } = req.body;
    try {
        // Verifico si el usuario existe en la BD
        const existingUser = yield user_1.User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({
                msg: `El usuario ${username} ya existe`,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Guardamos el usuario
        const newUser = yield user_1.User.create({
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
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al crear usuario',
            error: error,
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // Validar si el usuario existe
        const user = yield user_1.User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({
                msg: `Usuario ${username} no registrado en nuestros datos!`,
            });
        }
        // Validamos la clave
        const passwordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordValid) {
            return res.status(400).json({
                msg: 'Password incorrecto',
            });
        }
        // Generamos token
        const token = jsonwebtoken_1.default.sign({ username: user.username, id: user.id }, process.env.SECRET_KEY || 'give1246', { expiresIn: '1h' });
        res.json({
            msg: 'Login exitoso',
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al iniciar sesión',
            error: error,
        });
    }
});
exports.loginUser = loginUser;
