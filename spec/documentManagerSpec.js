var dms = require('./documentManager'),
  schema = require('./schema');

var expectedData = {
  firstName: 'michael',
  lastName: 'Ekwe',
  Role: 'Admin'
};

console.log(dms);
describe("User", function() {
  var _user;
  beforeEach(function(done) {
    dms.createUser('michael', 'row@gmail.com', 'Ekwe', 'Abu', 'row111', function(err, user) {
      if (err) throw err;
      _user = user;
      console.log(_user);
    });
    done();
  });
  afterEach (function(done){
   Role.destroy({});
  });

  it('should return that a new user is unique', function(done) {

    expect(_user).toBeDefined();
    expect(_user.userName).toEqual("michael");
    // expect(user.length).toBe(2);
    // expect(user.length).toBeUndefined();
    done();
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
