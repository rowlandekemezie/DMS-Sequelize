/**
 * [Module dependencies]
 * @param  {[FUNCTION]} './schema' [description]
 * @return {[FUNCTION]}            [description]
 */
var schema = require('./schema'),
  strftime = require('strftime');

/**
 * [ instances of the schema]
 * @type {[function]}
 */
var User = schema.User,
    Role = schema.Role;
    Document = schema.Document;
/**
 * [method to create  User if it does not exist]
 * @param  {[STRING]} fName [description]
 * @param  {STRING} lName [description]
 * @param  {[STRING]} role  [description]
 * @return {[STRING]}       [description]
 */
exports.createUser = function(fName, lName, role, cb) {
    Role.findOrCreate({ // error: keeps populating the roles even
      where: {          // user is not created.
        title: role
      }
    }).then(function() {
      User.findOne({
        where: {
          firstName: fName,
          lastName: lName
        }
      }).then(function(user) {
        if (!user) {
          var newUser = {
            firstName: fName,
            lastName: lName,
            role: role
          };
          User.create(newUser);
          cb(null, "newUser "+fName+ " " +lName+" is created");
        } else {
          cb(fName + " " +lName+ " already exists");
        }
      });
    });
};
//createUser('law', 'Bolu', 'AwesomeAdmin');

/**
 * [ method to get all users  from the Users table]
 * @return {[JSON]} [description]
 */
exports.getAllUsers = function(cb){
 return User.findAll().then(function(users) {
     cb(null, users);
  }).catch(function(err) {
     cb(err);
  });
};
//

/**
 * [method to get a single user]
 * @param  {[STRING]} name [description]
 * @return {[JSON]}      [description]
 */
exports.getAUser = function(fName, lName, cb) {
return  User.findOne({
    where: {
      firstName: fName,
      lastName: lName
    }
  }).then(function(user) {
    if(!user) {
      cb(fName +" "+lName+ " doesn't exist");
    }else{
      cb(null, user);
    }
  });
};
// getAUser("Rowland Ekemezie");

/**
 * [ method to create A role if it does not exist]
 * @param  {[type]} postion [description]
 * @return {[type]}         [description]
 */
exports.createRole = function(postion, cb) {
  var newRole = {
    title: postion
  };
  Role.findOrCreate({
    where: newRole
  }).then(function(role) {
    if (!role) {
      cb(null, "role " + postion + " created sucessfully");
    } else {
      cb("Role already exist");
    }
  }).catch(function(err) {
    cb(err);
  });
};
//createRole("manager");

/**
 * [method to get All roles]
 * @return {[JSON]} [description]
 */
exports.getAllRoles = function(cb) {
  return Role.findAll().then(function(roles) {
    return roles;
  }).catch(function(err) {
    return err;
  });
};


exports.getARole = function(title, cb) {
  return Role.findOne({
    where: {
      title: title
    }
  }).then(function(role) {
    if (role) {
      cb(null, role);
    } else {
      cb( title + " does not exist");
    }

  }).catch(function(err) {
    return err;
  });
};

// get date method
/**
 * [method to create documents into the documents table]
 * @param  {[TEXT]} title       [description]
 * @param  {[STRING]} accessRight [description]
 * @return {[STRING]}             [description]
 */
exports.createDocument = function(title, accessRight) {
  Role.findOrCreate({
    where: {
      title: accessRight
    }
  }).then(function() {

    var newDoc = {
      docTitle: title,
      AccessTo: accessRight,
      datePublished: strftime('%B %d, %Y %H:%M:%S', new Date())
    };
    Document.create(newDoc);
  }).then(function() {
    return "document sucessfully created";
  }).catch(function(err) {
    return err;
  });
};
// createDocument('God of the Universe', 'SeniorAdmin');

/**
 * method to get all documents
 * @param  {[integer]} limit [description]
 * @return {[JSON]}       [description]
 */
exports.getAllDocuments = function(limit) {
  var getDoc = {
    order: '"createdAt" DESC',
    limit: limit,
    include: [{
      all: true
    }]
  };
  Document.findAll(getDoc).then(function(docs) {
    return docs;
  }).catch(function(err) {
    return err;
  });
};
// console.log(getAllDocuments(3));


/**
 *  [method to get documents by roles]
 * @param  {[integer]} limit [description]
 * @param  {[STRING]} role  [description]
 * @return {[JSON]}       [description]
 */
exports.getDocByRole = function(role, limit) {
  var getRole = {
    title: role,
    limit: limit,
    order: '"datePublished" DESC',
    include: [{
      all: true
    }]
  };
  Document.findAll({
    where: getRole
  }).then(function(orderedRole) {
    return orderedRole;
  }).catch(function(err) {
    return err;
  });
};

/**
 * [method to get document by Date created
 * @param  {[integer]} limit [description]
 * @param  {[STRING]} date  [description]
 * @return {[JSON]}       [description]
 */
exports.getDocByDate = function(date, limit) {
  var getDocDate = {
    datePublished: date,
    limit: limit,
    order: '"updatedAt" DESC',
    include: [{
      all: true
    }]
  };
  Document.findAll({
    where: getDocDate
  }).then(function(docs) {
    return docs;
  }).catch(function(err) {
    return err;
  });
};
