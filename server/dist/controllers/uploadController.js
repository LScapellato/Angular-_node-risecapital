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
exports.uploadFile = exports.processFolder = void 0;
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const client_1 = __importDefault(require("../models/client"));
const trade_1 = __importDefault(require("../models/trade"));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const processCSVFile = (filePath, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const tradesData = [];
    let lineNumber = 0;
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)({ skipLines: 2 })) // Saltar las dos primeras líneas
            .on('data', (row) => {
            lineNumber++;
            // Validar si la fila está vacía
            if (!row['ID'] || !row['Ticket']) {
                console.warn(`Línea ${lineNumber}: fila vacía o incompleta, saltando...`);
                return;
            }
            try {
                const trade = {
                    ID: row["ID"],
                    clientId: userData.id,
                    ticket: row['Ticket'],
                    openTime: row['Open Time'],
                    symbol: row['Symbol'],
                    type: row['Type'],
                    lots: parseFloat(row['Lots']),
                    openPrice: parseFloat(row['Open Price']),
                    stopLoss: parseFloat(row['Stop Loss']),
                    takeProfit: parseFloat(row['Take Profit']),
                    closeTime: row['Close Time'],
                    closePrice: parseFloat(row['Close Price']),
                    commission: parseFloat(row['Commission']),
                    swap: parseFloat(row['Swap']),
                    profitLoss: parseFloat(row['Profit Loss']),
                    magic: parseFloat(row['Magic']),
                    comment: row['Comment'],
                };
                // Validar y limpiar datos
                if (isNaN(trade.lots) || isNaN(trade.openPrice) || isNaN(trade.stopLoss) || isNaN(trade.takeProfit) ||
                    isNaN(trade.closePrice) || isNaN(trade.commission) || isNaN(trade.swap) || isNaN(trade.profitLoss) ||
                    isNaN(trade.magic)) {
                    console.warn(`Línea ${lineNumber}: datos inválidos en la fila, saltando...`);
                    return;
                }
                tradesData.push(trade);
            }
            catch (error) {
                console.error(`Línea ${lineNumber}: error al procesar la fila:`, error);
            }
        })
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield trade_1.default.bulkCreate(tradesData, { ignoreDuplicates: true });
                // Eliminar el archivo después de procesarlo
                fs_1.default.unlinkSync(filePath);
                resolve();
            }
            catch (error) {
                console.error('Error al guardar los datos:', error);
                reject(error);
            }
        }))
            .on('error', (error) => {
            console.error('Error al leer el archivo CSV:', error);
            reject(error);
        });
    });
});
const processFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const folderPath = 'E:/Leo/Descargas/tradesclient'; // Ruta de la carpeta que contiene los archivos CSV
    try {
        // Lee todos los archivos en la carpeta
        const files = fs_1.default.readdirSync(folderPath);
        if (files.length === 0) {
            return res.status(400).json({ error: 'No se encontraron archivos CSV en la carpeta' });
        }
        // Filtra solo los archivos CSV
        const csvFiles = files.filter(file => path_1.default.extname(file) === '.csv');
        if (csvFiles.length === 0) {
            return res.status(400).json({ error: 'No se encontraron archivos CSV en la carpeta' });
        }
        // Lista para acumular los nombres de los archivos procesados
        const processedFiles = [];
        // Procesar cada archivo CSV
        for (const file of csvFiles) {
            const filePath = path_1.default.join(folderPath, file);
            // Extraer datos del cliente del nombre del archivo
            const fileName = path_1.default.basename(file);
            const [, name, accountType, accountNumber] = fileName.split(' - ');
            let userData = yield client_1.default.findByPk(accountType.trim());
            if (!userData) {
                // Si el cliente no existe, lo creamos
                userData = yield client_1.default.create({
                    id: accountType.trim(),
                    name: name.trim(),
                    accountType: accountType.trim(),
                    accountNumber: accountNumber.trim(),
                });
            }
            try {
                yield processCSVFile(filePath, userData);
                processedFiles.push(file); // Agregar el nombre del archivo a la lista de procesados
            }
            catch (error) {
                console.error('Error al procesar el archivo CSV:', error);
                return res.status(500).json({ error: 'Error al procesar los archivos CSV', details: error });
            }
        }
        // Enviar respuesta con la lista de archivos procesados
        res.json({ message: 'Todos los archivos CSV han sido procesados y los datos guardados exitosamente', processedFiles });
    }
    catch (err) {
        console.error('Error al leer la carpeta:', err);
        return res.status(500).json({ error: 'Error al leer la carpeta', details: err });
    }
});
exports.processFolder = processFolder;
exports.uploadFile = [
    upload.single('file'),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }
        const filePath = req.file.path;
        const fileName = path_1.default.basename(req.file.originalname);
        // Extraer datos del cliente del nombre del archivo
        const [, name, accountType, accountNumber] = fileName.split(' - ');
        try {
            let userData = null;
            userData = yield client_1.default.findByPk(accountType.trim());
            if (!userData) {
                // Si el cliente no existe, lo creamos
                userData = yield client_1.default.create({
                    id: accountType.trim(),
                    name: name.trim(),
                    accountType: accountType.trim(),
                    accountNumber: accountNumber.trim(),
                    // Otros campos si es necesario
                });
            }
            const tradesData = [];
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)({ skipLines: 2 }))
                .on('data', (row) => {
                tradesData.push({
                    id: row['ID'],
                    clientId: userData.id,
                    ticket: row['Ticket'],
                    openTime: new Date(row['Open Time']),
                    symbol: row['Symbol'],
                    type: row['Type'],
                    lots: parseFloat(row['Lots']),
                    openPrice: parseFloat(row['Open Price']),
                    stopLoss: parseFloat(row['Stop Loss']),
                    takeProfit: parseFloat(row['Take Profit']),
                    closeTime: new Date(row['Close Time']),
                    closePrice: parseFloat(row['Close Price']),
                    commission: parseFloat(row['Commission']),
                    swap: parseFloat(row['Swap']),
                    profitLoss: parseFloat(row['Profit Loss']),
                    magic: parseFloat(row['Magic']),
                    comment: row['Comment'],
                });
            })
                .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield trade_1.default.bulkCreate(tradesData);
                    res.json({ message: 'Archivo procesado y datos guardados exitosamente' });
                }
                catch (error) {
                    console.error('Error al guardar los datos:', error);
                    res.status(500).json({ error: 'Error al guardar los datos', details: error });
                }
                finally {
                    // Eliminar el archivo después de procesarlo
                    fs_1.default.unlinkSync(filePath);
                }
            }));
        }
        catch (error) {
            console.error('Error al procesar el archivo CSV:', error);
            res.status(500).json({ error: 'Error al procesar el archivo CSV', details: error });
        }
    })
];
