Rickshaw.namespace('Rickshaw.Graph.Renderer.DottedLine');

Rickshaw.Graph.Renderer.DottedLine = Rickshaw.Class.create( Rickshaw.Graph.Renderer.Line, {
    name: 'dotted_line',
    _styleSeries: function(series) {
        var result = Rickshaw.Graph.Renderer.Line.prototype._styleSeries.call(this, series);
        d3.select(series.path).style("stroke-dasharray", '5, 2');
        return result;
    }
});