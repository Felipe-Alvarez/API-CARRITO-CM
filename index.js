const express = require("express")
const path = require("path")
const fs = require("fs")
const morgan = require("morgan")
const app = express(),
//MULTER PROCESO Y FUNCIÓN
multer = require('multer'),
  storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './images')
    // DIRECTORIO AL CUAL SUBEN LAS IMAGES
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
  //PASAMOS EL NOMBE ORIGINAL DEL ARCHIVO
}),
upload = multer ({storage})

app.post('/subir', upload.single('images'), (req, res) =>{
  console.log(req.file)
  res.send('Archivo subido correctamente')
})

app.post('/multiple', upload.array('images'),
function(req, res, next){
  console.log(req.file)
  res.send('archivos seleccionados exitosamente')
})

app.post('/multiple', upload.array('images', 3), (req, res)=>{
  console.log(req.file)
})
let dobleinput = upload.fields([{name: 'archivo', maxCount: 2}, {name: 'fichero'}])
app.post('/doble-input', dobleinput, (req, res)=>{
  console.log(req.file, "Archivo subido")
  res.send("archivo subido!!")
})

//Middelwares
app.use(morgan('dev'))
app.use(express.json())

//Routes
app.use("/api", require("./routes/farmacia"))
app.use("/api", require("./routes/materias"))

  app.get('/', (req, res) => {
    res.sendFile('./html/index.html', {root: __dirname})
})
  app.get('/carrito', (req, res) => {
    res.sendFile('./html/carrito.html', {root: __dirname})
})
  app.get('/compra', (req, res) => {
    res.sendFile('./html/compra-interna.html', {root: __dirname})
})
  app.get('/productos', (req, res) => {
    res.sendFile('./html/producto.html', {root: __dirname})
})
  app.get('/api', (req, res) => {
    res.sendFile('./routes/routes.html', {root: __dirname})
})

const Productos = fs.readFileSync('./productos.json', 'utf-8')
const JSONproductos = JSON.parse(Productos)
app.get('/api/productos', (req,res)=>{
  res.send(JSONproductos)
})

const Carrito = fs.readFileSync('./carrito.json', 'utf-8')
const JSONcarrito = JSON.parse(Carrito)
app.get('/api/carrito', (req,res)=>{
  res.send(JSONcarrito)
})

const Compra = fs.readFileSync('./compra.json', 'utf-8')
const JSONcompra = JSON.parse(Compra)
app.get('/api/compras', (req,res)=>{
  res.send(JSONcompra)
})

const Index_api = fs.readFileSync('./inicio.json', 'utf-8')
const JSONinit = JSON.parse(Index_api)
app.get('/api/index-api', (req,res)=>{
  res.send(JSONinit)
})

app.set("puerto", 25000)

app.listen(app.get("puerto"), () => {
  console.log(`Servidor corriendo en el puerto ${app.get("puerto")}`)
})

