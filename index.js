const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');
const { request, response } = require('express');
require('dotenv').config();

console.log(process.env);

//Crear el servidor/aplicación de express
const app = express();

//DB
dbConnection();

// Directorio público
app.use(express.static('public'));

//CORS Cross Domain Requests
app.use(cors());

// Lectura y parseo (transformación) del body
app.use(express.json());

// Rutas (middleware)
app.use('/api/auth', require('./routes/auth'));

// Manejar demas rutas
// Sirve para manejar cualquier ruta que no sea un endpoint
// dentro de sendfile enviamos el path.resolve de nuestro home
// en este caso el html que está dentro de public
app.get('*', (req = request, res = response) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});