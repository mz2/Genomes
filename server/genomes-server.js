Meteor.startup(function () {
  // code to run on server at startup
	Projects = new Meteor.Collection("projects");
	Sources = new Meteor.Collection("sources");

	Meteor.publish("projects", function() { console.log("Getting projects"); return Projects.find({}); });

	Favourites = new Meteor.Collection("favourites");

	Meteor.publish("favourites", function(project) { 
		console.log("Getting favourites for project '" + project + "'");
		return Favourites.find({project: project});
	});
	
	Meteor.publish("sources", function() { console.log("Getting sources"); return Sources.find({}); });
});