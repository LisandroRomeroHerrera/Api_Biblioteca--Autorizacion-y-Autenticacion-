const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/biblioteca"),
db.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err);
});

const LibroSchema = new mongoose.Schema({
    titulo: String,
    autor: String
}, { collection: 'libros' });

module.exports = mongoose.model('libros', LibroSchema);