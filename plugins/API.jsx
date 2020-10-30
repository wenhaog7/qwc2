/**
 * Copyright 2020, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const {connect} = require('react-redux');
const assign = require('object-assign');
const {LayerRole} = require('../actions/layers');
const LayerUtils = require('../utils/LayerUtils');
const ServiceLayerUtils = require('../utils/ServiceLayerUtils');

class API extends React.Component {
    componentDidMount() {
        window.qwc2 = {};
        // Auto-binded functions
        for(let prop in this.props) {
            window.qwc2[prop] = this.props[prop];
        }
        // Additional exports
        window.qwc2.LayerRole = LayerRole;
        window.qwc2.addExternalLayer = this.addExternalLayer;
        window.qwc2.drawScratch = this.drawScratch;
    }
    render() {
        return null;
    }
    addExternalLayer = (resource, beforeLayerName=null) => {
        let params = LayerUtils.splitLayerUrlParam(resource);
        ServiceLayerUtils.findLayers(params.type, params.url, [params], (id, layer) => {
            if(layer) {
                this.props.addLayer(layer, null, beforeLayerName);
            }
        });
    }
    drawScratch = (geomType, message, callback) => {
        this.props.setCurrentTask("ScratchDrawing", null, null, {geomType, message, callback});
    }
};

function extractFunctions(obj) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        if(typeof value === "function") {
            result[key] = value;
        };
        return result;
    }, {});
}

module.exports = module.exports = {
    APIPlugin: connect(state => ({
    }),
    assign(
        {},
        extractFunctions(require('../actions/layers')),
        extractFunctions(require('../actions/map')),
        extractFunctions(require('../actions/task')),
        extractFunctions(require('../actions/windows'))
    ))(API)
};
