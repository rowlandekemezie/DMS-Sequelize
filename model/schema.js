(function() {'use strict';})();

// model dependencies and connection instance
var Sequelize = require('sequelize'),
    validator = require('validator'),
    uri = "postgres://postgres:ALMIGHTY@localhost/andela",
    db = new Sequelize(uri);

// define the model for users
 var User = db.define("User", {
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type : Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
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
        allowNull: false
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
      type: Sequelize.DATE,
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

// exporting the schema definitions
// and exposing it to modules that requires it
exports.User = User;
exports.Role = Role;
exports.Document = Document;
