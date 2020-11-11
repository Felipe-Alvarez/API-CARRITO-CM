const {Router} = require("express")
const router = Router()
const fs = require("fs")
const FileEstudiantes = fs.readFileSync('./farmacias.json', 'utf-8')
const JSONEstudiantes = JSON.parse(FileEstudiantes)

router.get("/api", (req, res) => {
  res.send("API DE CARRITO")
})

router.get("/farmacia", (req, res) => {
  res.json(JSONEstudiantes)
})

router.post("/farmacia", (req, res) => {
  let id = JSONEstudiantes.length + 1
  let {correo, nombre, apellido, html} = req.body
  let nuevoEstudiante = {
    "id" : id,
    "nombre" : nombre,
    "apellido" : apellido,
    "correo" : correo,
    "html" : html
  } 
  JSONEstudiantes.push(nuevoEstudiante)
  fs.writeFileSync('./farmacias.json', JSON.stringify(JSONEstudiantes), 'utf-8')
  res.status(201).json(nuevoEstudiante)
})

router.get("/farmacia/:id", (req,res) => {
  let id = req.params.id
  let estudianteEncontrado = JSONEstudiantes.find(estudiante => estudiante.id == id)

  if(estudianteEncontrado != undefined)
    res.status(200).json(estudianteEncontrado)
  else
    res.json(`El ID ${id} no existe`)
})

router.put("/farmacia/:id", (req,res) => {
  let id = req.params.id 
  let {correo, nombre, apellido, html} = req.body

  let estudianteModifcado = JSONEstudiantes.find(estudiante => {
    if(estudiante.id == id){
      estudiante.nombre = nombre
      estudiante.apellido = apellido
      estudiante.correo = correo
      estudiante.html = html
      return estudiante
    }
  })

  if(estudianteModifcado != undefined){
    fs.writeFileSync('./farmacias.json', JSON.stringify(JSONEstudiantes), 'utf-8')
    res.status(201).json(estudianteModifcado)
  }else{
    res.status(200).json(`El ID ${id} no existe`)
  }
  

})

router.delete("/farmacia/:id", (req, res) => {
  let id = req.params.id
  let indexEstudiante = JSONEstudiantes.findIndex(estudiante => estudiante.id == id)
  if(indexEstudiante != -1){
    JSONEstudiantes.splice(indexEstudiante, 1)
    fs.writeFileSync('./farmacias.json', JSON.stringify(JSONEstudiantes), 'utf-8')
    res.status(200).json({mensaje : `La farmacia ${id} fue eliminada`})
  }else{
    res.json(`El id ${id} no existe`)
  }
})

module.exports = router