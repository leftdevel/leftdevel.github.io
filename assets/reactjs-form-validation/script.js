document.addEventListener('DOMContentLoaded', function() {
var Highlight = window.app.Highlight;

// ======== Sample 1 ========

var SimpleForm1 = React.createClass({displayName: "SimpleForm1",
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {ref: "Email", defaultValue: ""}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
    },

  _submit: function(event) {
    event.preventDefault();
    var value = React.findDOMNode(this.refs.Email).value;
    console.log(value);
  }
});

var mountNode1 = document.getElementById("sample1");
var code1 = mountNode1.innerHTML;
React.render(React.createElement(Highlight, {code: code1}, React.createElement(SimpleForm1, null)), mountNode1);


// ======== Sample 2 ========

var SimpleForm2 = React.createClass({displayName: "SimpleForm2",
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {value: this.state.email, onChange: this._onChange}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
  },

  _onChange: function(event) {
    var value = event.target.value;
    this.setState({email: value});
  },

  _submit: function(event) {
    event.preventDefault();
    console.log(this.state.email);
  }
});

var mountNode2 = document.getElementById("sample2");
var code2 = mountNode2.innerHTML;
React.render(React.createElement(Highlight, {code: code2}, React.createElement(SimpleForm2, null)), mountNode2);

// ======== Sample 3 ========

var SimpleForm3 = React.createClass({displayName: "SimpleForm3",
  getInitialState: function() {
    return {email: ''};
  },

  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("input", {value: this.state.email, onChange: this._onChange}), 
        React.createElement("button", {onClick: this._submit}, "Submit")
      )
    );
  },

  _onChange: function(event) {
    var value = event.target.value;
    if (value.length > 5) return;
    this.setState({email: value.toUpperCase()});
  },

  _submit: function(event) {
    event.preventDefault();
    console.log(this.state.email);
  }
});

var mountNode3 = document.getElementById("sample3");
var code3 = mountNode3.innerHTML;
React.render(React.createElement(Highlight, {code: code3}, React.createElement(SimpleForm3, null)), mountNode3);

// ======== Sample 4 ========

var Profile1 = React.createClass({displayName: "Profile1",
  getInitialState: function() {
    return {
      username: this.props.initialUsername,
      editing: false
    };
  },

  render: function() {
    if (this.state.editing) {
      return (
        React.createElement("form", null, 
          React.createElement("label", null, "Username"), 
          React.createElement("input", {value: this.state.username, onChange: this._onChange}), 
          React.createElement("button", {onClick: this._submit}, "Submit")
        )
      );
    } else {
      return (
        React.createElement("a", {href: "#", onClick: this._enterEditMode}, "Edit Profile")
      );
    }
  },

  _onChange: function(event) {
    var value = event.target.value;
    this.setState({username: value});
  },

  _submit: function(event) {
    event.preventDefault();
    this.props.updateHandler(this.state.username);
    this.setState({editing: false});
  },

  _enterEditMode: function(event) {
    event.preventDefault();
    this.setState({editing: true});
  }
});

var Dashboard1 = React.createClass({displayName: "Dashboard1",
  getInitialState: function() {
    return {user: {username: 'John Doe'}};
  },

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, "Welcome ", React.createElement("strong", null, this.state.user.username)), 
        React.createElement(Profile1, {initialUsername: this.state.user.username, updateHandler: this._updateUsername})
      )
    );
  },

  _updateUsername: function(newUsername) {
    var state = this.state;
    state.user.username = this._ucwords(newUsername);
    this.setState(state);
  },

  // borrowed from https://gist.github.com/4541395.git
  _ucwords: function(str) {
    str = str.toLowerCase();
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
      function(s){
        return s.toUpperCase();
    });
  }
});

var mountNode4 = document.getElementById("sample4");
var code4 = mountNode4.innerHTML;
React.render(React.createElement(Highlight, {code: code4}, React.createElement(Dashboard1, null)), mountNode4);

// ======== Sample 5 ========

var RegisterForm1 = React.createClass({displayName: "RegisterForm1",
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("label", null, "Account Type"), 
          React.createElement("select", null, 
            React.createElement("option", {value: ""}, "-Select a plan-"), 
            React.createElement("option", {value: "free"}, "Free"), 
            React.createElement("option", {value: "premium"}, "Premium")
          )
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {placeholder: "username"})
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", placeholder: "password"})
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", placeholder: "confirm password"})
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("button", {type: "submit"}, "Register")
        )
      )
   );
  }
});

var mountNode5 = document.getElementById("sample5");
var code5 = mountNode5.innerHTML;
React.render(React.createElement(Highlight, {code: code5}, React.createElement(RegisterForm1, null)), mountNode5);

// ======== Sample 6 ========

var RegisterForm2 = React.createClass({displayName: "RegisterForm2",
  render: function() {
    return (
      React.createElement("form", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("label", null, "Account Type"), 
          React.createElement("select", {defaultValue: this.props.accountType}, 
            React.createElement("option", {value: ""}, "Select a plan"), 
            React.createElement("option", {value: "free"}, "Free"), 
            React.createElement("option", {value: "premium"}, "Premium")
          ), 
          this.props.accountTypeError ? React.createElement("div", {className: "error"}, this.props.accountTypeError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {defaultValue: this.props.username, placeholder: "username"}), 
          this.props.usernameError ? React.createElement("div", {className: "error"}, this.props.usernameError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", defaultValue: this.props.password, placeholder: "password"})
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", defaultValue: this.props.passwordConfirm, placeholder: "confirm password"}), 
          this.props.passwordError ? React.createElement("div", {className: "error"}, this.props.passwordError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("button", {type: "submit"}, "Register")
        )
      )
    );
  }
});

var mountNode6 = document.getElementById("sample6");
var code6 = mountNode6.innerHTML;
React.render(React.createElement(Highlight, {code: code6}, React.createElement(RegisterForm2, null)), mountNode6);

// ======== Sample 7 ========

var RegisterHandler1 = React.createClass({displayName: "RegisterHandler1",
  getInitialState: function() {
    return {
      waiting: false,
      accountType: '',
      accountTypeError: '',
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
    }
  },

  render: function() {
    return (
      React.createElement(RegisterForm2, {
        accountType: this.state.accountType, 
        accountTypeError: this.state.accountTypeError, 
        username: this.state.username, 
        usernameError: this.state.usernameError, 
        password: this.state.password, 
        passwordError: this.state.passwordError, 
        passwordConfirm: this.state.passwordConfirm, 

        waiting: this.state.waiting, 
        inputChangeHandler: this._onInputChange, 
        submitHandler: this._onSubmit})
    );
  },

  _onInputChange: function(property, event) {
  },

  _onSubmit: function(event) {
  }
});

var mountNode7 = document.getElementById("sample7");
var code7 = mountNode7.innerHTML;
React.render(React.createElement(Highlight, {code: code7}, React.createElement(RegisterHandler1, null)), mountNode7);

// ======== Sample 8 ========

var RegisterForm3 = React.createClass({displayName: "RegisterForm3",
  render: function() {
    return (
      React.createElement("form", {onSubmit: this.props.submitHandler}, 
        this.props.waiting ? React.createElement("div", null, "Creating account, please wait...") : '', 

        React.createElement("div", {className: "row"}, 
          React.createElement("label", null, "Account Type"), 
          React.createElement("select", {disabled: this.props.waiting, value: this.props.accountType, onChange: this.props.inputChangeHandler.bind(null, 'accountType')}, 
            React.createElement("option", {value: ""}, "Select a plan"), 
            React.createElement("option", {value: "free"}, "Free"), 
            React.createElement("option", {value: "premium"}, "Premium")
          ), 
          this.props.accountTypeError ? React.createElement("div", {className: "error"}, this.props.accountTypeError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {value: this.props.username, onChange: this.props.inputChangeHandler.bind(null, 'username'), disabled: this.props.waiting, placeholder: "username"}), 
          this.props.usernameError ? React.createElement("div", {className: "error"}, this.props.usernameError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", value: this.props.password, onChange: this.props.inputChangeHandler.bind(null, 'password'), disabled: this.props.waiting, placeholder: "password"})
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("input", {type: "password", value: this.props.passwordConfirm, onChange: this.props.inputChangeHandler.bind(null, 'passwordConfirm'), disabled: this.props.waiting, placeholder: "confirm password"}), 
          this.props.passwordError ? React.createElement("div", {className: "error"}, this.props.passwordError) : ''
        ), 

        React.createElement("div", {className: "row"}, 
          React.createElement("button", {disabled: this.props.waiting, type: "submit"}, "Register")
        )
      )
    );
  }
});

var RegisterHandler2 = React.createClass({displayName: "RegisterHandler2",
  getInitialState: function() {
    return {
      waiting: false,
      accountType: '',
      accountTypeError: '',
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
    }
  },

  render: function() {
    return (
      React.createElement(RegisterForm3, {
        accountType: this.state.accountType, 
        accountTypeError: this.state.accountTypeError, 
        username: this.state.username, 
        usernameError: this.state.usernameError, 
        password: this.state.password, 
        passwordError: this.state.passwordError, 
        passwordConfirm: this.state.passwordConfirm, 

        waiting: this.state.waiting, 
        inputChangeHandler: this._onInputChange, 
        submitHandler: this._onSubmit})
    );
  },

  _onInputChange: function(property, event) {
    var state = this.state;
    state[property] = event.target.value;
    this.setState(state);
  },

  _onSubmit: function(event) {
    event.preventDefault();
    this.setState({waiting: true});
  }
});

var mountNode8 = document.getElementById("sample8");
var code8 = mountNode8.innerHTML;
React.render(React.createElement(Highlight, {code: code8}, React.createElement(RegisterHandler2, null)), mountNode8);


// ======== Validation ========

function Constraint(errorMessage, check) {
  this.errorMessage = errorMessage;
  this.check = check;
};

Constraint.prototype.validate = function(value) {
  return this.check(value);
}

function ConstraintException(message, name) {
  this.message = message;
  this.name = name || 'ConstraintException';
}

function Validator(value, constraints, isOptional) {
  this.value = value;
  this.constraints = constraints;
  this.isOptional = isOptional;
  this.errorMessage = '';
  this.isValid = null;
}

Validator.prototype.validate = function() {
  this.errorMessage = '';
  this.isValid = null;

  if (this.isOptional && (this.value === '' || this.value === null || this.value === undefined)) {
    this.isValid = true;
    return;
  }

  for (var i in this.constraints) {
    var constraint = this.constraints[i];

    if (!constraint.validate(this.value)) {
      this.errorMessage = constraint.errorMessage;
      this.isValid = false;
      return;
    }
  }

  this.isValid = true;
};

// Usage.

var NotBlank = function(errorMessage) {
  var checker = function(value) {
    value = value.toString();
    return  value.length > 0;
  }

  var defaultErrorMessage = 'This value should not be blank';
  errorMessage = errorMessage || defaultErrorMessage;

  return new Constraint(errorMessage, checker);
}

var MinLength = function(minLength, errorMessage) {
  minLength = parseInt(minLength, 10);

  if (isNaN(minLength)) {
    throw new ConstraintException('minLength must be a number', 'MinLength');
  }

  var defaultErrorMessage = 'value should be at least ' + minLength.toString() + ' characters long';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    value = value.toString();
    return value.length >= minLength;
  };

  return new Constraint(errorMessage, checker);
}

var MaxLength = function(maxLength, errorMessage) {
  maxLength = parseInt(maxLength, 10);

  if (isNaN(maxLength)) {
    throw new ConstraintException('maxLength must be a number', 'MaxLength');
  }

  var defaultErrorMessage = 'value cannot be more than ' + maxLength.toString() + ' characters';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    value = value.toString();
    return value.length <= maxLength;
  };

  return new Constraint(errorMessage, checker);
}

var Match = function(valueToMatch, errorMessage) {
  var defaultErrorMessage = 'values must match';
  errorMessage = errorMessage || defaultErrorMessage;

  var checker = function(value) {
    return value === valueToMatch;
  };

  return new Constraint(errorMessage, checker);
}

// USAGE

var username = 'The Real Slim Shady';
var constraints = [
  new NotBlank('username is required'),
  new MinLength(2, 'username must be 2 characters at least'),
  new MaxLength(10)
];

// var usernameValidator = new Validator(username, constraints, true);
// usernameValidator.validate();
// console.log(usernameValidator.isValid);
// console.log(usernameValidator.errorMessage);

// ======== Sample 9 ========

var RegisterHandler3 = React.createClass({displayName: "RegisterHandler3",
  getInitialState: function() {
    return {
      waiting: false,
      accountType: '',
      accountTypeError: '',
      username: '',
      usernameError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
    }
  },

  render: function() {
    return (
      React.createElement(RegisterForm3, {
        accountType: this.state.accountType, 
        accountTypeError: this.state.accountTypeError, 
        username: this.state.username, 
        usernameError: this.state.usernameError, 
        password: this.state.password, 
        passwordError: this.state.passwordError, 
        passwordConfirm: this.state.passwordConfirm, 

        waiting: this.state.waiting, 
        inputChangeHandler: this._onInputChange, 
        submitHandler: this._onSubmit})
    );
  },

  _onInputChange: function(property, event) {
    var state = this.state;
    state[property] = event.target.value;
    this.setState(state);
  },

  _onSubmit: function(event) {
    event.preventDefault();

    if (this._isFormValid()) {
      this._doSubmit();
    }
  },

  _isFormValid: function() {
    var state = this.state;

    var accountTypeValidator = new Validator(state.accountType, [
      new NotBlank('Please choose an account type')
    ]);

    var usernameValidator = new Validator(state.username, [
      new NotBlank('Username is required'),
      new MinLength(4, 'Enter between 4 and 20 characters'),
      new MaxLength(20, 'Enter between 4 and 20 characters')
    ]);

    var passwordValidator = new Validator(state.password, [
      new NotBlank('Password is required'),
      new MinLength(4, 'Enter at least 4 characters'),
      new Match(state.passwordConfirm, 'Passwords must match')
    ]);

    var validators = [
      {propertyPath: 'accountTypeError', validator: accountTypeValidator},
      {propertyPath: 'usernameError', validator: usernameValidator},
      {propertyPath: 'passwordError', validator: passwordValidator}
    ];
    var isValid = true;

    validators.forEach(function(validationMap) {
      var validator = validationMap.validator;
      var propertyPath = validationMap.propertyPath;

      validator.validate();
      state[propertyPath] = validator.errorMessage;

      if (!validator.isValid) {
        isValid = false;
      }
    });

    this.setState(state);

    return isValid;
  },

  _doSubmit: function() {
    this.setState({waiting: true});
    // Ajax request here
  }
});

var mountNode9 = document.getElementById("sample9");
var code9 = mountNode9.innerHTML;
React.render(React.createElement(Highlight, {code: code9}, React.createElement(RegisterHandler3, null)), mountNode9);


// end of on ready function
});