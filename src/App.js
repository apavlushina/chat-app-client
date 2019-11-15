import React, { Component } from "react";
import superagent from "superagent";
import "./App.css";

export default class App extends Component {
  state = {
    messages: [],
    value: ""
  };
  stream = new EventSource("http://localhost:4000/stream");
  componentDidMount() {
    this.stream.onmessage = event => {
      const { data } = event;
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        this.setState({ messages: parsed });
      } else {
        const messages = [...this.state.messages, parsed];
        this.setState({ messages });
      }
      console.log("data test", parsed);
    };
  }

  onChange = event => {
    const { value } = event.target;
    this.setState({ value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { value } = this.state;

    const url = "http://localhost:4000/message";

    superagent
      .post(url)
      .send({ message: value })
      .then(responce => console.log("respose test", responce));

    this.setState({ value: "" });
  };

  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    const list = this.state.messages.map((message, index) => (
      <p key={index}>{message}</p>
    ));
    return (
      <div>
        {list}
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.onChange}
          />
          <button>Submit</button>
          <button onClick={this.reset}>Reset</button>
        </form>
      </div>
    );
  }
}
