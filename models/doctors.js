const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: String, 
    specialty:  String, 
    contact: String, 
    img: String,
    addNewDoctor: Boolean
    
});

const Doctor = mongoose.model('Doctors', doctorSchema);

module.exports = Doctor;