(function() {'use strict';})();

// model dependencies and connection instance
var Sequelize = require('sequelize'),
  uri = "postgres://postgres:ALMIGHTY@localhost/ubuntu",
  db = new Sequelize(uri);

// define the model for users
 var User = db.define("User", {

      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          isAlpha: true
        }
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          isAlpha: true
        }
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      }
  }),

// define the model for roles
 Role = db.define("Role", {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey : true,
        unique: true
      }
  }),

// define the model for document
 Document = db.define("Document", {
    docTitle : {
      type: Sequelize.TEXT,
      allowNull : false
    },
    datePublished: {
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        isDate: true
      }
    },
    AccessTo: {
      type: Sequelize.STRING,
      allowNull:false
    }
});

// each user has a role with a foreignKey set as 'role'
User.belongsTo(Role, {
    foreignKey: 'role',
    targetKey: 'title'
});

// each document is accessible to a particular role
Document.belongsTo(Role, {
    foreignKey: 'AccessTo',
    targetKey: 'title'
});

// synchronize database with the model
db.sync().then();

/**
 * [schema exports]
 * @type {[type]}
 */
exports.User = User;
exports.Role = Role;
exports.Document = Document;
