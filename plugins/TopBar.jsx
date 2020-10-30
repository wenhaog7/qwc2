/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const assign = require('object-assign');
const {connect} = require('react-redux');
const {Swipeable} = require('react-swipeable');
const Icon = require('../components/Icon');
const Message = require('../components/I18N/Message');
const ConfigUtils = require("../utils/ConfigUtils");
const {toggleFullscreen} = require('../actions/display');
const {openExternalUrl} = require('../actions/task');
const {restoreDefaultTheme} = require('../actions/theme');
require('./style/TopBar.css');


class TopBar extends React.Component {
    static propTypes = {
        mobile: PropTypes.bool,
        menuItems: PropTypes.array,
        toolbarItems: PropTypes.array,
        components: PropTypes.object,
        fullscreen: PropTypes.bool,
        toggleFullscreen: PropTypes.func,
        restoreDefaultTheme: PropTypes.func,
        openExternalUrl: PropTypes.func,
        logoFormat: PropTypes.string,
        searchOptions: PropTypes.object,
        appMenuClearsTask: PropTypes.bool,
        appMenuVisibleOnStartup: PropTypes.bool,
        logoSrc: PropTypes.string,
        logoUrl: PropTypes.string
    }
    static defaultProps = {
        searchOptions: {},
        menuItems: [],
        toolbarItems: [],
        logoFormat: "png"
    }
    render() {
        let buttonContents;
        let logo;
        let assetsPath = ConfigUtils.getConfigProp("assetsPath");
        if(this.props.mobile) {
            buttonContents = (
                <span className="appmenu-button">
                    <Icon className="appmenu-icon" icon="menu-hamburger"/>
                </span>
            );
            logo = assetsPath + "/img/logo-mobile." + this.props.logoFormat;
        } else {
            buttonContents = (
                <span className="appmenu-button">
                    <span className="appmenu-label"><Message msgId="appmenu.menulabel" /></span>
                    <Icon className="appmenu-icon" icon="menu-hamburger"/>
                </span>
            );
            logo = assetsPath + "/img/logo."  + this.props.logoFormat;
        }

        let classes = classnames({
            "mobile": this.props.mobile,
            "fullscreen": this.props.fullscreen
        });
        let logoEl = (<img className="logo" src={this.props.logoSrc || logo} />);
        if (this.props.logoUrl) {
            logoEl = (<a target="_blank" href={this.props.logoUrl}>{logoEl}</a>);
        }
        // Convert legacy minScale option to minScaleDenom
        let searchOptions = assign({}, this.props.searchOptions);
        searchOptions.minScaleDenom = searchOptions.minScaleDenom || searchOptions.minScale;
        delete searchOptions.minScale;
        return (
            <Swipeable
                onSwipedUp={() => this.props.toggleFullscreen(true)}
                onSwipedDown={() => this.props.toggleFullscreen(false)}
                preventDefaultTouchmoveEvent={true}>
                <div id="TopBar" className={classes}>
                    {logoEl}
                    <div className="center-span">
                        <this.props.components.Search searchOptions={searchOptions}/>
                        <this.props.components.Toolbar toolbarItems={this.props.toolbarItems} />
                    </div>
                    <this.props.components.AppMenu
                        menuItems={this.props.menuItems} buttonContents={buttonContents}
                        openExternalUrl={this.props.openExternalUrl}
                        appMenuClearsTask={this.props.appMenuClearsTask}
                        showOnStartup={this.props.appMenuVisibleOnStartup} />
                    <this.props.components.FullscreenSwitcher />
                </div>
            </Swipeable>
         );
     }
     triggerFullscreen = () => {
         this.props.toggleFullscreen(true);
     }
};

module.exports = (components) => { return {
    TopBarPlugin: connect((state) => ({
        mobile: state.browser ? state.browser.mobile : false,
        fullscreen: state.display && state.display.fullscreen,
        components: components
    }), {
        toggleFullscreen: toggleFullscreen,
        restoreDefaultTheme: restoreDefaultTheme,
        openExternalUrl: openExternalUrl
    })(TopBar),
    reducers: {
        display: require("../reducers/display"),
        search: require("../reducers/search")
    }
}};
