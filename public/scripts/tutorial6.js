var StopwatchControls = React.createClass({ ///essentially the form
  handleSubmit: function(e) {
    e.preventDefault();
    var time = $(".derp").val().trim();

    if (!time) {
      return;
    }
    // send request to the server
    this.props.onStopwatchControlsSubmit({time: time});
    this.zeroClock();
    return;
  },
  zeroClock: function() {
    var zero = "00:00:00";
    this.setState({currenttime: "00:00:00"});
  },
  handleClick1: function(e){
    this.setState({pause: !this.state.pause});
    return;
  },
  getInitialState: function(){
    return {pause: true, currenttime: "00:00:00"};
  },
  render: function() {
    var pauseState = this.state.pause ? 'Go' : 'Pause';
    return (
      <form className="stopwatch" onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.currenttime} ref="currenttime" className="derp" />
        <input type="button" value={pauseState} ref="pause" onClick={this.handleClick1} /> 
        <input type="submit" value="Reset" />
      </form>
    );
  }
});

var StopwatchList = React.createClass({
  render: function() {
    var stoptimeNodes = this.props.data.map(function (stoptime) {
      return (
        <div class="ind-time">
          {stoptime.time}
        </div>
      );
    });
    return (
      <div className="stoptimesList">
        {stoptimeNodes}
      </div>
    );
  }
});

var StopwatchBox = React.createClass({ 
    loadStoptimesFromServer: function() {
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
  handleStopwatchControlsSubmit: function(stoptime) {
    // submit to the server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: stoptime,
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
   componentDidMount: function() {
    this.loadStoptimesFromServer();
    setInterval(this.loadStoptimesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="stoptimeList">
        <h1>Stopwatch</h1>
        <StopwatchList data={this.state.data} />
        <StopwatchControls pollInterval={10} onStopwatchControlsSubmit={this.handleStopwatchControlsSubmit} />
      </div>
    );
  }
});


/////////////////////////////////////////////////////


// tutorial10.js
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.value.trim();
    var text = this.refs.text.value.trim();
    if (!text || !author) {
      return;
    }
    // send request to the server
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.value = '';
    this.refs.text.value = '';
    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />        <input type="submit" value="Post" />
      </form>
    );
  }
});


// tutorial3.js
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
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
  handleCommentSubmit: function(comment) {
    // submit to the server and refresh the list
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
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
   componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

// tutorial7.js
var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

// var data3 = [
//   {author: "Pete Hunt", text: "This is one comment"},
//   {author: "Jordan Walke", text: "This is *another* comment"}
// ];

// ReactDOM.render(
//   <CommentBox data={data3} />,
//   document.getElementById('content')
// );

////////////////////////
// ReactDOM.render(
//   <CommentBox url="/api/comments" pollInterval={2000} />,
//   document.getElementById('content')
// );

ReactDOM.render(
  <StopwatchBox url="/api/comments" pollInterval={2000} />,
  // <StopwatchBox pollInterval={2000} />,
  document.getElementById('content2')
);

// $(".pause").on('click', function(){
//   var currentState = $(this).attr("value");
//   if (currentState === "Pause"){ //could be incorporated into React code
//     //change to Go
//     $(this).attr("value", "Go");
//   }else{
//     //change back to Pause
//     $(this).attr("value", "Pause");
//   }
// });