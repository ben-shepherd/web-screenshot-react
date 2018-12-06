import React, { Component } from 'react';
import FileForm from './components/FileForm'
import Nav from './components/Nav'
import { sendPingRequest } from './libs/api'

class App extends Component {

  constructor(props) {
    super(props)

    this.connectTimer = null
    this.state = {
      connecting: false,
      connected: null
    }
  }
  
  componentDidMount() {
    this.handleConnect()
  }

  handleConnect = async() => {
    const retry = () => {
      this.connectTimer = setInterval(() => {
        this.handleConnect()
      }, 5000)
    }

    if(!this.state.connected) {
      try {
        let ping = await sendPingRequest()

        if(ping.status == 200) {
          this.setState({connected: true})
          clearInterval(this.connectTimer)
        } 
        else {
          retry()
        }
      }
      catch (err) {
        retry()
      }
    }
  }

  renderConnectStatus() {
    if(this.state.connected !== null) {
      if(!this.state.connected) {
      return (
          <div className="card red lighten-1 white-text">
            <div className="card-content">
              <span className="card-title">Error</span>
              <p>We could not create a connection to the API.</p>
            </div>
          </div>
        )
      }
    }
    else {
      return (
        <div className="card grey lighten-5 black-text">
          <div className="card-content">
            <p>Connecting...</p>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <div className="container mt">
          {this.state.connected ? 
            <FileForm /> :
            this.renderConnectStatus()}
        </div>
      </div>
    );
  }
}

export default App;
