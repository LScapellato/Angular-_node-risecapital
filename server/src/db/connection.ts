import { Sequelize } from "sequelize";


const sequelize = new Sequelize('risecap','root', 'alaMan67459%', {

    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;