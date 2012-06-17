var TAGVAL_NOTE_RE = new RegExp('^([A-Za-z]+)=(.+)');


$(document).bind('DOMNodeInserted', function(event)
{
	if (event.target.id == "content_container")
	{
		Dalliance = new Browser({
			chr:          '22',
			pageName:     'browser_container',
			viewStart:    30000000,
			viewEnd:      30030000,
			cookieKey:    'human',

			sources:      [{name:'Genome',
			 					source_uri: 'hg18comp',
						   		uri: 'http://www.derkholm.net:8080/das/hg18comp/',
						   		tier_type: 'sequence',
						   		provides_entrypoints: true}, 
						   {name: 'Genes',  
								desc: 'Gene structures from Ensembl 54',
								source_uri: 'hsa_54_36p',
								uri: 'http://www.derkholm.net:8080/das/hsa_54_36p/', 
								collapseSuperGroups:  true,
								provides_karyotype:   true,
								provides_search:      true},
						   {name: 'Repeats', 
						  		source_uri: 'hsa_54_36p',
							 	uri: 'http://www.derkholm.net:8080/das/hsa_54_36p/', 
							 	stylesheet_uri: 'http://www.derkholm.net/dalliance-test/stylesheets/ens-repeats.xml'},
						 	{name: 'MeDIP raw', source_uri:'medipseq_reads', uri: 'http://www.derkholm.net:8080/das/medipseq_reads'},
						 	{name: 'MeDIP-seq', source_uri:'batman_seq_SP', uri: 'http://www.ebi.ac.uk/das-srv/genomicdas/das/batman_seq_SP/'}],
			searchEndpoint: new DASSource('http://www.derkholm.net:8080/das/hsa_54_36p/'),
			browserLinks: {
				Ensembl: 'http://ncbi36.ensembl.org/Homo_sapiens/Location/View?r=${chr}:${start}-${end}',
				UCSC: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg18&position=chr${chr}:${start}-${end}',
			},
			disablePoweredBy: true
		});

	    Dalliance.addFeatureListener(function(ev, hit) {
		$('.popover').remove();
		var mx = ev.clientX + window.scrollX, my = ev.clientY + window.scrollY;
		var popup = makeElement('div', '', {className: 'popover fade right in'}, {
                    position: 'absolute',
                    top: '' + my - 50 + 'px',
                    left: '' + mx - 5 + 'px',
                    display: 'block',
                    maxWidth: '400px'
		});


		var name = hit.type;
		var fid = pick(hit.label, hit.id);
		if (fid && fid.indexOf('__dazzle') != 0) {
		    name = name + ': ' + fid;
		}

		var tbody = makeElement('tbody', null);
		var table = makeElement('table', tbody, {className: 'table table-striped table-condensed table-bordered'}, {width: '100%', margin: '0px'});

		
		tbody.appendChild(makeElement('tr', [makeElement('td', 'test'),
						     makeElement('td', 'blah')]));
		tbody.appendChild(makeElement('tr', [makeElement('td', 'test2'),
						     makeElement('td', 'blah2')]));


		if (hit.score !== undefined && hit.score !== null && hit.score != '-') {
		    var row = makeElement('tr', [
			makeElement('th', 'Score'),
			makeElement('td', '' + hit.score)
		    ]);
		    tbody.appendChild(row);
		}
		{
		    var links = hit.links || [];
		    if (links && links.length > 0) {
			var row = makeElement('tr', [
			    makeElement('th', 'Links'),
			    makeElement('td', links.map(function(l) {
				return makeElement('div', makeElement('a', l.desc, {href: l.uri, target: '_new'}));
			    }))
			]);
			tbody.appendChild(row);
		    }
		}
		{
		    var notes = hit.notes || [];
		    for (var ni = 0; ni < notes.length; ++ni) {
			var k = 'Note';
			var v = notes[ni];
			var m = v.match(TAGVAL_NOTE_RE);
			if (m) {
			    k = m[1];
			    v = m[2];
			}
			
			var row = makeElement('tr', [
			    makeElement('th', k),
			    makeElement('td', v)
			]);
			tbody.appendChild(row);
		    }
		}

		var popover_arrow   = makeElement('div', '', {className: 'arrow'}, {});
		var popover_inner   = makeElement('div', '', {className: 'popover-inner'}, {});
		var popover_title   = makeElement('h3' , name, {className: 'popover-title'}, {});
		var pop_dismiss_btn = makeElement('button', '', {id: 'dismissbutton', className: 'dismissbutton close'}, {
		    float: 'right',
		    'vertical-align': 'top',
		    height: '20px',
		});
		var pop_dismiss_img = makeElement('i', '', {className: 'icon-remove'}, {
		    'vertical-align': 'top'
		});
		var popover_content = makeElement('div', table, {className: 'popover-content'}, {padding: '0px', margin: '0px'});
		popup.appendChild(popover_arrow);
		popup.appendChild(popover_inner);
		popover_inner.appendChild(popover_title);
		popover_title.appendChild(pop_dismiss_btn);
		pop_dismiss_btn.appendChild(pop_dismiss_img);
		popover_inner.appendChild(popover_content);
		
		Dalliance.svgHolder.appendChild(popup);
			
		$('#dismissbutton').click(function() { $('.popover').remove() });
	    });
		

	  	Dalliance.addViewListener(function(chr, min, max) {
		  	Session.set('chromosome', chr);
			Session.set('chromosome_min', min);
			Session.set('chromosome_max', max);
	  	});
	
	 	Dalliance.addRegionSelectListener(function(chr, min, max) {
	      Dalliance.highlightRegion(chr, min, max);
	  	});
		
		!function(d,s,id){
			var js,fjs=d.getElementsByTagName(s)[0];
			if(!d.getElementById(id)){
				js=d.createElement(s);
				js.id=id;
				js.src="//platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js,fjs);
			}
		}(document,"script","twitter-wjs");
		
	}
});

$(document).click(function(e){
  var elem = document.elementFromPoint(e.clientX, e.clientY);
  var popoverFound = false;
  if (elem === 'undefined') { console.log('No element hit'); $('.popover').remove(); }
  else {
	while (!(elem == 'undefined')){
		if (elem.className && (elem.className.indexOf('popover') >= 0)){
			popoverFound = true;
			break;
		}
		if (!(elem.parentNode)) {
			break;
		}
		elem = elem.parentNode;
	}
  }
  if (!popoverFound){
	$('.popover').remove();
  }
});