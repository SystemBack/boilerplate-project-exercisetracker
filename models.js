require('dotenv').config();

let mongoose;
try {
  mongoose = require("mongoose");
} catch (e) {
  console.log(e);
}
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = mongoose.Schema({
    username: {
      type: String
    },
});

let User = mongoose.model('User', userSchema);

const createUser = (username, done) => {
    const useNew = new User(username);
    useNew.save(function(err, data) {
      if (err) return console.error(err);

      done(err, data)
    });
}

const getUsers = (done) => {
  User.find({}, function(err, users) {
    if (err) return console.log(err);

    done(err, users);
  });
}

const getUserById = (id, done) => {
    User.findById(id, function(err, user) {
      if (err) return console.error(err);

        done(err, user);
    });
};

const exerciseSchema = mongoose.Schema({
    username: {
      type: String
    },
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    date: {
      type: Date
    },
});

let Exercise = mongoose.model('Exercise', exerciseSchema);

const createExercise = (data, done) => {
    const useNew = new Exercise(data);
    useNew.save(function(err, data) {
      if (err) return console.error(err);

      done(err, data)
    });
}

const getLogs = (data, done) => {
  const { username, from, to, limit } = data;
  if (from && to) {
    const query = Exercise.find({ 
        username: data.username,
        date: {
          $gte: from,
          $lte: to
        }    
    }, function(err, exercises) {
      if (err) return console.log(err);

      done(err, exercises);
    });

  } else {
    const query = Exercise.find({ 
        username: data.username        
    }, function(err, exercises) {
      if (err) return console.log(err);

      done(err, exercises);
    });
  }

  if(limit) {
    query.limit(limit)
  }

  query.exec;
}

exports.userSchema = User;
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.userSchema = Exercise;
exports.createExercise = createExercise;
exports.getLogs = getLogs;