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

			sources:     [{name:                 'Genome',      
			uri:                  'http://www.derkholm.net:8080/das/hg18comp/',        
			tier_type:            'sequence',
			provides_entrypoints: true},
			{name:                 'Genes',     
			desc:                 'Gene structures from Ensembl 54',
			uri:                  'http://www.derkholm.net:8080/das/hsa_54_36p/',      
			collapseSuperGroups:  true,
			provides_karyotype:   true,
			provides_search:      true},
			{name:                 'Repeats',     
			uri:                  'http://www.derkholm.net:8080/das/hsa_54_36p/',      
			stylesheet_uri:       'http://www.derkholm.net/dalliance-test/stylesheets/ens-repeats.xml'},
			{name:                 'MeDIP raw',
			uri:                  'http://www.derkholm.net:8080/das/medipseq_reads'},
			{name:                 'MeDIP-seq',
			uri:                  'http://www.ebi.ac.uk/das-srv/genomicdas/das/batman_seq_SP/'}],

			searchEndpoint: new DASSource('http://www.derkholm.net:8080/das/hsa_54_36p/'),
			browserLinks: {
				Ensembl: 'http://ncbi36.ensembl.org/Homo_sapiens/Location/View?r=${chr}:${start}-${end}',
				UCSC: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg18&position=chr${chr}:${start}-${end}',
			},
	        embedMargin: 260
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
			var popover_arrow   = makeElement('div', '', {className: 'arrow'}, {});
			var popover_inner   = makeElement('div', '', {className: 'popover-inner'}, {});
			var popover_title   = makeElement('h3' , 'Foobar', {className: 'popover-title'}, {});
			var pop_dismiss_btn = makeElement('button', '', {id: 'dismissbutton', className: 'dismissbutton close'}, {
				float: 'right',
				'vertical-align': 'top',
				height: '20px',
			});
			var pop_dismiss_img = makeElement('i', '', {className: 'icon-remove'}, {
				'vertical-align': 'top'
			});
			var popover_content = makeElement('div', 'Popover content goes here', {className: 'popover-content'}, {});
			popup.appendChild(popover_arrow);
			popup.appendChild(popover_inner);
			popover_inner.appendChild(popover_title);
			popover_title.appendChild(pop_dismiss_btn);
			pop_dismiss_btn.appendChild(pop_dismiss_img);
			popover_inner.appendChild(popover_content);
			Dalliance.svgHolder.appendChild(popup);
			$('#dismissbutton').click(function() { $('.popover').remove() });
		});
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