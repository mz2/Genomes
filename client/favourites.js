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

Template.favourite_list.events = {
  'click .favourite-item': function (event) {
	var favourite_name = event.target.getAttribute("data-value");
    Session.set("favourite", favourite_name);
    console.log("Set current favourite: ", favourite_name);
  }
};