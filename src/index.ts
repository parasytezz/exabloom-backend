import express from 'express';
import * as dotenv from 'dotenv';
import routes from './routes';
import pool from './db';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('DB connected:', res.rows[0]);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

