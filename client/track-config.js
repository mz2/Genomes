Template.track_config_dialog.events = {
	'input #track-typeahead': function(event) {
		Session.set("available-tracks-filter", $('#track-typeahead').val());
		var sources = Dalliance.sources;
		var availableSources = Dalliance.availableSources.value;
		var allSources = availableSources.slice(0);
		for (var i = 0; i < sources.length; i++) {
			allSources.push(sources[i]);
		}
		
		refreshSources(sources, availableSources);
	}
};

var refreshSources = function(sources, availableSources) {
	var tableElem = makeElement("table", "", {className:'track-config-available-tracks-table'}, {});
	tableElem.style.width = "300px";
	var tHeadElem = makeElement("thead", "", {className:'track-config-available-tracks-thead'}, {});
	tableElem.appendChild(tHeadElem);
	var available_tracks_container = $('#track-config-available-tracks-container').get(0);
	
	var children = $('#track-config-available-tracks-container').children().get()
	for (var i = 0; i < children.length; i++){
		available_tracks_container.removeChild(children[i]);
	}
	
	for (var i = 0; i < availableSources.length; i++){
		var source = availableSources[i];
		var sourceFilter = Session.get("available-tracks-filter");
		console.log(source.name);
		console.log(sourceFilter);
		if (sourceFilter) {
			var filterExp = new RegExp(sourceFilter, 'i');
			if (!filterExp.test(source.name) &&
			    !filterExp.test(source.desc)) continue;
		}
		
		var trElem = makeElement("tr", "", {}, {});
		tHeadElem.appendChild(trElem);
		
		var includeElem 
			= makeElement("td", "", {}, {});
		var checkboxLabelElem 
			= makeElement("label", source.name, {className:'checkbox'}, {});
		var checkboxElem 
			= makeElement("input", "", {checked:false, type:'checkbox', className:'available-track-source-selection'}, {});
		
		checkboxElem.setAttribute('data-name', source.name);
		checkboxElem.setAttribute('data-value', source.source_uri);
		
		includeElem.appendChild(checkboxLabelElem);
		checkboxLabelElem.appendChild(checkboxElem);
					
		trElem.appendChild(includeElem);
	}
	
	var yourSourcesTBody = $('#track-config-your-tracks-tbody').get(0);
	var yourChildren = $('#track-config-your-tracks-tbody').children().get();
	for (var i = 0; i <  yourChildren.length; i++){
		yourSourcesTBody.removeChild(yourChildren[i]);
	}
	
	for (var i = 0; i < sources.length; i++){
		var source = sources[i];
		
		var trElem = makeElement("tr", "", {}, {});
		
		var includeElem = makeElement("td", "", {}, {});
		var checkboxLabelElem = makeElement("label", source.name, {className:'checkbox'}, {});
		var checkboxElem 
			= makeElement("input", "", {checked:true, type:'checkbox', className:'your-track-source-selection'}, {});
		
		checkboxElem.setAttribute('data-name', source.name);
		checkboxElem.setAttribute('data-value', source.source_uri);
		
		includeElem.appendChild(checkboxLabelElem);
		checkboxLabelElem.appendChild(checkboxElem);
		
		trElem.appendChild(includeElem);
		yourSourcesTBody.appendChild(trElem);
	}
	
	available_tracks_container.appendChild(tableElem);
};

var persistMissingSources = function(allSources){
	for (var i = 0; i < allSources.length; i++){
		var source = allSources[i];
		var uri = source.source_uri;
		var existingSource = Sources.findOne({source_uri: uri});
		if (!existingSource){
			console.log("Persisted previously unseen source " + uri);
			Sources.insert(source);
		}
		else
		{
			//console.log("Source " + uri + " already exists");
		}
	}
}

var addTrackHandler = function(event){ 
	var checkbox = event.target;
	var uri = checkbox.getAttribute('data-value');
	var name = checkbox.getAttribute('data-name');
	var source = Sources.findOne({'source_uri': uri});
	var yourSourcesTBody = $('#track-config-your-tracks-tbody').get(0);
	
	if (!source){
		alert("Could not find source with source URI '" + uri + "'");
	}
	else{
		Dalliance.addTier(source);
		var trElem = checkbox.parentNode.parentNode.parentNode;
		if (trElem.tagName.toLowerCase() == 'tr') { trElem.parentNode.removeChild(trElem); }
		yourSourcesTBody.appendChild(trElem);
		checkbox.className = 'your-track-source-selection';
	}
};

var removeTrackHandler = function(event){
		var checkbox = event.target;
	var uri = checkbox.getAttribute('data-value');
	var name = checkbox.getAttribute('data-name');
	var source = Sources.findOne({'source_uri': uri});
	
	if (!source){
		alert("Could not find source with source URI '" + uri + "'");
	}
	else{
		var trElem = checkbox.parentNode.parentNode.parentNode;
		if (trElem.tagName.toLowerCase() == 'tr') { trElem.parentNode.removeChild(trElem); }
		tHeadElem.appendChild(trElem);
		checkbox.className = 'available-track-source-selection';
		Dalliance.removeTier(source);
	}
};
