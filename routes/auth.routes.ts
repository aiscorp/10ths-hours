import {Router} from 'express'
import bcrypt from 'bcryptjs'
import config from 'config'
import jwt from 'jsonwebtoken'
import {check, validationResult} from 'express-validator'
const User = require('../models/User')


const router = Router()
// 
// /api/auth/register
router.post(
    '/register',
    [
      check('email', 'Некорректный email').isEmail(),
      check('password', 'Минимальная длина пароля 6 символов')
        .isLength({ min: 6 })
    ],
    async (req :any, res :any) => {
    try {
    // Validation
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при регистрации'
        })
      }
  
    // Control logic
       const {email, password} = req.body
  
       const candidate = await User.findOne({ email })
  
       if (candidate) {
         return res.status(400).json({ message: 'Такой пользователь уже существует' })
       }
  
       const hashedPassword = await bcrypt.hash(password, 147)
       const user = new User({ email, password: hashedPassword })
  
       await user.save()
  
       res.status(201).json({ message: 'Пользователь создан' })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
  
  // /api/auth/login
  router.post(
    '/login',
    [
      check('email', 'Введите корректный email').normalizeEmail().isEmail(),
      check('password', 'Введите пароль').exists()
    ],
    async (req :any, res :any) => {
    try {
      // Validation  
      const errors = validationResult(req)
  
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректный данные при входе в систему'
        })
      }
  
      // Control logic
      const {email, password} = req.body
  
      const user = await User.findOne({ email })
  
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }
  
      const isMatch = await bcrypt.compare(password, user.password)
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }
  
      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )
  
      res.json({ token, userId: user.id })
  
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
  



module.exports = router