/**

 */

var Directory = React.createClass({
  rawMarkup: function() {
    var md = new Remarkable();
    var rawMarkup = md.render(this.props.children.toString());
    return { __html: rawMarkup };
  },

  render: function() {
    if(this.props.childs) {
      return (
        <div className="directoryFolder">
          <h2 className="directoryName">
            <span dangerouslySetInnerHTML={this.rawMarkup()} />
          </h2>
          <DirectoryItem data={this.props.childs} />
        </div>
      );
    } else {
      return (
        <div className="directoryFolder">
          <h2 className="directoryName">
            <span dangerouslySetInnerHTML={this.rawMarkup()} />
          </h2>
        </div>
      );
    }
  }
});

var DirectoryBox = React.createClass({
  loadTreeJSON: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.root.childs});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadTreeJSON();
    setInterval(this.loadTreeJSON, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="DirectoryBox">
        <DirectoryItem data={this.state.data} />
      </div>
    );
  }
});

var DirectoryItem = React.createClass({
  render: function() {
    var directoryNodes = this.props.data.map(function(nodeItem) {
      return (
        <Directory childs={nodeItem.childs}>
          {nodeItem.shortPath}
        </Directory>
      );
    });
    return (
      <div className="DirectoryItem">
        {directoryNodes}
      </div>
    );
  }
});

ReactDOM.render(
  <DirectoryBox url="/api/tree" pollInterval={2000} />,
  document.getElementById('content')
);
