/*
var require = __meteor_bootstrap__.require,
    Twit = require("twit");

Meteor.startup(function () {
  console.log("Genomes: starting...");
  var T = new Twit({
    consumer_key:         '8AcwevFrtDjrf94NUnYfg', 
    consumer_secret:      'ID1mxh1impvr7hHxOa1HErvfYvAS7fz3lftZCHqyk', 
    access_token:         '591141267-OgfP3drdx39Qv8dMHLSueFE6JRHiMM8nMMzLDpzx', 
    access_token_secret:  '3ALS0A6AcbU5k9QpCyUsX1mtnVeQjEH2JoyOB91lfZ8'
  });
  
  console.log(T);
  Fiber(function() {
	T.post('statuses/update', { status: 'hello world!' }, function(err, reply){
      console.log('error: ' + JSON.stringify(err,0,4));
      console.log('reply: ' + JSON.stringify(reply,0,4));
    }); 
  }).run();
});
*/