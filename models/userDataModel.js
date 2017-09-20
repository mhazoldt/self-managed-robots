let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
    username: {
        type: "string",
        index: "true",

    },
    password: {
        type: "string"
    },
    email: {
        type: "string"
    },
    name: {
        type: "string"
    },
    avatar: {
        type: "string"
    },
    job: {
        type: "string"
    },
    company: {
        type: "string"
    },
    city: {
        type: "string"
    },
    country: {
        type: "string"
    },
    phone: {
        type: "string"
    },
    univerity: {
        type: "string"
    },
    skills: {
        type: []
    }

})

let User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

module.exports.updateUser = function(userData, callback){
    console.log("trying to update user")
    console.log(userData.name)
    console.log(userData.username)
    let query = {username: userData.username}
    let options = {name: userData.name}
    User.update(query, options, callback)
}


module.exports.getUserByUsername = function(username, callback) {
    let query = {username: username}
    User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err
        callback(null, isMatch)
    })
}

module.exports.getAllUsers = function(req, res, callback) {
    User.find({}, function(err, users) {
        callback(req, res, users)
    })
    
}

module.exports.getEmployedUsers = function(req, res, callback) {
    User.find({job:{$ne:null}}, function(err, users) {
        callback(req, res, users)
    })
    
}

module.exports.getUnemployedUsers = function(req, res, callback) {
    User.find({job: null}, function(err, users) {
        callback(req, res, users)
    })
    
}