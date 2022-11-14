const JWT = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    // JWTを持っているか確認をするため、 -> リクエストヘッダの中のx-auth-tokenを確認する
    console.log('JWT is run')
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(400).json([
            {
                message: '権限がないよ',
            },
        ])
    } else {
        try {
            let user = await JWT.verify(token, 'secret key')
            console.log(user)
            req.user = user.email
            next() // tokenあったら続けてやって
        } catch {
            return res.status(400).json([
                {
                    message: 'tokenが一致しないぞ',
                },
            ])
        }
    }
}
