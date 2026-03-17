import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { initMySQL } from './config/db.js';

import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';
import soupRoutes from './routes/soup.routes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('page'));

app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/food', foodRoutes);
app.use('/soup', soupRoutes);

app.listen(3000, async () => {
    await initMySQL();
    console.log('Server running on port 3000');
});