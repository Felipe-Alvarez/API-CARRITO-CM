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
app.use("/api", require("./routes/producto"))
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

// PRODUCTOS API-MÉTODOS
const Productos = fs.readFileSync('./productos.json', 'utf-8')
const JSONproductos = JSON.parse(Productos)
app.get('/api/productos', (req,res)=>{
  res.send(JSONproductos)
})

app.get("/api/productos/:id", (req,res) => {
  let id = req.params.id
  let ProductoSearch = JSONproductos.find(productos => productos.id == id)

  if(ProductoSearch != undefined)
    res.status(200).json(ProductoSearch)
  else
    res.json(`El producto ${id} no existe`)
})

app.post("/api/productos", (req, res) => {
  let id = JSONproductos.length + 1
  let {producto, image} = req.body
  let NewProducto = {
    "id":id,
    "producto" : producto,
    "image" : image
  }
  JSONproductos.push(NewProducto)
  fs.writeFileSync('./productos.json', JSON.stringify(JSONproductos), 'utf-8')
  res.status(201).json(NewProducto)
})

app.put("/api/productos/:id", (req,res) => {
  let id = req.params.id 
  let {producto, image} = req.body

  let productoPut = JSONproductos.find(product => {
    if(product.id == id){
      product.producto = producto
      product.image = image
      return product
    }
  })
  if(productoPut != undefined){
    fs.writeFileSync('./productos.json', JSON.stringify(JSONproductos), 'utf-8')
    res.status(201).json(productoPut)
  }else{
    res.status(200).json(`El id del producto ${id} no existe`)
  }
  
})

app.delete("/api/productos/:id", (req, res) => {
  let id = req.params.id
  let indexProducto = JSONproductos.findIndex(product => product.id == id)
  if(indexProducto != -1){
    JSONproductos.splice(indexProducto, 1)
    fs.writeFileSync('./productos.json', JSON.stringify(JSONproductos), 'utf-8')
    res.status(200).json({mensaje : `El producto ${id} fue eliminado`})
  }else{
    res.json(`El producto ${id} no existe`)
  }
})

// { CARRITO API-MÉTODOS }

const Carrito = fs.readFileSync('./carrito.json', 'utf-8')
const JSONcarrito = JSON.parse(Carrito)
app.get('/api/carrito', (req,res)=>{
  res.send(JSONcarrito)
})

app.get("/api/carrito/:id", (req,res) => {
  let id = req.params.id
  let ProductoSearch = JSONcarrito.find(productos => productos.id == id)

  if(ProductoSearch != undefined)
    res.status(200).json(ProductoSearch)
  else
    res.json(`El carrito ${id} no existe`)
})

app.post("/api/carrito", (req, res) => {
  let id = JSONcarrito.length + 1
  let {nameproducto, imageproducto,cantidad,precio,subtotal} = req.body
  let NewCarro = {
    "id":id,
    "nameproducto":nameproducto,
    "imageproducto":imageproducto,
    "cantidad": cantidad,
    "precio": precio,
    "sub-total": subtotal
  }
  JSONcarrito.push(NewCarro)
  fs.writeFileSync('./carrito.json', JSON.stringify(JSONcarrito), 'utf-8')
  res.status(201).json(NewCarro)
})

app.put("/api/carrito/:id", (req,res) => {
  let id = req.params.id 
  let {nameproducto, imageproducto,cantidad,precio,subtotal} = req.body
  let carroPut = JSONcarrito.find(carro => {
    if(carro.id == id){
      carro.nameproducto = nameproducto
      carro.imageproducto = imageproducto
      carro.cantidad = cantidad
      carro.precio = precio
      carro.subtotal = subtotalindexCarro
      return carro
    }
  })
  if(carroPut != undefined){
    fs.writeFileSync('./carrito.json', JSON.stringify(JSONcarrito), 'utf-8')
    res.status(201).json(carroPut)
  }else{
    res.status(200).json(`El id del carro ${id} no existe`)
  }
  
})

app.delete("/api/carrito/:id", (req, res) => {
  let id = req.params.id
  let indexCarro = JSONcarrito.findIndex(carro => carro.id == id)
  if(indexCarro != -1){
    JSONcarrito.splice(indexCarro, 1)
    fs.writeFileSync('./carrito.json', JSON.stringify(JSONcarrito), 'utf-8')
    res.status(200).json({mensaje : `El carrito ${id} fue eliminado`})
  }else{
    res.json(`El carrito ${id} no existe`)
  }
})

// {  COMPRA-API-MÉTODOS  }
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

