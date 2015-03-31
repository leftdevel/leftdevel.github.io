document.addEventListener('DOMContentLoaded', function() {
    (function() {
        var cx = React.addons.classSet;
        var Tab = React.createClass({
            render: function() {
                var classes = cx({
                    'tab': true,
                    'on': this.props.on
                });

                return (
                    <div className={classes} onClick={this.onClick}>
                        {this.props.label}
                        {this.props.children}
                    </div>
                );
            },

            onClick: function(event) {
                this.props.onTabClick(this.props.index);
            }
        });

        var Panel = React.createClass({
            render: function() {
                var classes = cx({
                    'panel': true,
                    'on': this.props.on
                });

                return (
                    <div id={this.props.id} className={classes}>
                        {this.props.children}
                    </div>
                );
            }
        });

        var TabPanelGroup = React.createClass({
            getInitialState: function() {
                return {on: 0};
            },

            render: function() {
                var tabs = [];
                var panels = [];

                React.Children.forEach(this.props.children, function(Child) {
                    if (Child.type === Tab) {
                        tabs.push(Child);
                    } else if (Child.type === Panel) {
                        panels.push(Child);
                    } else {
                        throw "Only Tab or Panel can be child of TabG";
                    }
                });

                if (tabs.length !== panels.length) {
                    throw "Number of Tabs vs Panels does not match.";
                }

                var state = this.state;
                var self = this;

                var tabNodes = tabs.map(function(Tab, index) {
                    return React.addons.cloneWithProps(Tab, {
                        on: index === state.on,
                        index: index,
                        onTabClick: self.onTabClick,
                        key: index
                    });
                });

                var panelNodes = panels.map(function(Panel, index) {
                    return React.addons.cloneWithProps(Panel, {
                        on: index === state.on,
                        index: index,
                        key: index
                    });
                });

                return (
                   <div id={this.props.id} className="tab-panel-group">
                        <div className="tabs">
                            {tabNodes}
                        </div>
                        <div className="panels">
                            {panelNodes}
                        </div>
                    </div>
                );
            },

            onTabClick: function(index) {
                var state = this.state;
                state.on = index;
                this.setState(state);
            }
        });


        var Highlight = React.createClass({
            render: function() {
                return (
                    <TabPanelGroup>
                        <Tab label="Code" />
                        <Panel>
                          <div dangerouslySetInnerHTML={{__html: this.props.code}} />
                        </Panel>
                        <Tab label="Live Preview" />
                        <Panel>
                            <pre className="demo">
                                {this.props.children}
                          </pre>
                        </Panel>
                    </TabPanelGroup>
                );
            }
        });

        var app = window.app || {};
        app.Tab = Tab;
        app.Panel = Panel;
        app.TabPanelGroup = TabPanelGroup;
        app.Highlight = Highlight;
        window.app = app;
    })();
});