import React, { Component } from 'react'
import UrlItem from './UrlItem';
import { webshot } from '../libs/api';
import { isValidURL } from '../helpers/helpers'

const statusTypes = {
    'IDLE': 'Waiting',
    'COMPLETE': 'Complete',
    'DOWNLOADING': 'Downloading...',
    'ERROR': 'There was an error'
}

class FileForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            UrlItems: [],
            UrlItemsRendered: [],
            //DownloadsPending: 0,
            //DownloadsComplete: 0
        }
    }

    componentWillUpdate() {
        console.log('new state', this.state)
    }

    /**
     * Form Submit
     */
    handleSubmit = async(e) => {
        e.preventDefault()  

        const urlsArray = e.target.urls.value.split("\n")

        for(var url of urlsArray) {
            if(!this.exists(url) && isValidURL(url)) {
                this.addUrlItem(url)
            }
        }

        let index = 0
        for(var item of this.state.UrlItems) {
            await this.downloadSnapshot(item, index)
            index++
        }
    }

    /**
     * Download snapshot
     */
    downloadSnapshot = async(currentItem, index) => {

        if(currentItem.status === statusTypes.COMPLETE) {
            return
        }

        const { UrlItems } = this.state

        try {

            

            currentItem.status = statusTypes.DOWNLOADING            
            UrlItems[index] = currentItem
            this.setState({UrlItems})

            let response = await webshot(currentItem.url)

            console.log({response})

            if(typeof response.data.request.url !== 'undefined') {
                currentItem.status = statusTypes.COMPLETE
                currentItem.imageUrl = response.data.request.url
            }
            else {
                currentItem.status = statusTypes.ERROR
                currentItem.imageUrl = null 
            }
        }
        catch (err) {
            console.log('Error downloading snap:', err, err.response)
            currentItem.status = statusTypes.ERROR
            currentItem.errorMessage = err
        }

        UrlItems[index] = currentItem
        this.setState({UrlItems})
    }

    /**
     * Add UrlITem
     */
    addUrlItem = (url) => {
        let { UrlItems } = this.state
        let id = UrlItems.length

        var item = {
            id,
            url,
            status: statusTypes.IDLE
        }

        this.state.UrlItems.push(item)
        //this.setState({UrlItems: {...this.state.UrlItems, item}})
        
    }

    /**
     * Remove UrlItem
     */
    removeUrlItem = (id) => {
        console.log('Removing item', id)
        let { UrlItems } = this.state

        UrlItems = UrlItems.filter(item => {
            return item.id !== id
        })

        this.setState({UrlItems})
    }

    exists = (url) => {
        return this.state.UrlItems.find(item => item.url === url)
    }

    renderUrlItems() {
        
        let { UrlItemsRendered, UrlItems } = this.state


        UrlItemsRendered = UrlItems.map((item, key) => {
            const remove = (e) => {
                console.log('REMOVE>>>')
                e.preventDefault()
                this.removeUrlItem(item.id)
            }

            return (
                <div className="col s12 m6" key={key}>
                    <UrlItem {...item} remove={remove} statusTypes={statusTypes} key={key} />
                </div>
            )
        })

        return UrlItemsRendered
    }

    render() {
        return (
            <div className="fileForm">
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <p>Enter your URLs</p>
                            <p><small>(One per line)</small></p>
                            <textarea name="urls" className="urlsTextareas" id="textarea"></textarea>
                        </div>
                        <div className="col s12">
                            <button type="submit" className="btn blue darken-1 right">Submit</button>
                        </div>
                    </div>
                </form>
                <div className="ProgressContainer">
                    {/* {this.renderProgress()} */}
                </div>
                <div className="UrlItemsContainer">
                    <div className="row">
                        {this.renderUrlItems()}
                    </div>
                </div>
            </div>
        )
    }
}

export default FileForm