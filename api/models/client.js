const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({ 
    _id: mongoose.Schema.Types.ObjectId,
    nombre: { type: String, required: true }, 
    apellido: { type: String, required: true },
    dni: { type: Number, required: true },
    direccion: { type: String, required: true }
});

module.exports = mongoose.model('Client', clientSchema);