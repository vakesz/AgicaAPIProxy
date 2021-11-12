const url = require('url')
const express = require('express')
const router = express.Router()
const needle = require('needle')
const apicache = require('apicache')

// Env vars
const API_YOUTUBE_URL = process.env.API_YOUTUBE_URL
const API_KEY_NAME = process.env.API_KEY_NAME
const API_KEY_VALUE = process.env.API_KEY_VALUE

// Init cache
let cache = apicache.middleware

router.get('/', cache('10 minutes'), async (req, res, next) => {
  try {
    const key = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE
    })

    const params = new URLSearchParams({
      ...url.parse(req.url, true).query
    })

    const apiRes = await needle('get', `${API_YOUTUBE_URL}?${key}&${params}`)
    const data = apiRes.body

    // Log the request to the public API
    if (process.env.NODE_ENV !== 'production') {
      console.log(`REQUEST: ${API_YOUTUBE_URL}?${params}`)
    }

    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
})

module.exports = router