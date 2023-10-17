import express, {Application} from 'express';
import routesProduct from '../routes/products';
import routesUser from '../routes/user';
import cors from 'cors';

import { Product } from './product';
import { User } from './user';


class Server {

    private app: Application;
    private port: string;


    constructor() {

        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlewares();
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
        this.app.use('/api/products', routesProduct);
        this.app.use('/api/users', routesUser );

    }

    midlewares () {
        //parseo body
        this.app.use(express.json());

        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await Product.sync();
            await User.sync();
          } catch (error) {
            console.error('Unable to connect to the database:', error);
          }
    }
}

export default Server;