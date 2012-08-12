
Template.favourite_list.events = {
  'click .favourite-item': function (event) {
	var favourite_name = event.target.getAttribute("data-value");
    Session.set("favourite", favourite_name);
    console.log("Set current favourite: ", favourite_name);
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