import express from 'express';
import serverless from 'serverless-http';
import analyzeRoute from '../../server/routes/analyze';
import emailRoute from '../../server/routes/email';

const api = express();

api.use(express.json());
api.use(express.urlencoded({ extended: true }));

api.use('/api', analyzeRoute);
api.use('/api', emailRoute);

export const handler = serverless(api);
