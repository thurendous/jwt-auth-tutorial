const router = require('express').Router()
const JWT = require('jsonwebtoken')
const { publicPosts, privatePosts } = require('../db/Post')
const checkJWT = require('../middleware/checkJWT')

// 誰でも見れる記事
router.get('/public', (req, res) => {
    return res.json(publicPosts)
})

// JWTを持っている場合見れるprivate記事
router.get('/private', checkJWT, (req, res) => {
    return res.json(privatePosts)
})

module.exports = router
