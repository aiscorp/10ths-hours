"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const User = require("../models/User");
//import User from '../models/User'
const router = express_1.Router();
// 
// /api/auth/register
router.post('/register', [
    express_validator_1.check('email', 'Некорректный email').isEmail(),
    express_validator_1.check('password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })
], async (req, res) => {
    try {
        // Validation
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректный данные при регистрации'
            });
        }
        // Control logic
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            return res.status(400).json({ message: 'Такой пользователь уже существует' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 147);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Пользователь создан' });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});
// /api/auth/login
router.post('/login', [
    express_validator_1.check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    express_validator_1.check('password', 'Введите пароль').exists()
], async (req, res) => {
    try {
        // Validation  
        const errors = express_validator_1.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректный данные при входе в систему'
            });
        }
        // Control logic
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, config_1.default.get('jwtSecret'), { expiresIn: '1h' });
        res.json({ token, userId: user.id });
    }
    catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});
module.exports = router;
