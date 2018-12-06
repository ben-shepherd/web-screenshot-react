import React, { Component } from 'react'


class UrlItem extends Component {

    constructor(props) {
        super(props)

        console.log('Url item props', props)

        this.state = {
            status: null,
            imageUrl: null,
            imageVisible: false
        }
    }

    handleToggleImage = (e) => {
        e.preventDefault()
        this.setState({imageVisible: !this.state.imageVisible})
    }

    render() {

        const { status, statusTypes } = this.props
        let backgroundColor = 'blue darken-2 white-text'

        if(status === statusTypes.COMPLETE) {
            backgroundColor = 'purple darken-2 white-text'
        } else if(status === status.ERROR) {
            backgroundColor = 'red darken-2 white-text'
        }

        return (
            <div className="UrlItem" key={this.props.id}>
                <div className={'card '+backgroundColor}>
                    <div className="card-close" onClick={this.props.remove}>&times;</div>
                    <div className="card-content">
                        {this.renderCardContents()}
                    </div>
                    {this.renderCardActions()}
                </div>
            </div>
        )
    }

    renderCardActions() {
        const { status, statusTypes } = this.props

        if(status === statusTypes.COMPLETE) {
            return (
                <div className="card-action">
                    <p className="status">{this.state.status}</p>
                    {this.renderViewImageLink()}
                </div>
            )
        }
    }

    renderCardContents() {

        const { url, imageUrl, status, statusTypes, errorMessage } = this.props
        const { imageVisible } = this.state
        const cardTitle = <span className="card-title">{url}</span>
        const error = status === statusTypes.ERROR ? <p>{errorMessage}</p> : null

        if(status === statusTypes.ERROR) {
            
        }
        if(imageVisible) {
            return (
                <div className="card-image">
                    <img src={imageUrl} alt={imageUrl}/>
                    {cardTitle}
                </div>
            )
        }
        else {
            return (
                <div>
                    {cardTitle}
                    <p>{status}.</p>
                    {error}
                </div>
            )
        }
    }

    renderViewImageLink() {
        if(this.props.status == this.props.statusTypes.COMPLETE) {
            return (
                <a href="/" onClick={this.handleToggleImage}>{!this.state.imageVisible ? 'Show' : 'Hide'} Snapshot</a>
            )
        }
    }
}

export default UrlItem