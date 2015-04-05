document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var Coupon = React.createClass({displayName: "Coupon",
  render: function() {
    if (!this.props.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },
  getFormNode: function() {
    return (
      React.createElement("form", null, 
        React.createElement("label", null, "Enter Promo Code"), 
        React.createElement("input", {type: "text"}), 
        React.createElement("button", null, "Apply")
      )
    );
  },
  getSuccessNode: function() {
    return (
      React.createElement("div", null, 
        "The discount has been applied!", 
        React.createElement("a", {href: "#"}, "Apply Again")
      )
    );
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  React.createElement(Highlight, {code: code1}, 
    React.createElement(Coupon, {isApplied: false})
  )
  , mountNode1);

// ========= Snippet 2 ========

var Coupon2 = React.createClass({displayName: "Coupon2",
  getInitialState: function() {
    return {
      isApplied: this.props.initialIsApplied,
      isWaiting: false,
      promoCode: '',
    };
  },

  render: function() {
    if (!this.state.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },

  getFormNode: function() {
    var wait = this.state.isWaiting ? 'Verifying code. Please wait...' : '';

    return (
      React.createElement("form", null, 
        wait, 
        React.createElement("label", null, "Enter Promo Code"), 

        React.createElement("input", {
          type: "text", 
          onChange: this._onPromoCodeChange, 
          value: this.state.promoCode, 
          disabled: this.state.isWaiting}
        ), 

        React.createElement("button", {disabled: this.state.isWaiting, onClick: this._apply}, "Apply")
      )
    );
  },

  _onPromoCodeChange: function(event) {
     this.setState({promoCode: event.target.value});
  },

  _apply: function(event) {
    event.preventDefault();
    this.setState({isWaiting: true});

    // Mocking the server verification response
    setTimeout(function() {
      this.setState({isWaiting: false, isApplied: true});
    }.bind(this), 2000);
  },

  getSuccessNode: function() {
    return (
      React.createElement("div", null, 
        "The discount has been applied! ", 
        React.createElement("a", {href: "#", onClick: this._applyAgain}, "Apply Again")
      )
    );
  },

  _applyAgain: function(event) {
    event.preventDefault();
    this.setState({promoCode: '', isApplied: false});
  }
});

var initialIsApplied = false; // we could pull this info from the backend.

var mountNode2 = document.getElementById("sample2");
var code2 = mountNode2.innerHTML;

React.render(
  React.createElement(Highlight, {code: code2}, 
    React.createElement(Coupon2, {initialIsApplied: initialIsApplied})
  )
  , mountNode2);


// ======== Sample3 ========

var App1 = React.createClass({displayName: "App1",
  getInitialState: function() {
    return {
      user: {name: 'John Doe'},
      coupon: {
        isApplied: this.props.initialIsApplied,
        isWaiting: false,
        promoCode: '',
      }
    };
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          "Welcome ", React.createElement("strong", null, this.state.user.name, ".")
        ), 
        React.createElement(Coupon2, {coupon: this.state.coupon})
      )
    );
  }
});

var mountNode3 = document.getElementById("sample3");
var code3 = mountNode3.innerHTML;

React.render(
  React.createElement(Highlight, {code: code3}, 
    React.createElement(App1, null)
  )
  , mountNode3);

// ======== Sample 4 ========

var Coupon3 = React.createClass({displayName: "Coupon3",
  render: function() {
    if (!this.props.coupon.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },

  getFormNode: function() {
    var wait = this.props.coupon.isWaiting ? 'Verifying code. Please wait...' : '';

    return (
      React.createElement("form", null, 
        wait, 
        React.createElement("label", null, "Enter Promo Code"), 

        React.createElement("input", {
          ref: "PromoCode", 
          type: "text", 
          defaultValue: this.props.coupon.promoCode, 
          disabled: this.props.coupon.isWaiting}
        ), 

        React.createElement("button", {disabled: this.props.coupon.isWaiting, onClick: this._apply}, "Apply")
      )
    );
  },

  _apply: function(event) {
    event.preventDefault();
    var promoCode = React.findDOMNode(this.refs.PromoCode).value;
    this.props.applyHandler(value);

    // Mocking the server verification response
    setTimeout(function() {
      this.setState({isWaiting: false, isApplied: true});
    }.bind(this), 2000);
  },

  getSuccessNode: function() {
    return (
      React.createElement("div", null, 
        "The discount has been applied! ", 
        React.createElement("a", {href: "#", onClick: this.props.applyAgainHandler}, "Apply Again")
      )
    );
  },

  _applyAgain: function(event) {
    event.preventDefault();
    this.setState({promoCode: '', isApplied: false});
  }
});


var App2 = React.createClass({displayName: "App2",
  getInitialState: function() {
    return {
      user: {name: 'John Doe'},
      coupon: {
        isApplied: this.props.initialIsApplied,
        isWaiting: false,
        promoCode: '',
      }
    };
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          "Welcome ", React.createElement("strong", null, this.state.user.name, ".")
        ), 
        React.createElement(Coupon2, {coupon: this.state.coupon})
      )
    );
  }
});

var mountNode4 = document.getElementById("sample4");
var code4 = mountNode4.innerHTML;

React.render(
  React.createElement(Highlight, {code: code4}, 
    React.createElement(App2, null)
  )
  , mountNode4);

});

//// ================= Brainstorm =================

// <div>
//   <ul>
//   </ul>
//   <form>
//       message: Enter Promo Code || Promo Code Submitted!
//   </form>
// </div>