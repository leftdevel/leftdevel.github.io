document.addEventListener('DOMContentLoaded', function() {

var Highlight = window.app.Highlight;

// ======== Snippet 1 ========
var Coupon = React.createClass({
  render: function() {
    if (!this.props.isApplied) {
      return this.getFormNode();
    } else {
      return this.getSuccessNode();
    }
  },
  getFormNode: function() {
    return (
      <form>
        <label>Enter Promo Code</label>
        <input type="text" />
        <button>Apply</button>
      </form>
    );
  },
  getSuccessNode: function() {
    return (
      <div>
        The discount has been applied!
        <a href="#">Apply Again</a>
      </div>
    );
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;

React.render(
  <Highlight code={code1} >
    <Coupon isApplied={false} />
  </Highlight>
  , mountNode1);

// ========= Snippet 2 ========

var Coupon2 = React.createClass({
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
      <form>
        {wait}
        <label>Enter Promo Code</label>

        <input
          type="text"
          onChange={this._onPromoCodeChange}
          value={this.state.promoCode}
          disabled={this.state.isWaiting}
        />

        <button disabled={this.state.isWaiting} onClick={this._apply}>Apply</button>
      </form>
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
      <div>
        The discount has been applied!&nbsp;
        <a href="#" onClick={this._applyAgain}>Apply Again</a>
      </div>
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
  <Highlight code={code2}>
    <Coupon2 initialIsApplied={initialIsApplied} />
  </Highlight>
  , mountNode2);


// ======== Sample3 ========

var App1 = React.createClass({
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
      <div>
        <div>
          Welcome <strong>{this.state.user.name}.</strong>
        </div>
        <Coupon2 coupon={this.state.coupon} />
      </div>
    );
  }
});

var mountNode3 = document.getElementById("sample3");
var code3 = mountNode3.innerHTML;

React.render(
  <Highlight code={code3}>
    <App1 />
  </Highlight>
  , mountNode3);

// ======== Sample 4 ========

var Coupon3 = React.createClass({
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
      <form>
        {wait}
        <label>Enter Promo Code</label>

        <input
          ref="PromoCode"
          type="text"
          defaultValue={this.props.coupon.promoCode}
          disabled={this.props.coupon.isWaiting}
        />

        <button disabled={this.props.coupon.isWaiting} onClick={this._apply}>Apply</button>
      </form>
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
      <div>
        The discount has been applied!&nbsp;
        <a href="#" onClick={this.props.applyAgainHandler}>Apply Again</a>
      </div>
    );
  },

  _applyAgain: function(event) {
    event.preventDefault();
    this.setState({promoCode: '', isApplied: false});
  }
});


var App2 = React.createClass({
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
      <div>
        <div>
          Welcome <strong>{this.state.user.name}.</strong>
        </div>
        <Coupon2 coupon={this.state.coupon} />
      </div>
    );
  }
});

var mountNode4 = document.getElementById("sample4");
var code4 = mountNode4.innerHTML;

React.render(
  <Highlight code={code4}>
    <App2 />
  </Highlight>
  , mountNode4);

});