"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_errors_1 = __importDefault(require("http-errors"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const redis_1 = __importDefault(require("redis"));
//Routes
const index_1 = __importDefault(require("./routes/index"));
const user_1 = __importDefault(require("./routes/user"));
const character_1 = __importDefault(require("./routes/character"));
const app = express_1.default();
exports.app = app;
const client = redis_1.default.createClient({
    host: '209.145.53.39',
    port: 6379,
    password: process.env.REDIS_PASS
});
client.on('error', (err) => {
    console.log(err);
});
app.set('views', '/root/saya-genshin/assets/views');
app.set('view engine', 'pug');
app.set('json spaces', 2);
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join('/root/saya-genshin/assets/', 'public')));
app.use(function (req, res, next) {
    res.locals = client;
    next();
});
app.use('/', index_1.default);
app.use('/user', user_1.default);
app.use('/character', character_1.default);
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
app.use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
