const express = require('express');
const app = express();
app.use(express.json());

// Importamos el Router de Libro
const librosRouter = require('./routes/libros');

// Importamos el Middleware Error Handler
const { auth } = require("express-oauth2-jwt-bearer");
const errorHandler = require('./middleware/errorHandler');

const port = process.env.PORT || 8080

const autenticacion = auth({
    audience: "http://localhost:3000/api/productos",
    issuerBaseURL: "https://dev-utn-frc-iaew.auth0.com/",
    tokenSigningAlg: "RS256",
    });
    

app.use('/libros', autenticacion,  librosRouter,);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Servidor iniciando en el puerto 3000');
});
