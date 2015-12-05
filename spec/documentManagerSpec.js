var dms = require('./../src/documentManager');
var seeds = require('./seed-data');
var model = require('./../model/schema');

// model instancies
var User = model.User,
  Role = model.Role,
  Document = model.Document;

describe("Document Management System", function() {
  beforeEach(function(done) {
    User.destroy({
      where: {}
    }).then(function() {
      Document.destroy({
        where: {}
      }).then(function() {
        Role.destroy({
          where: {}
        }).then(function() {
          done();
        });
      });
    });
  });

  describe('User', function() {
    var _roles = {};
    var _users = {};

    beforeEach(function(done) {
      seeds.roles(function(err, roles) {
        if (err) {
          console.log(err);
        } else {
          _roles = roles;
        }
        seeds.users(function(err, users) {
          if (err) {
            console.log(err);
          } else {
            _users = users;
          }
          done();
        });
      });
    });

    afterEach(function(done) {
      User.destroy({
        where: {}
      }).then(function() {
        Role.destroy({
          where: {}
        }).then(function() {
          done();
        });
      });
    });

    it('should return created users', function(done) {
      expect(_users.user1.dataValues.firstName).toBe('igwe');
      expect(_users.user1.dataValues.lastName).toBe('ekwe');
      expect(_users.user1.dataValues.userName).toBe('row');
      expect(_users.user1.dataValues.role).toBe('admin');
      expect(_users.user1.dataValues.email).toBe('row@gmail.com');

      expect(_users.user2.dataValues.firstName).toBe('jumai');
      expect(_users.user2.dataValues.userName).toBe('rukkky');
      expect(_users.user2.dataValues.lastName).toBe('auntie');
      expect(_users.user2.dataValues.role).toBe('admin');
      expect(_users.user2.dataValues.email).toBe('rukky@gmail.com');

      done();
    });


    it('should validates that a new user created is unique.', function(done) {
      dms.createUser("row", "row@gmail.com", "igwe", "ekwe", "admin", "awesomeGod", function(err, user) {
        expect(err).toBeDefined();
        expect(err).toEqual('User already exist');
        expect(err).not.toBeNull();
        done();
      });
    });

    it('should validates that a new user created has a role defined', function(done) {
      dms.createUser("row", "row@gmail.com", "igwe", "ekwe", "superadmin", "awesomeGod", function(err, user) {
        expect(err).toBeDefined();
        expect(err).toEqual('Role does not exist');
        done();
      });
    });

    it('should validate that a role is provided before creating a new user', function(done) {
      dms.createUser("row", "row@gmail.com", "igwe", "ekwe", undefined, "awesomeGod", function(err, user) {
        expect(err).not.toBeNull();
        expect(err).toEqual('Role does not exist');
        done();
      });
    });

    it('should validates that a new user created has both first and last names.', function(done) {
      dms.createUser("ade", 'ade@gmail.com', undefined, 'uduot', 'admin', 'wonderful', function(err) {
        expect(err).toBeDefined();
        expect(err).toEqual('Please provide your firstName and lastName');
        done();
      });
    });

    it("should validates that all users are returned when getAllUsers is called", function(done) {
      dms.getAllUsers(function(err, users) {
        expect(users.length).toBe(2);
        expect(users).not.toBeUndefined();
        done();
      });
    });
  });

  describe("Roles", function() {
    var _roles = {};
    beforeEach(function(done) {
      seeds.roles(function(err, roles) {
        if (err) {
          console.log(err);
        } else {
          _roles = roles;
          done();
        }
      });
    });
    afterEach(function(done) {
      Role.destroy({
        where: {}
      }).then(function() {
        done();
      });
    });

    it("should validates that a new role created has a unique title", function(done) {
      dms.createRole("admin", function(err, role) {
        expect(err).toEqual('Role already exist');
        expect(role).toBeNull();
        expect(err).not.toBeNull();
        expect(_roles.role1.title).toEqual('admin');
        done();
      });
      dms.createRole("manager", function(err, role) {
        expect(err).not.toBeNull();
        expect(err).toEqual('Role already exist');
        expect(role).toBeNull();
        expect(_roles.role2.title).toEqual('manager');
        done();
      });
    });

    it("should validates that all roles are returned when getAllRoles is called", function(done) {
      dms.getAllRoles(function(err, roles) {
        expect(err).not.toBeUndefined();
        expect(roles.length).toBe(2);
        expect(roles.length).not.toBe(4);
        expect(roles).not.toBeNull();
        done();
      });
    });
  });

  describe("Document", function() {

    var _roles = {};
    var _docs = {};
    beforeEach(function(done) {
      seeds.roles(function(err, roles) {
        if (err) {
          console.log(err);
        } else {
          _roles = roles;
        }
        seeds.docs(function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            _docs = docs;
          }
          done();
        });
      });
    });

    afterEach(function(done) {
      Document.destroy({
        where: {}
      }).then(function() {
        Role.destroy({
          where: {}
        }).then(function() {
          done();
        });
      });
    });

    it('should validates that all documents are returned, limited by a specified number, when getAllDocuments is called', function(done) {
      dms.getAllDocuments(1, function(err, docs) {
        expect(docs.length).toBe(1);
        expect(docs).not.toBeNull();
      });

      dms.getAllDocuments(2, function(err, docs) {
        expect(docs.length).toBe(2);
        expect(docs).not.toBeNull();
        done();
      });
    });

    it("should validates that a new user document created has a published date defined", function(done) {
      expect(_docs.doc1.datePublished).toBeTruthy();
      expect(_docs.doc2.datePublished).toBeDefined();
      expect(_docs.doc1.datePublished).not.toBeNull();
      expect(_docs.doc2.datePublished).not.toBeNull();
      done();
    });
  });

  describe('Search', function() {

    var _roles = {};
    var _docs = {};

    // date formatter method
    function dateGetter() {
      // create Date object from valid string inputs
      var datetime = new Date();

      // format the output
      var month = datetime.getMonth() + 1;
      var day = datetime.getDate();
      var year = datetime.getFullYear();

      var hour = datetime.getHours();
      if (hour < 10)
        hour = "0" + hour;

      var min = datetime.getMinutes();
      if (min < 10)
        min = "0" + min;

      var sec = datetime.getSeconds();
      if (sec < 10)
        sec = "0" + sec;

      // put it all togeter
      var dateTimeString = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      return dateTimeString;
    }

    beforeEach(function(done) {
      seeds.roles(function(err, roles) {
        if (err) {
          console.log(err);
        } else {
          _roles = roles;
        }
        seeds.docs(function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            _docs = docs;
          }
          done();
        });
      });
    });

    afterEach(function(done) {
      Document.destroy({
        where: {}
      }).then(function() {
        Role.destroy({
          where: {}
        }).then(function() {
          done();
        });
      });
    });

    it('should validate that all documents, limited by a specified number and ordered by published date, that can be accessed by a specified role', function(done) {
      dms.getDocByRole('manager', 2, function(err, docs) {
        expect(docs.length).toBe(2);
        expect(docs[0].dataValues.docTitle).toBe('The epic battle of world changers');
        expect(docs[1].dataValues.docTitle).toBe('The glory of a nation');
        expect(docs[1].dataValues.updatedAt).toBeGreaterThan(docs[0].dataValues.createdAt);
        expect(docs[0].dataValues.updatedAt).toBeLessThan(docs[1].dataValues.createdAt);
        expect(docs[0].dataValues.AccessTo).toEqual('manager');
        expect(docs[1].dataValues.AccessTo).toEqual('manager');
        done();
      });
    });

    it('should  validates that all documents, limited by a specified number, that were published on a certain date', function(done) {
      dms.getDocByDate(dateGetter(), 2, function(err, docs) {
        console.log(docs);
        expect(docs.length).toBe(2);
        expect(docs.length).not.toBe(3);
        expect(docs[0].dataValues.docTitle).toBe('The glory of a nation');
        expect(docs[0].dataValues.datePublished).toBeDefined();
        expect(docs[0].dataValues.AccessTo).toBe('manager');
        expect(docs[1].dataValues.docTitle).toBe('The beautiful ones are not yet born');
        expect(docs[1].dataValues.datePublished).toBeDefined();
        expect(docs[1].dataValues.AccessTo).toBe('admin');
        done();
      });
    });
  });
});
