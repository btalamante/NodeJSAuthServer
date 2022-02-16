const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, renovarToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Crea un nuevo USUARIO
router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], crearUsuario);

// Login de Usuario
// Primer argunto path
// Segundo middlewares, puede ser un arreglo

// Controlador de la ruta
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    validarCampos
], loginUsuario);

// Validar y revalidar token
router.get('/renew', validarJWT, renovarToken);






module.exports = router;