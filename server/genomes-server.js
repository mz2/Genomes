Meteor.startup(function () {
  // code to run on server at startup
});

Projects = new Meteor.Collection("projects");
Favourites = new Meteor.Collection("favourites");

Meteor.publish("projects", function() { console.log("Getting projects"); return Projects.find({}); });
Meteor.publish("favourites", function(project) { 
	console.log("Getting favourites for project '" + project + "'");
	//console.log(Favourites.find({project: project}).fetch());
	return Favourites.find({project: project}).fetch();
});