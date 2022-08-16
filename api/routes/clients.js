const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const chekAuth = require('../middleware/check-auth');
const { remove } = require('../models/client');


const Client = require('../models/client');

//Listado de datos
router.get('/', (req, res, next) => {
    Client.find()
    .select('nombre apellido dni direccion _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            Clients: docs.map(doc => {
                return {
                    nombre: doc.nombre,
                    apellido: doc.apellido,
                    dni: doc.dni,
                    direccion: doc.direccion,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/clients/' + doc._id
                    }
                }
            })
        };
        if(docs.length >= 0){
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: "No hay datos"
            });
        }

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//CARGA DE DATOS
router.post('/',chekAuth, (req, res, next) => {
    const client = new Client({
        _id: new mongoose.Types.ObjectId(),
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        direccion: req.body.dni
    });
    client.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Objeto creado correctamente',
            createdClient: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                dni: req.body.dni,
                direccion: req.body.direccion,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/clients/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//BUSQUEDA DE DATOS POR ID
router.get('/:clientId', chekAuth, (req, res, next) => {
    const id = req.params.clientId;
    Client.findById(id)
    .select('nombre apellido dni direccion _id')
    .exec()
    .then(doc => {
        console.log("Desde la base de datos", doc);
        if(doc){
            res.status(200).json({
                client: doc,
                request: {
                    type: 'GET',
                    descripcion: 'Mostrar todos los clientes',
                    url: 'http://localhost:3000/clients/'
                }
            });
        } else{
            res.status(404).json({message: "No hay entrada valida para el ID indicado"});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

//ACTUALIZAR DATO
router.patch('/:id',chekAuth, (req, res, next) => {
    const id = req.params.id;
    Client.findByIdAndUpdate(id, { $set: req.body }, { new: true})
      .then(result => res.status(200).json({
        message: 'Cliente actualizado',
        request: {
            type: 'GET',
            url: 'http://localhost:3000/clients/' + id
        }
      }))
      .catch(err => res.status(500).json({ error: err}));
  })

//ELIMINAR DATO
router.delete('/:clientId', chekAuth, (req, res, next) => {
    const id = req.params.clientId;
    Client.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Cliente eliminado',
            request:{
                type: 'POST',
                url: 'http://localhost3000/clients/',
                dabodyta: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;