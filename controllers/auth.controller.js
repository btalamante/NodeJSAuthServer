const { response, request } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const ObjectId = require('mongoose').Types.ObjectId; 

const crearUsuario = async (req = request, res = response) => {
    const { email, password, name } = req.body;

    try {

        // Verficiar el email
        const usuario = await Usuario.findOne({ email: email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese mail'
            });
        }


        // Crear usuario con el modelo
        const dbUsuario = new Usuario(req.body);


        // Hashear la contraseña
        const salt = bcrypt.genSaltSync(10);
        dbUsuario.password = bcrypt.hashSync(password, salt);

        // Generar el JWT
        const token = await generarJWT(dbUsuario.id, name);
        // Crear usuario de DB
        await dbUsuario.save();


        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUsuario.id,
            name: dbUsuario.name,
            token,
            email: dbUsuario.email
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador',
            error
        });
    }





};

const loginUsuario = async (req = request, res = response) => {

    //validationResult es una función que sirve para obtener los errores de la request
    // Toda esta lógica la implementamos dentro del middleware validar-campos
    // const errors = validationResult( req );
    // if (!errors.isEmpty()){
    //     return res.status(400).json({
    //         ok: false,
    //         error: errors.mapped()
    //     });    
    // }

    const { email, password } = req.body;

    try {

        const dbUser = await Usuario.findOne({ email });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }
        // Confirmar si el password hace match
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password es incorrecto'
            });
        }
        // Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);
        console.log({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token,
            email: dbUser.email
        });
        //Respuesta del servicio
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token,
            email
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}

const renovarToken = async (req = request, res = response) => {
    try {
        const { uid, name } = req;
        const dbUser = await Usuario.findOne({ _id: ObjectId(uid) });
        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        console.log(dbUser);
        // Generar el JWT
        const token = await generarJWT(uid, name);
        
        return res.json({
            ok: true,
            msg: 'Renovar token',
            uid: uid,
            name: name,
            token,
            email: dbUser.email
        });
        
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renovarToken
}