import express, {Application} from 'express';
import routesClient from '../routes/client';
import routesUser from '../routes/user';
import routesUpload from '../routes/upload';
import tradeStats from '../routes/tradestats';
import operationRoutes from '../routes/operation';
import liquidationRoutes from '../routes/liquidation';
import paymentsRoutes from '../routes/payment';
import cors from 'cors';
import validateToken from '../routes/validate-token';

import sequelize from '../db/connection';
import Liquidation from './liquidation';
import ClientInfo from './clientinfo';


class Server {

    private app: Application;
    private port: string;


    constructor() {

        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
       
    }

    //metodo
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicacion running en puerto ' +this.port);
        })
    }

    routes(){
        
        this.app.use('/api/users', routesUser );
        this.app.use('/api/upload', validateToken, routesUpload);
        this.app.use('/api' , validateToken, tradeStats,liquidationRoutes);
        this.app.use('/api/operations', validateToken, operationRoutes);
        this.app.use('/api/client', validateToken, routesClient);
        this.app.use('/api/payments', paymentsRoutes)
        
        
    }

    middlewares () {
        //parseo body
        this.app.use(express.json());

        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            // Sincronizar todos los modelos
            await sequelize.sync({ alter: true });
            console.log('Base de datos sincronizada');
            try {
                await Liquidation.belongsTo(ClientInfo, { foreignKey: 'clientId', targetKey: 'clientId', as: 'Client' });
                console.log('Relación establecida correctamente');
              } catch (error) {
                console.error('Error al establecer la relación:', error);
              }
            
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
}

export default Server;