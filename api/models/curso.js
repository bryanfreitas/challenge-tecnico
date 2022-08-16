const mongoose = require("mongoose");

const cursoSchema = mongoose.Schema({ 
    _id: mongoose.Schema.Types.ObjectId,
    client: [{
        alumno: { type: String},
        nota: { type: Number}
    }],
    anioDictado: { type: Number, require: true},
    duracion: { type: Number, require: true},
    tema: { type: String, require: true}
});

module.exports = mongoose.model('Curso', cursoSchema);