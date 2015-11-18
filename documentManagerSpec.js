var dms = require('./documentManager'),
  schema = require('./schema');

describe("User", function() {
  beforeEach(function(done) {
    schema.User.destroy({
      where:{}
    }).then(function() {
      dms.createUser('michael', 'Ekwe', 'Admin', function() {
        done();
      });
    });
  });

  afterEach(function(done) {
    schema.User.destroy({
      where: {}
    }).then(function() {
      schema.Role.destroy({
        where: {}
      });
      done();
    });
  });

  it('should return that a new user is unique', function() {
    schema.User.findOne({
      where: {
        firstName: "michaele"
      }
    }).then(function(user) {
      expect(user).toBeDefined();
      expect(user.firstName).toBeUndefined();
      expect(user.length).toBe(1);
      expect(user.length).not.toBeUndefined();
      done();
    });
  });
});

// describe("Role", function(){
//
// });
//
// describe("Document", function(){
//
// });
//
// describe("Search", function(){
//
// });
