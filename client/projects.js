Projects = new Meteor.Collection("projects");
Favourites = new Meteor.Collection("favourites");

Genomes = {}

Genomes.log = function(message) {
  if(console && console.log) {
    console.log(message);
  }
}

Genomes.init = function() {
  Genomes.log('init');
  Session.set('loaded', true);
}

Genomes.projectsLoaded = function() {
  Genomes.log('projects loaded');
}

Genomes.favouritesLoaded = function() {
  console.log('favourites loaded');
  Meteor.flush();
}


Meteor.subscribe("projects", Genomes.projectsLoaded);

Meteor.autosubscribe(function() {
	var project = Session.get('project');
	console.log("Autosubscribing " + project);
	if (project)
		Meteor.subscribe("favourites", Session.get("project"), Genomes.favouritesLoaded);
});

/*
Template.container.project_list_header = function() {
	if (Session.get('project')){
		return "Project: " + Session.get('project');
	}
	else
		return "Projects";
}*/

Template.project_list.projects = function() { return Projects.find({}); }

Template.favourite_list.favourites = function() {
	var project = Session.get("project");
	if (Session.get('project') == project)
	{
		console.log("Getting favourite list for project " + project);
		var favs = Favourites.find({'project': project});
		return favs;
	}
	else
	{
		console.log("Getting favourite list for NULL project.");
		return [];		
	}
}

var okcancel_events = function (selector) {
  return 'keyup ' + selector + ', keydown ' + selector + ', focusout '+ selector;
};

var make_okcancel_handler = function (options) {
  var ok = options.ok || function () {};
  var cancel = options.cancel || function () {};

  return function (evt) {
    if (evt.type === "keydown" && evt.which === 27) {
      // escape = cancel
	  console.log("Cancel search");
      cancel.call(this, evt);
    } else if (evt.type === "keydown" && evt.which === 13) {
      // blur/return/enter = ok/submit if non-empty
      var value = String(evt.target.value || "");
      console.log("Submit value '" + value + "'");
	  ok.call(this, value, evt);
    }
    else
    {
	  //console.log("Event type: " + evt.type + " evt.which: " + evt.which);
    }
  };
};

Template.project_list.events = {
  'click .project-item': function (event) {
	var project_name = event.target.childNodes[0].nodeValue;
    Meteor.flush(); // update DOM before focus
	Session.set("project", project_name);
  },
  'click .rename-project': function (event) {
	var proj_name = event.target.getAttribute("data-value");
	console.log("rename:" + proj_name);
	if (proj_name){
		$('#renamed-project-name').text(proj_name);
		$('#renamed-project-field').val(proj_name);
		$('#rename-project-save-changes').click(function(event) {
			Projects.update({name:proj_name}, {name: $('#renamed-project-field').val()} ) 
		});
		$('#rename-project-modal').modal({backdrop: true, keyboard: true, show: true});
	}
  },
  'click .delete-project': function (event) {
	var proj_name = event.target.getAttribute("data-value");
	console.log("delete project:" + proj_name);
	if (proj_name) {
		Projects.remove({name: proj_name});
		Favourites.remove({project: proj_name});
    }
  },
  'click .copy-project-link': function (event) {
	alert("copy project:" + event.target);
	console.log("copy link to project:" + event.target);
	//TODO: Implement with the Backbone router
  }
};

Template.project_item.selected = function() {
	return (Session.get('project') == this.name) && !Session.get('creating_project');
}

Template.project_create.events = {
	'click #start-new-project': function() {
		Session.set("creating_project", true);
	},
	'click #stop-creating-new-project': function() {
		Session.set("creating_project", false);
	}
};

Template.project_list.editing = function() {
	return Session.get("creating_project");
}

Template.project_create.editing = function() {
	return Session.get("creating_project");
}

Template.project_create.events[okcancel_events('#new-project')] =
make_okcancel_handler({
	ok: function (text, evt)
	{
		console.log("Project name: " + text);
		if (text.length > 1)
		{
			Projects.insert({name: text});
		}
		else
		{
			console.log("Empty project name!");
		}
		evt.target.blur();
	}
});

Template.favourite_list.events = {
  'click .favourite-item': function (event) {
	var favourite_name = event.target.getAttribute("data-value");
    Session.set("favourite", favourite_name);
  }
};

Template.favourite_create.events = {};

Template.favourite_create.events[okcancel_events('#new-favourite')] =
make_okcancel_handler({
	ok: function(text, evt)
	{
		console.log("Favourite name: " + text);
		if (text.length > 1)
		{
			console.log("Inserting favourite");
			Favourites.insert({project: Session.get('project'), name: text})
		}
		else
		{
			console.log("Empty favourite name!");
		}
		evt.target.blur();
	}
});