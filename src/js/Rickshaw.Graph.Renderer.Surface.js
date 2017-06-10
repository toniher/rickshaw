Rickshaw.namespace('Rickshaw.Graph.Renderer.Surface');

Rickshaw.Graph.Renderer.Area = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Area, {

	name: 'surface',

	defaults: function($super) {

		return Rickshaw.extend( $super(), {
			unstack: false,
			fill: false,
			stroke: false
		} );
	},

	seriesPathFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.area()
			.x( function(d) { return graph.x(d.x) } )
			.y0( function(d) { var base = d.ybase ? d.ybase : 0; return graph.y( base ) } )
			.y1( function(d) { var plus = d.ybase ? d.y + d.ybase : d.y; return graph.y( plus ) } )
			.interpolate(graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	},

	seriesStrokeFactory: function() {

		var graph = this.graph;

		var factory = d3.svg.line()
			.x( function(d) { return graph.x(d.x) } )
			.y( function(d) { var plus = d.ybase ? d.y + d.ybase : d.y; return graph.y( plus ) } )
			.interpolate(graph.interpolation).tension(this.tension);

		factory.defined && factory.defined( function(d) { return d.y !== null } );
		return factory;
	},

	_styleSeries: function(series) {

		if (!series.path) return;

		d3.select(series.path).select('.area')
			.attr('fill', series.color);

		if (series.stroke) {
			d3.select(series.path).select('.line')
				.attr('fill', 'none')
				.attr('stroke', series.stroke || d3.interpolateRgb(series.color, 'black')(0.125))
				.attr('stroke-width', this.strokeWidth);
		}
		
		var opacity = series.opacity ? series.opacity : this.opacity;
		if ( opacity ) {
			d3.select(series.path).select('.area')
				.attr('fill-opacity', opacity );
		}

		if (series.className) {
			series.path.setAttribute('class', series.className);
		}
	}
} );

