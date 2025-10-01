//desconozco que hay que hacer con express por ahora
    
    
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate())

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('¡Hola, Mundo con Express!');
});

app.listen(port, () => {
  console.log(`La aplicación Express está escuchando en el puerto ${port}`);
});