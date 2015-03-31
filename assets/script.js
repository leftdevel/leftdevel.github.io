document.addEventListener('DOMContentLoaded', function() {
    (function() {
        var cx = React.addons.classSet;
        var Tab = React.createClass({displayName: "Tab",
            render: function() {
                var classes = cx({
                    'tab': true,
                    'on': this.props.on
                });

                return (
                    React.createElement("div", {className: classes, onClick: this.onClick}, 
                        this.props.label, 
                        this.props.children
                    )
                );
            },

            onClick: function(event) {
                this.props.onTabClick(this.props.index);
            }
        });

        var Panel = React.createClass({displayName: "Panel",
            render: function() {
                var classes = cx({
                    'panel': true,
                    'on': this.props.on
                });

                return (
                    React.createElement("div", {id: this.props.id, className: classes}, 
                        this.props.children
                    )
                );
            }
        });

        var TabPanelGroup = React.createClass({displayName: "TabPanelGroup",
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
                   React.createElement("div", {id: this.props.id, className: "tab-panel-group"}, 
                        React.createElement("div", {className: "tabs"}, 
                            tabNodes
                        ), 
                        React.createElement("div", {className: "panels"}, 
                            panelNodes
                        )
                    )
                );
            },

            onTabClick: function(index) {
                var state = this.state;
                state.on = index;
                this.setState(state);
            }
        });


        var Highlight = React.createClass({displayName: "Highlight",
            render: function() {
                return (
                    React.createElement(TabPanelGroup, null, 
                        React.createElement(Tab, {label: "Code"}), 
                        React.createElement(Panel, null, 
                          React.createElement("div", {dangerouslySetInnerHTML: {__html: this.props.code}})
                        ), 
                        React.createElement(Tab, {label: "Live Preview"}), 
                        React.createElement(Panel, null, 
                            React.createElement("pre", {className: "demo"}, 
                                this.props.children
                          )
                        )
                    )
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