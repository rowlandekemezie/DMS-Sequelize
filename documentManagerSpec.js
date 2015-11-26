var dms = require('./documentManager'),
  schema = require('./schema');

var expectedData = {
  firstName: 'michael',
  lastName: 'Ekwe',
  Role: 'Admin'
};

console.log(dms);
describe("User", function() {
  beforeEach(function(done) {
   dms.createUser('michael', 'row@gmail.com', 'Ekwe', 'Abu', 'row111', function(err) {
      if(err) throw err;
      done();
    });
  });

  // afterEach(function(done) {
  //   schema.User.destroy({
  //     where: {}
  //   }).then(function() {
  //     schema.Role.destroy({
  //       where: {}
  //     });
  //     done();
  //   });
  // }, 20000);
  it('should return that a new user is unique', function(done) {
    schema.User.findAll({
      where: {
        userName: 'michael'
      }
    }).then(function(user){
      expect(user).toBeDefined();
      expect(user).toEqual("michael");
      // expect(user.length).toBe(2);
      // expect(user.length).toBeUndefined();
      done();
    });
 });
}, 20000);

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
