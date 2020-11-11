const {Router} = require("express")
const router = Router()
const fs = require("fs")

router.get('/api-carrito', (req,res) => {
  res.send('WELLCOME TO API-CARRITO; USE BUTTONS:')
})

module.exports = router;