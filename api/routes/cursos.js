const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const chekAuth = require('../middleware/check-auth');

const Curso = require('../models/curso');
const Client = require('../models/client');

/*Listado de todos los datos
router.get('/', (req, res, next) => {
    Curso.find()
    .select('client alumno nota tema anioDictado duracion _id')//se guarda el dato de cliente pero no encontre como mostrar el objeto de cliente en el postman
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            Curso: docs.map(doc => {
                return {
                    _id: doc._id,
                    tema: doc.tema,
                    anioDictado: doc.anioDictado,
                    duracion: doc.duracion,
                    client: [{
                        alumno: doc.alumno,
                        nota: doc.nota,
                    }],
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/cursos/' + doc._id
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
*/ 

//Listado de todos los datos
router.get('/', (req, res, next) => {
    Curso.find()
    .select('tema anioDictado duracion client _id')
    .exec()
    .then(doc => {
        console.log("Desde la base de datos", doc);
        if(doc){
            res.status(200).json({
                curso: doc,
                request: {
                    type: 'GET',
                    descripcion: 'Mostrar todos los cursos',
                    url: 'http://localhost:3000/cursos/'
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
router.patch('agregar/:id', (req, res, next) => {
    const id = req.params.id;
    Client.findByIdAndUpdate(id, { client:[{ alumno: req.body, nota: req.body }] }, { new: true})
      .then(result => res.status(200).json({
        message: 'Cliente actualizado',
        request: {
            type: 'GET',
            url: 'http://localhost:3000/clients/' + id
        }
      }))
      .catch(err => res.status(500).json({ error: err}));
  })


//CARGA DE DATOS
router.post('/', (req, res, next) => {
    const curso = new Curso({
        _id: new mongoose.Types.ObjectId(),
        tema: req.body.tema,
        anioDictado: req.body.anioDictado,
        duracion: req.body.duracion,
        client: req.body.client
    });
    curso.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Curso creado correctamente',
            createdCurso: {
                tema: req.body.tema,
                anioDictado: req.body.anioDictado,
                duracion: req.body.duracion,
                client: [{
                    alumno: req.body.alumno,
                    nota: req.body.nota,
                }],
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/cursos/' + result._id
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
router.get('/:cursoId', (req, res, next) => {
    const id = req.params.cursoId;
    Curso.findById(id)
    .select('tema anioDictado duracion client _id')
    .exec()
    .then(doc => {
        console.log("Desde la base de datos", doc);
        if(doc){
            res.status(200).json({
                curso: doc,
                request: {
                    type: 'GET',
                    descripcion: 'Mostrar todos los cursos',
                    url: 'http://localhost:3000/cursos/'
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


//ELIMINAR DATO
router.delete('/:cursoId', (req, res, next) => {
    const id = req.params.cursoId;
    Curso.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Curso eliminado',
            request:{
                type: 'POST',
                url: 'http://localhost:3000/cursos/',
                dabodyta: {tema: 'String', anioDictado: 'Number', duracion: 'Number', client: 'String'}
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





//Intento ingresar un alumno a un curso
router.post('/curso/:id', (req, res, next) =>{
    const curso = new Curso({
        _id: mongoose.Types.ObjectId(),
        client: [{
            alumno: req.body.alumnoId,
            nota: req.body.nota
        }]
    });
    curso.save()
    .then(result => {
        console.log(result);
        res.status(201).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});


module.exports = router;