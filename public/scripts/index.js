var React = require('react');
var ReactDOM = require('react-dom');

var Gist = React.createClass({
  render: function() {
    // Convert `this.props.children` from React's wrapped text to a raw string
    // that `marked` will understand so we explicitly call `toString()`.
    return (
      <div className="gist">
        <h2 className="gistDescription">
          {this.props.description}
        </h2>
      </div>
    );
  }
});

var GistList = React.createClass({
  render: function() {
    var gistNodes = this.props.data.map(function(gist) {
      return (
        <Gist description={gist.description} key={gist.id}>
        </Gist>
      );
    });
    return (
      <div className="gistList">
        {gistNodes}
      </div>
    );
  }
});

var GistBox = React.createClass({
  loadGistsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  // `componentDidMount` is a method called automatically by React after a
  // component is rendered for the first time.
  componentDidMount: function() {
    this.loadGistsFromServer();
  },
  // Returns a tree of React components that will eventually render to HTML.
  render: function() {
    return (
      <div className="GistBox">
        <h1>Gists</h1>
        <GistList data={this.state.data}/>
      </div>
    );
  }
});

ReactDOM.render(
  <GistBox url="/api/gists"/>,
  document.getElementById('content')
);