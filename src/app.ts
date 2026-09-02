import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.use(express.json());

// Обов'язково додайте цей блок:
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'campushub-api',
    timestamp: new Date().toISOString()
  });
});

export default app;