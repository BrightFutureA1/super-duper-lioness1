//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const app = express();
const db = mongoose.connection;
const router = express.Router()

// Model
const newDoctors = require('./models/model.js')
const Doctor = require('./models/doctors.js');





//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//DB Setup
// mongoose.connect('mongodb://localhost:27017/mongoosestore', { useNewUrlParser: true });
// mongoose.connection.once('open', ()=> {
//     console.log('connected to mongo');
// });
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/' + `YOUR_DATABASE_NAME`;

// Connect to Mongo
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open', () => { });

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


// ROOT
app.get('/', (req, res) => res.send('app is running on root!'))
//___________________

// // Seed data
// app.get('/model', async (req, res) => {
//   try {
//     const modelItems = await Doctor.create(newDoctors)
//     res.send(modelItems)
//   } catch (err) {
//     res.send(err.message)
//   }
// })

// INDEX
app.get('/doctors', (req, res) => {
  Doctor.find({}, (error, allDoctors) => {
    // console.log(allDoctors)
    res.render('index.ejs', {
      doctor: allDoctors
    });
  });
})

// NEW(CLIENT)
app.get('/doctors/new', (req, res) => {
  res.render('new.ejs');
})


// Routes
// app.get('/doctors/:id', (req, res) => {
//   Doctor.findById(req.params.id, (err, foundDoctor)=>{
//     res.send(foundDoctor);
//   });
//  });

// app.post('/doctors/', (req, res) => {
//   res.redirect('/doctors');
// })

// CREATE SERVER
app.post('/doctors', (req, res) => {
//   // console.log('hello');
  if(req.body.addNewDoctor === 'on'){ //if checked, req.body.addNewDoctor is set to 'on'
      req.body.addNewDoctor = true;
  } else { //if not checked, req.body.addNewDoctor is undefined
      req.body.addNewDoctor = false;
  }
Doctor.create(req.body, (error, createdDoctor) => {
    if (error) {
      res.send(error)
    } else {
      res.redirect('/doctors');
    }
  });
})



// UPDATE (SERVER)
app.put('/doctors/:id', (req, res) => {
  if(req.body.addNewDoctor === 'on'){
    req.body.addNewDoctor=true;
  } else {
    req.body.addNewDoctor=false;
  }
  Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedDoctor) => {
    // res.send(updatedDoctor)
    res.redirect('/doctors');
  });
});


// Show
app.get('/doctors/show/:id', (req, res) => {
  Doctor.findById(req.params.id, (error, allDoctors) => {
    console.log(allDoctors)
    res.render('show.ejs', {
      doctor: allDoctors
    });
  });
});

// DELETE
app.delete('/doctors/:id', (req, res) => {
  Doctor.findByIdAndRemove(req.params.id, (err, deletedDoctor) => {
    res.redirect('/doctors');
    // res.send('deleting....');
  });
})

// / EDIT(CLIENT)
app.get('/doctors/:id/edit', (req, res) => {
  Doctor.findById(req.params.id, (err, foundDoctor) => {
    res.render('edit.ejs', {
      doctor: foundDoctor
    });
  });
});













//___________________
//localhost:3000


//___________________
//Listener
//___________________
app.listen(3000, () => {
  console.log('listening on port');
});