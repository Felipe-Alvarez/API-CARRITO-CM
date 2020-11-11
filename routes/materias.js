const {Router} = require("express")
const router = Router()
const fs = require("fs")
const FileEstudiantes = fs.readFileSync('./materias.json', 'utf-8')
const JSONEstudiantes = JSON.parse(FileEstudiantes)


module.exports = router