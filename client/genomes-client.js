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
		    console.log(miniJSONify(hit));
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
			var popover_content = makeElement('div', 'asdfasdf', {className: 'popover-content'}, {});
			popup.appendChild(popover_arrow);
			popup.appendChild(popover_inner);
			popover_inner.appendChild(popover_title);
			popover_inner.appendChild(popover_content);
			Dalliance.svgHolder.appendChild(popup);
		});
		
		$('#popover_test').popover(
			{animation: true, 
			 placement: 'right',
			 trigger: 'manual', 
			 title:'Foobar',
			 content: '<h1>foobar</h1>'});
		$('#popover_test').popover('show');
	}
});