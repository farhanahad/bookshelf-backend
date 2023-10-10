import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import httpStatus from 'http-status';
import routes from './app/routes';
import cookieParser from 'cookie-parser';
import path from 'path';

// Allow requests from specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://bookshelf-ui.vercel.app',
];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, success?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));

// parser
// app.use(fileUpload());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// application routes
app.use('/api/v1', routes);

app.use('/images', express.static(path.join(__dirname, '../src/images')));

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World is working');
});

app.use(globalErrorHandler);

// Not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API not found',
      },
    ],
  });

  next();
});

export default app;
