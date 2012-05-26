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
		});
	}
});