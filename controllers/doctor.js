const express = require('express')
const router = express.Router()


// MODEL
const Doctor = require('./../models/model.js')

// INDEX
router.get('/', (req, res) => {
    Doctor.find({}, (error, allDoctors)=>{
        res.render('index.ejs', {
            doctors: allDoctors
        });
    });
})

// NEW (CLIENT)
router.get('/new', (req, res) => {
    res.render('new.ejs')
})

// SHOW
router.get('/doctors/:id', (req, res) => {
    Doctor.findById(req.params.id, (err, foundDoctor)=>{
        res.render('show.ejs', {
            doctor: foundDoctor
        });
    });
})

// CREATE (SERVER)
router.post('/', (req, res) => {
    if (req.body.addNewDoctor === 'on') {
        req.body.addNewDoctor = true;
    } else {
        req.body.addNewDoctor = false;
    }
    Doctor.create(req.body, (error, createdDoctor)=>{
        if (error) {
            res.send(error)
        } else {
            res.redirect('/doctors');
        }
    });
})

// DELETE
router.delete('/:id', (req, res) => {
    Fruit.findByIdAndRemove(req.params.id, (err, deletedDoctor)=>{
        res.redirect('/doctors');//redirect back to fruits index
    });
})

// EDIT (CLIENT)
router.get('/:id/edit', (req, res)=>{
    Doctor.findById(req.params.id, (err, foundDoctor)=>{ //find the fruit
        res.render('edit.ejs', {
            doctor: foundDoctor //pass in found fruit
        });
    });
});

// UPDATE (SERVER)
router.put('/:id', (req, res)=>{
    if(req.body.addNewDoctor === 'on'){
        req.body.addNewDoctor = true;
    } else {
        req.body.addNewDoctor = false;
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedFruit)=>{
        res.redirect('/doctors');
    });
});

module.exports = router