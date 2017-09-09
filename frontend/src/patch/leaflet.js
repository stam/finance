import L from 'leaflet';

// Add leaflet.on singleclick handler
L.Evented.addInitHook(function() {
    this._singleClickTimeout = null;
    this.on('click', this._scheduleSingleClick, this);
    this.on('dblclick dragstart zoomstart', this._cancelSingleClick, this);
});
L.Evented.include({
    _cancelSingleClick: function() {
        // This timeout is key to workaround an issue where double-click events
        // are fired in this order on some touch browsers: ['click', 'dblclick', 'click']
        // instead of ['click', 'click', 'dblclick']
        setTimeout(this._clearSingleClickTimeout.bind(this), 0);
    },

    _scheduleSingleClick: function(e) {
        this._clearSingleClickTimeout();

        this._singleClickTimeout = setTimeout(
            this._fireSingleClick.bind(this, e),
            this.options.singleClickTimeout || 250
        );
    },

    _fireSingleClick: function(e) {
        if (!e.originalEvent._stopped) {
            this.fire('singleclick', L.Util.extend(e, { type: 'singleclick' }));
        }
    },

    _clearSingleClickTimeout: function() {
        if (this._singleClickTimeout != null) {
            clearTimeout(this._singleClickTimeout);
            this._singleClickTimeout = null;
        }
    },
});

// Fix leaflet marker images
// https://github.com/PaulLeCam/react-leaflet/issues/255
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
