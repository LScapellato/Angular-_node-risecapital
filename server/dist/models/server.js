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
const express_1 = __importDefault(require("express"));
const client_1 = __importDefault(require("../routes/client"));
const user_1 = __importDefault(require("../routes/user"));
const upload_1 = __importDefault(require("../routes/upload"));
const tradestats_1 = __importDefault(require("../routes/tradestats"));
const operation_1 = __importDefault(require("../routes/operation"));
const liquidation_1 = __importDefault(require("../routes/liquidation"));
const payment_1 = __importDefault(require("../routes/payment"));
const cors_1 = __importDefault(require("cors"));
const validate_token_1 = __importDefault(require("../routes/validate-token"));
const connection_1 = __importDefault(require("../db/connection"));
const liquidation_2 = __importDefault(require("./liquidation"));
const clientinfo_1 = __importDefault(require("./clientinfo"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }
    //metodo
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicacion running en puerto ' + this.port);
        });
    }
    routes() {
        this.app.use('/api/users', user_1.default);
        this.app.use('/api/upload', validate_token_1.default, upload_1.default);
        this.app.use('/api', validate_token_1.default, tradestats_1.default, liquidation_1.default);
        this.app.use('/api/operations', validate_token_1.default, operation_1.default);
        this.app.use('/api/client', validate_token_1.default, client_1.default);
        this.app.use('/api/payments', payment_1.default);
    }
    middlewares() {
        //parseo body
        this.app.use(express_1.default.json());
        //Cors
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Sincronizar todos los modelos
                yield connection_1.default.sync({ alter: true });
                console.log('Base de datos sincronizada');
                try {
                    yield liquidation_2.default.belongsTo(clientinfo_1.default, { foreignKey: 'clientId', targetKey: 'clientId', as: 'Client' });
                    console.log('Relación establecida correctamente');
                }
                catch (error) {
                    console.error('Error al establecer la relación:', error);
                }
            }
            catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        });
    }
}
exports.default = Server;
