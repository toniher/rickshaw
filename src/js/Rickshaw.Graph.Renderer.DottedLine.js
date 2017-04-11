Rickshaw.namespace('Rickshaw.Graph.Renderer.DottedLine');

Rickshaw.Graph.Renderer.DottedLine = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Line, {
    name: 'dotted_line',

    defaults: function($super) {

        return Rickshaw.extend( $super(), {
            dasharray: "4, 2"
        } );
    },

    
    _styleSeries: function(series) {
        var dasharray = series.dasharray ? series.dasharray : this.dasharray;
        
        var result = Rickshaw.Graph.Renderer.Line.prototype._styleSeries.call(this, series);
        d3.select(series.path).style("stroke-dasharray", dasharray);
        return result;
    },
    setDasharray: function(dasharray) {
            if (dasharray !== undefined) {
                    this.dasharray = dasharray;
            }
    },
});