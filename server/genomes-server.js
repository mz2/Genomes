// Callback to determine if modification / removal is allowed
// Adapted from:
// https://github.com/meteor/meteor/blob/171816005fa2e263ba54d08d596e5b94dea47b0d/examples/todos/server/access_control.js
var canModifyOwn = function(userId, objs) {
	return _.all(objs, function(obj) {
		return !obj.privateTo || obj.privateTo === userId;
	});
};

var isLoggedIn = function(userId) {
	return userId != null;
}

var allowAlways = function() {
	return true;
}

Meteor.startup(function () {
  // code to run on server at startup
	Projects = new Meteor.Collection("projects");
	Sources = new Meteor.Collection("sources");
	SourceKeywords = new Meteor.Collection("source_keywords");

	Meteor.publish("projects", function() { console.log("Getting projects"); return Projects.find({}); });
	
	Meteor.publish("source_keywords", function() {console.log("Getting keywords"); return SourceKeywords.find({}); });

	Favourites = new Meteor.Collection("favourites");

	Meteor.publish("favourites", function(project) { 
		console.log("Getting favourites for project '" + project + "'");
		return Favourites.find({project: project});
	});
	
	Meteor.publish("sources", function() { console.log("Getting sources"); return Sources.find({}); });
	
	Projects.allow({
		insert: allowAlways,
		update: canModifyOwn,
		remove: canModifyOwn,
		fetch: ['privateTo']
	});
	
	Favourites.allow({
	    insert: isLoggedIn,
		update: isLoggedIn,
		remove: isLoggedIn,
		fetch: ['privateTo']
	});

    // cannot be removed
	Sources.allow({
	    insert: isLoggedIn,
		update: isLoggedIn,
		fetch: allowAlways
	});
	
	// cannot be removed
	SourceKeywords.allow({
	    insert: isLoggedIn,
		update: isLoggedIn,
		fetch: allowAlways
	});
});