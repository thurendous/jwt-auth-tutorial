const router = require('express').Router()
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const { User } = require('../db/User')
const JWT = require('jsonwebtoken')

router.get('/', (req, res) => {
    res.send('Hello auth js!')
})

/// user new register API
// accept an email and password
router.post(
    '/register',
    // 2.validation check
    // check email
    body('email').isEmail(),
    // check password
    body('password').isLength({ min: 6 }),
    async (req, res) => {
        const email = req.body.email
        const password = req.body.password
        console.log(email, password)
        // check error exists or not
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log(111)

        // if there is no error
        // 3: DB user is there or not check
        const user = User.find((ele) => ele.email === email)
        if (user) {
            return res.status(400).json([
                {
                    message: 'User already exists',
                },
            ])
        }
        // 4. password 暗号化
        let hashedPassword = await bcrypt.hash(password, 10)
        // console.log(hashedPassword)

        //5.save on db
        User.push({
            email: email,
            password: hashedPassword,
        })

        // 6. clientへJWT発行
        const token = await JWT.sign(
            {
                email,
            },
            'secret key',
            {
                expiresIn: '24h',
            }
        )

        return res.json({
            token: token,
        })
        // localStorageには絶対に保存したらあかん
        // cookieに保存したほうがよいとのこと
    }
)

// login api
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = User.find((user) => user.email === email)
    if (!user) {
        return res.status(400).json({
            message: 'User not found',
        })
    }
    // password recover
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({
            message: 'Password is incorrect',
        })
    }

    const token = await JWT.sign(
        {
            email,
        },
        'secret key',
        {
            expiresIn: '24h',
        }
    )

    return res.json({
        token: token,
    })
})

// dbのユーザーを確認するAPI
router.get('/allUsers', (req, res) => {
    return res.json(User)
})

module.exports = router
