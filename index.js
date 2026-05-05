const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');

const usuarioRoutes = require('./routes/usuarioRoutes');
const productoRoutes = require('./routes/productoRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({
        mensaje: 'Backend de DigitalCorp funcionando correctamente'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        mensaje: 'Servidor DigitalCorp funcionando correctamente',
        timestamp: new Date()
    });
});

app.get('/api/db-test', (req, res) => {
    db.query('SELECT 1 + 1 AS resultado', (error, results) => {
        if (error) {
            return res.status(500).json({
                mensaje: 'Error al consultar la base de datos',
                error: error.message
            });
        }

        res.json({
            mensaje: 'Conexión a MySQL funcionando correctamente',
            resultado: results[0].resultado
        });
    });
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);

app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        mensaje: 'Error interno del servidor'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`API disponible en http://localhost:${PORT}/api`);
});