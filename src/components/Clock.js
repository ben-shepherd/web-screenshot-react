import React, { Component } from 'react'

class Clock extends Component {

    constructor(props) {
        super(props)
        this.state = {date: new Date()}
    }

    componentWillMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        this.setState({
            date: new Date()
        })
    }

    render() {
        return (
            <div className="clock">
                <small>The current time is: {this.state.date.toLocaleTimeString()}</small>
            </div>
        )
    }
}

export default Clock