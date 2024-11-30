import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';

const app = express();
app.use(bodyParser.json());

// Import and use your routes
import routes from './routes/routes';

app.use('/', routes);

// Error handling middleware
import { errorHandler } from './middleware/errorHandler';
app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync({ alter: true }).then(() => {
      app.listen(3000, () => {
        console.log('Server running on port 3000.');
      });
    });
  } catch (err) {
    console.error('Unable to start the server:', err);
  }
};

startServer();
