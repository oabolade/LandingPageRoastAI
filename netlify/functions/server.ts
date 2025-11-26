import express, { Router } from 'express';
import serverless from 'serverless-http';
import analyzeRoute from '../../server/routes/analyze';
import emailRoute from '../../server/routes/email';

const api = express();

const router = Router();
router.use('/analyze', analyzeRoute);
router.use('/email', emailRoute);

api.use(express.json());
api.use(express.urlencoded({ extended: true }));
api.use('/api/', router);

export const handler = serverless(api);
