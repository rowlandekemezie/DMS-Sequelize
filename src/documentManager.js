/**
 * [Module dependencies]
 * @param  {[FUNCTION]} './schema' [the schema definitions]
 * @return {[FUNCTION]}            [returns User, Role, and Document schemas]
 */
var schema = require('./../model/schema'),
  strftime = require('strftime'),
  Sequelize = require('sequelize');

/**
 * [ instances of the schema]
 * @type {[function]}
 */
var User = schema.User,
  Role = schema.Role;
Document = schema.Document;

/**
 * [method to create  User if it does not exist]
 * @param  {[STRING]}   username [a unique username to be supplied]
 * @param  {[STRING]}   email    [a unique email to be supplied]
 * @param  {[STRING]}   fName    [user's firstName must be provided]
 * @param  {[STRING]}   lName    [user's lastName must be provided]
 * @param  {[STRING]}   role     [a role must be provided for succesful registration]
 * @param  {STRING} cb       [the callback reports to return based on the outcome]
 * @return {[JSON]}            [a json object of the new user is returned on success]
 */

exports.createUser = function(userName, email, fName, lName, role, password, cb) {

  if (!(fName && lName)) {
    cb("Please provide your firstName and lastName");
  } else {
    return Role.findOne({
      where: {
        title: role
      }
    }).then(function(roles) {

      if (!roles) {
        cb("Role does not exist", null);
        return;
      } else {
        User.findOne({
          where: {
            userName: userName,
            email: email
          }
        }).then(function(users) {

          if (!users) {
            User.create({
              userName: userName,
              email: email,
              firstName: fName,
              lastName: lName,
              role: role,
              password: password
            }).then(function(nuser) {
              cb(null, nuser);
            });
          } else {
            cb("User already exist", null);
          }
        });
      }
    });
  }
};

/** [A method that gets all the users from the users table]
 * @method getAllUsers
 * @param  {Function} cb [a callback that returns the result of the method]
 * @return {[JSON]}      [a json object  of all the users is returned on success]
 */
exports.getAllUsers = function(cb) {
  return User.findAll().then(function(users) {
    if (users.length > 0) {
      cb(null, users);
    } else {
      cb("Sorry! No user exist", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 * [method to get a single user]
 * @method getAUser
 * @param  {[STRING]} name [the username of the user must be provided]
 * @return {[JSON]}      [a json object of new user is returned on success]
 */
exports.getAUser = function(userName, cb) {
  return User.findOne({
    where: {
      userName: userName
    }
  }).then(function(user) {
    if (user) {
      cb(null, user);
    } else {
      cb("User does not exist", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 *  [ method to create A role if it does not exist]
 * @method createRole
 * @param  {[STRING]} position [a position to be created must be supplied]
 * @param  {Function} cb       [a callback for the method's return value]
 * @return {[JSON]}         [returns a json object of the new role created on success]
 */
exports.createRole = function(position, cb) {

  return Role.findOne({
    where: {
      title: position
    }
  }).then(function(role) {
    if (role) {
      cb("Role already exist", null);
    } else {
      Role.create({
        title: position
      }).then(function(role) {
        cb(null, role);
      });
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 * [Method that returns all the roles in the roles table]
 * @method getAllRoles
 * @param  {Function} cb [a callback for success or failure of the search]
 * @return {[JSON]} [returns the json object of all the record in the table]
 */
exports.getAllRoles = function(cb) {
  return Role.findAll().then(function(roles) {
    if (roles.length < 1) {
      cb("no role exist", null);
    } else {
      cb(null, roles);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 * [Method to get the record of a single role]
 * @method getARole
 * @param  {STRING}   title [the roles must be provided as a search criteria]
 * @param  {Function} cb    [a callback for a success or failure]
 * @return {[JSON]}         [returns a json object of the role record]
 */
exports.getARole = function(title, cb) {
  return Role.findOne({
    where: {
      title: title
    }
  }).then(function(role) {
    if (role) {
      cb(null, role);
    } else {
      cb("Role does not exist", null);
    }
  });
};

// method to format date 
function dateGetter(){
// create Date object from valid string inputs
var datetime = new Date();

// format the output
var month = datetime.getMonth()+1;
var day = datetime.getDate();
var year = datetime.getFullYear();

var hour = datetime.getHours();
if (hour < 10)
    hour = "0"+hour;

var min = datetime.getMinutes();
if (min < 10)
    min = "0"+min;

var sec = datetime.getSeconds();
if (sec < 10)
    sec = "0"+sec;

// put it all togeter
var dateTimeString = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
  return dateTimeString;
}
/**
 * [method to create documents into the documents table]
 * @method createDocument
 * @param  {[STRING]}   title       [description]
 * @param  {[STRING]}   accessRight [description]
 * @param  {Function} cb          [description]
 * @return {[JSON]}               [description]
 */
exports.createDocument = function(title, accessRight, cb) {

  return Role.findOne({
    where: {
      title: accessRight
    }
  }).then(function(role) {
    if (role) {
      return Document.findOne({
        where: {
          docTitle: title,
          AccessTo: accessRight
        }
      }).then(function(docs) {
        if (!docs) {
          var newDoc = {
            docTitle: title,
            AccessTo: accessRight,
            datePublished:  dateGetter()
          };
          Document.create(newDoc).then(function(doc) {
            cb(null, doc);
          });
        } else {
          cb("Document already exist", null);
        }
      });
    } else {
      cb("Role does not exist", null);
    }
  });
};

/**
 * method to get all documents
 * @method getAllDocuments
 * @param  {[integer]} limit [limits the number of rows to output]
 * @return {[JSON]}       [returns a json object of all the documents in the table]
 */
exports.getAllDocuments = function(limit, cb) {
  var getDoc = {
    order: '"createdAt" DESC',
    limit: limit,
  };
  Document.findAll(getDoc).then(function(docs) {
    if (docs.length > 0) {
      cb(null, docs);
    } else {
      cb("No document exist in the database", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 *  [method to get documents by roles]
 * @method getDocByRole
 * @param  {[integer]} limit [An optional parameter to limit the search result]
 * @param  {[STRING]} role  [role must be provided to use this function]
 * @return {[JSON]}       [returns the rows that matches the query role]
 */
exports.getDocByRole = function(role, limit, cb) {
  var getRole = {
    AccessTo: role
  };
  return Document.findAll({
    where: getRole,
    limit: limit,
  }).then(function(roles) {
    if (roles.length > 0) {
      cb(null, roles);
    } else {
      cb("No document exist for the role", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};

/**
 * [method to get document by Date created
 * @method getDocByDate
 * @param  {[integer]} limit [an optional parameter could be provided to limit the result]
 * @param  {[STRING]} date  [data must be supplied as a string value]
 * @return {[JSON]}       [returns the rows that matches the query date]
 */
exports.getDocByDate = function(date, limit, cb) {
  var getDocDate = {
    datePublished: date
  };
  Document.findAll({
    where: getDocDate,
    limit: limit,
    order: '"updatedAt" DESC',
  }).then(function(docs) {
    if (docs.length > 0) {
      cb(null, docs);
    } else {
      cb("No document found for the date", null);
    }
  }).catch(function(err) {
    cb(err, null);
  });
};
