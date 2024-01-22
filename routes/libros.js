const express = require('express');
const router = express.Router();
const Libro = require('../data');
const Joi = require('joi');

const { requiredScopes } = require("express-oauth2-jwt-bearer");
const libros = require('../data');

const libroSchema = Joi.object({
    id: Joi.alternatives(Joi.string(), Joi.number()),
    titulo: Joi.string().required().label('Titulo'),
    autor: Joi.string().required().label('Autor')
});

// Obtener todos los libros
router.get('/', requiredScopes("read:productos"), async (req, res, next) => {
    try {
        res.json(libros);
    } catch (err) {
        next(err);
    }
});

// Obtener un libro por ID
router.get('/:id',  requiredScopes("read:productos"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const libro = libros.find((l) => l.id === id);


        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        res.json(libro);
    } catch (err) {
        next(err);
    }
});
//  Crear un nuevo libro
router.post('/',  requiredScopes("write:productos"), async (req, res, next) => {
    try {
        const { error, value } = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de validación');
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }

        const { titulo, autor } = value;

        // Generar un nuevo ID (simplemente incrementa el número)
        const nuevoId = (libros.length + 1).toString();

        const nuevoLibro = {
            id: nuevoId,
            titulo,
            autor
        };

        libros.push(nuevoLibro);
        res.status(201).json(nuevoLibro);
    } catch (err) {
        next(err);
    }
});

// Actualizar un libro existente
router.put('/:id',  requiredScopes("write:productos"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error, value } = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de validacion');
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }

        const { titulo, autor } = value;
        
        const libro = libros.find((l) => l.id.toString() === id.toString());

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        res.json(libro);
    } catch (err) {
        next(err);
    }
});

// Parchear un libro
router.patch('/:id',  requiredScopes("write:productos"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const { error, value } = libroSchema.validate(req.body);
        if (error) {
            const validationError = new Error('Error de validacion');
            validationError.status = 400;
            validationError.details = error.details.map(detail => detail.message);
            throw validationError;
        }

        const { titulo, autor } = value;
        
        const libro = libros.find((l) => l.id.toString() === id.toString());

        if (!libro) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        libro.titulo = titulo || libro.titulo;
        libro.autor = autor || libro.autor;

        res.json(libro);
    } catch (err) {
        next(err);
    }
});


// Eliminar un libro
router.delete('/:id', requiredScopes("write:productos"), async (req, res, next) => {
    try {
        const id = req.params.id;
        const index = libros.findIndex((l) => l.id === id);

        if (index === -1) {
            const error = new Error('Libro no encontrado');
            error.status = 404;
            throw error;
        }

        const libroEliminado = libros.splice(index, 1);
        res.json(libroEliminado[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
