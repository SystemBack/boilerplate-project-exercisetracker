const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const cors = require('cors')
require('dotenv').config()

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}

app.get("/is-mongoose-ok", function (req, res) {
  if (mongoose) {
    res.json({ isMongooseOk: !!mongoose.connection.readyState });
  } else {
    res.json({ isMongooseOk: false });
  }
});

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const getUsers = require('./models').getUsers;
app.get('/api/users', (req, res) => {
  getUsers(function(err, users) {

    const formatUsers = users.map(user => data = {username: user.username, _id: user._id});

    return res.json(formatUsers);
  });
});

const createUser = require('./models').createUser;
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  createUser({username}, function(err, user) {

    return res.json({username, _id: user._id});
  });
});


const getUserById = require('./models').getUserById;
const createExercice = require('./models').createExercise;
app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const dateFormatted = date ? new Date(date) : new Date();

  const { _id } = req.params
  getUserById(_id, function(err, user) {
    if (!user) {
      res.json({error: 'User not found'});
    }

    createExercice({ username: user.username, description, duration, date: dateFormatted }, function(err, exercise) {

      res.json({
        username: user.username,
        description,
        duration,
        date: dateFormatted.toDateString(),
        _id: exercise._id
      });
    });

  });
});

const getLogs = require('./models').getLogs;
app.get('/api/users/:_id/logs', (req, res) => {
  let {from, to, limit} = req.query;
  if (from && to) {
    from = new Date(from);
    fo = new Date(to);
  }
  if(limit) {
    limit = parseInt(limit);
  }

  const { _id } = req.params
  getUserById(_id, function(err, user) {
    if (!user) {
      res.json({error: 'User not found'});
    }

    getLogs({ username: user.username, from, to, limit }, function(err, exercises) {
      const exercisesDetails = exercises.map(exercise => data = { description: exercise.description, duration: exercise.duration, date: exercise.date.toDateString() })
      const info = {
        username: user.username,
        count: exercisesDetails.length,
        duration,
        date: dateFormatted.toDateString(),
        _id: user._id
      };

      res.json(info);
    });

  });
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
