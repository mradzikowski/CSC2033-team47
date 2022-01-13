import React, { state, setState } from "react";
import { Tweet } from "react-twitter-widgets";

class NewsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tweets: [],
      display: { start: 0, end: 2 },
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/tweets/recent`)
      .then((res) => res.json())
      .then((values) => {
        console.log(values);
        this.setState({ tweets: values });
      });
  }

  handleScroll = (e) => {
    let element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      let endPoint = this.state.display.end + 2;
      this.setState({ display: { start: 0, end: endPoint } });
    }
  };

  render() {
    return (
      <div className="tweet-list" onScroll={this.handleScroll}>
        {this.state.tweets.map((tweet, index) => {
          if (
            index > this.state.display.start &&
            index <= this.state.display.end
          ) {
            return (
              <div className="tweet-item">
                <div className="tweet-loading">loading...</div>
                <Tweet
                  key={index}
                  tweetId={tweet}
                  className="tweet-item"
                  options={{ align: "center", width: "500", height: "800" }}
                />
              </div>
            );
          }
        })}
      </div>
    );
  }
}

export default NewsPage;
