const { request, response } = require("express")
const jwt = require('jsonwebtoken');



const validarJWT = (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'error en el token'
        });
    }
    try {

        const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
        console.log(uid, name);
        req.uid = uid;
        req.name = name;
        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
    //
}

module.exports = {
    validarJWT
}