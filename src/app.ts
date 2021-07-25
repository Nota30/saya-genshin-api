import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import logger from 'morgan';
import path from 'path';
//import redis from 'redis';

//Routes
import indexRouter from './routes/index';
import userRouter from './routes/user';
import characterRouter from './routes/character';
import profileRouter from './routes/profile';

const app = express();
/*
const client = redis.createClient(6379);

client.on('error', (err) => {
    console.log(err);
});
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('json spaces', 2);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use(function (req: Request, res, next) {
    res.locals = client;
    next();
});
*/
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/character', characterRouter);
app.use('/profile', profileRouter);

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err: createError.HttpError, req: Request, res: Response) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

export { app };
