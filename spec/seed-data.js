var dms = require('../documentManager');
var async = require('async');

module.exports = {
 roles: function(done) {
  async.parallel({
    role1: function(cb) {
     dms.createRole("admin", function(err, role) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, role);
      }
     });
    },
    role2: function(cb) {
     dms.createRole("manager", function(err, role) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, role);
      }
     });
    }
   },
   function(err, roles) {
    if (err) {
     done(err, null);
    } else {
     done(null, roles);
    }
   });
 },

 docs: function(done) {
  async.series({
    doc1: function(cb) {
     dms.createDocument("The epic battle of world changers", 'manager', function(err, doc) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, doc);
      }
     });
    },
    doc2: function(cb) {
     dms.createDocument("The beautiful ones are not yet born", 'admin', function(err, doc) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, doc);
      }
     });
    },
    doc3: function(cb) {
     dms.createDocument("The glory of a nation", 'manager', function(err, doc) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, doc);
      }
     });
    }
   },
   function(err, docs) {
    if (err) {
     done(err, null);
    } else {
     done(null, docs);
    }
   });
 },
 users: function(done) {
  async.parallel({
    user1: function(cb) {
     dms.createUser("row", "row@gmail.com", "igwe", "ekwe", "admin", "awesomeGod", function(err, user) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, user);
      }
     });
    },
    user2: function(cb) {
     dms.createUser("rukkky", 'rukky@gmail.com', "jumai", 'auntie', 'admin', 'greatness', function(err, user) {
      if (err) {
       cb(err, null);
      } else {
       cb(null, user);
      }
     });
    }
   },
   function(err, users) {
    if (err) {
     done(err, null);
    } else {
     done(null, users);
    }
   });
 }


};
