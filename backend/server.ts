import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import { rateLimit } from 'express-rate-limit'

import detectPageRoutes from './routes/detectPageRoutes';
import landingPageRoutes from './routes/landingPageRoutes';
import scanPageRoutes from './routes/scanPageRoute'


const app = express.default();

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 100,
	standardHeaders: 'draft-7',
	legacyHeaders: false
})

const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

app.use(limiter)
app.use(express.json());
app.use(cors.default(corsOptions));
app.use(Helmet());

app.get('/test', (req: Request, res: Response) => {
    return res.json({ "message": "Test route works!" });
});

app.use(detectPageRoutes);
app.use(landingPageRoutes);
app.use(scanPageRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send("An unexpected error occurred.");
});

export default app;
