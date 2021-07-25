"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/', function (req, res) {
    res.render('index', { title: 'Saya-Genshin' });
});
exports.default = router;
