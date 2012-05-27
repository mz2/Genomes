var GenomesRouter = Backbone.Router.extend({
  routes: {
	"project/:new": "new_project",
	"projects/:project": "project"
  },
  new_project: function () {
	console.log("New Project");
  },
  create_project: function(project_name) {
	console.log("Create project " + project_name);
	if (project_name)
		Projects.insert({name: project_name});
  },
  project: function (project) {
	if (project){
		console.log("Navigated to project " + project);
		Session.set("project", project);		
	}
  },
  defaultRoute: function (path) {
	console.log("Default route hit with path '" + path + "'");
  }
});

Router = new GenomesRouter();