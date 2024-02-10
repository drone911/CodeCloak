import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

import * as cors from "cors";
import Helmet from "helmet";
import detectPageRoutes from './routes/detectPageRoutes';
import landingPageRoutes from './routes/landingPageRoutes';
import scanPageRoutes from './routes/scanPageRoute'


const app = express();

const corsOptions = {
    origin: process.env.REACT_CORS_ORIGIN,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(Helmet());

app.get('/test', (req: Request, res: Response) => {
    res.json({ "message": "Test route works!" });
});

app.use(detectPageRoutes);
app.use(landingPageRoutes);
app.use(scanPageRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).send("An unexpected error occurred.");
});

export default app;
