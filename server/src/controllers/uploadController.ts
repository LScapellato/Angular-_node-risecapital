import { Request, Response } from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import Client  from '../models/client';
import  Trade  from '../models/trade';

const upload = multer({ dest: 'uploads/' });

const processCSVFile = async (filePath: string, userData: any): Promise<void> => {
    const tradesData: any[] = [];
    let lineNumber = 0;

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csvParser({ skipLines: 2 })) // Saltar las dos primeras líneas
            .on('data', (row: any) => {
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
                        openTime: row['Open Time'], // Mantener como string
                        symbol: row['Symbol'],
                        type: row['Type'],
                        lots: parseFloat(row['Lots']),
                        openPrice: parseFloat(row['Open Price']),
                        stopLoss: parseFloat(row['Stop Loss']),
                        takeProfit: parseFloat(row['Take Profit']),
                        closeTime: row['Close Time'], // Mantener como string
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
                } catch (error) {
                    console.error(`Línea ${lineNumber}: error al procesar la fila:`, error);
                }
            })
            .on('end', async () => {
                try {
                    await Trade.bulkCreate(tradesData, { ignoreDuplicates: true });
                    // Eliminar el archivo después de procesarlo
                    fs.unlinkSync(filePath);
                    resolve();
                } catch (error) {
                    console.error('Error al guardar los datos:', error);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error al leer el archivo CSV:', error);
                reject(error);
            });
    });
};


export const processFolder = async (req: Request, res: Response) => {
    const folderPath = 'E:/Leo/Descargas/tradesclient'; // Ruta de la carpeta que contiene los archivos CSV

    try {
        // Lee todos los archivos en la carpeta
        const files = fs.readdirSync(folderPath);
        if (files.length === 0) {
            return res.status(400).json({ error: 'No se encontraron archivos CSV en la carpeta' });
        }

        // Filtra solo los archivos CSV
        const csvFiles = files.filter(file => path.extname(file) === '.csv');

        if (csvFiles.length === 0) {
            return res.status(400).json({ error: 'No se encontraron archivos CSV en la carpeta' });
        }

        // Lista para acumular los nombres de los archivos procesados
        const processedFiles: string[] = [];

        // Procesar cada archivo CSV
        for (const file of csvFiles) {
            const filePath = path.join(folderPath, file);

            // Extraer datos del cliente del nombre del archivo
            const fileName = path.basename(file);
            const [, name, accountType, accountNumber] = fileName.split(' - ');

            let userData: any = await Client.findByPk(accountType.trim());
            if (!userData) {
                // Si el cliente no existe, lo creamos
                userData = await Client.create({
                    id: accountType.trim(),
                    name: name.trim(),
                    accountType: accountType.trim(),
                    accountNumber: accountNumber.trim(),
                });
            }

            try {
                await processCSVFile(filePath, userData);
                processedFiles.push(file); // Agregar el nombre del archivo a la lista de procesados
            } catch (error) {
                console.error('Error al procesar el archivo CSV:', error);
                return res.status(500).json({ error: 'Error al procesar los archivos CSV', details: error });
            }
        }

        // Enviar respuesta con la lista de archivos procesados
        res.json({ message: 'Todos los archivos CSV han sido procesados y los datos guardados exitosamente', processedFiles });

    } catch (err) {
        console.error('Error al leer la carpeta:', err);
        return res.status(500).json({ error: 'Error al leer la carpeta', details: err });
    }
};

export const uploadFile = [
    upload.single('file'),
    async (req: Request, res: Response) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
        }

        const filePath = req.file.path;
        const fileName = path.basename(req.file.originalname);

        // Extraer datos del cliente del nombre del archivo
        const [, name, accountType, accountNumber] = fileName.split(' - ');

        try {
            let userData: any = null;
            userData = await Client.findByPk(accountType.trim());
            if (!userData) {
                // Si el cliente no existe, lo creamos
                userData = await Client.create({
                    id: accountType.trim(),
                    name: name.trim(),
                    accountType: accountType.trim(),
                    accountNumber: accountNumber.trim(),
                    // Otros campos si es necesario
                });
            }

            const tradesData: any[] = [];
            
            fs.createReadStream(filePath)
            
                .pipe(csvParser({ skipLines: 2 }))
                .on('data', (row: any) => {

                    tradesData.push({
                        id: row ['ID'],
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
                .on('end', async () => {
                    try {
                        await Trade.bulkCreate(tradesData);
                        res.json({ message: 'Archivo procesado y datos guardados exitosamente' });
                    } catch (error) {
                        console.error('Error al guardar los datos:', error);
                        res.status(500).json({ error: 'Error al guardar los datos', details: error });
                    } finally {
                        // Eliminar el archivo después de procesarlo
                        fs.unlinkSync(filePath);
                    }
                });
        } catch (error) {
            console.error('Error al procesar el archivo CSV:', error);
            res.status(500).json({ error: 'Error al procesar el archivo CSV', details: error });
        }
    }
];
