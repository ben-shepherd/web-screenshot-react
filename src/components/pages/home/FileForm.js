import React, { Component } from 'react'
import UrlItem from './UrlItem';
import { webshot, saveFile } from '../../../libs/api';
import { isValidURL } from '../../../helpers/helpers'
import { statusTypes, categoryTypes } from '../../../constants'

class FileForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            textarea: '',
            category: null,
            UrlItems: []
        }
    }

    componentWillUpdate() {
        console.log('new state', this.state)
    }

    canSave() {
        return this.getCompletedUrlItemsArray().length && this.state.category !== null
    }

    getCompletedUrlItemsArray() {
        return this.state.UrlItems.filter(item => item.status === statusTypes.COMPLETE)
    }

    /**
     * Textarea changed
     */
    handleTextarea = (e) => {
        this.setState({textarea: e.target.value})
    }

    /**
     * Set Category
     */
    handleCategory = (category) => {

        this.setState({category, UrlItems: []})
    }

    /**
     * Clear form
     */
    handleClear = () => {
        this.setState({
            UrlItems: [],
            textarea: '',
            category: null,
        })
    }

    /**
     * Add examples to textarea
     */
    handleExamples = () => {
        var urls = [
            'https://www.google.com',
            'https://www.youtube.com',
            'https://www.facebook.com'
        ]
        var textarea = ''

        for(var url of urls) {
            textarea += url + "\n"
        }

        this.setState({textarea})
    }

    /**
     * Form Submit
     */
    handleSubmit = async(e) => {
        e.preventDefault()  

        let urlsArray = this.state.textarea.split("\n")
        urlsArray = urlsArray.filter(url => {
            return isValidURL(url) && !this.exists(url)
        })
    
        if(!urlsArray.length) {
            alert('Enter at least one URL')
        }


        for(var url of urlsArray) {
            this.addUrlItem(url)
        }

        let index = 0
        for(var item of this.state.UrlItems) {
            await this.downloadSnapshot(item, index)
            index++
        }
    }

    handleSave = async() => {
        try {
            var completeUrlItems = this.getCompletedUrlItemsArray()
            var updateUrlItem = (UrlItem) => {
                let UrlItems = this.state.UrlItems.map(item => {
                    if(UrlItem.id === item.id) {
                        return UrlItem
                    }
                    return item
                })
                this.setState({UrlItems})
            }
            console.log('Handling save')

            for(var item of completeUrlItems) {
                console.log({item})

                item.status = statusTypes.SAVING
                updateUrlItem(item)

                await saveFile(item.url, item.imageUrl, this.state.category)

                item.status = statusTypes.SAVED
                updateUrlItem(item)
            }
        }
        catch (err) {
            console.log('Error on save:', err)
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

            if(typeof response.data.error !== 'undefined') {
                currentItem.status = statusTypes.ERROR
                currentItem.errorMessage = response.data.error
            }
            else if(typeof response.data.request.url !== 'undefined') {
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
        
        // Remove http(s) and www.
        //let niceUrl = url.replace(/^(https?:\/\/)/, '').replace(/^(www\.)/, '')        
        let pattern = /https?:\/\/(?:www\.)?([a-zA-Z_]+\.[a-z]{1,4})/
        let match = url.match(pattern)
        let niceUrl = typeof match[1] !== 'undefined' ? match[1] : url

        let { UrlItems } = this.state
        let id = UrlItems.length
        var item = {
            id,
            url,
            niceUrl,
            category: this.state.category,
            status: statusTypes.IDLE,
        }

        this.state.UrlItems.push(item)
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

    /**
     * Check if a url has been added
     */
    exists = (url) => {
        return this.state.UrlItems.find(item => item.url === url)
    }

    /**
     * Render the UrlItems
     */
    renderUrlItems() {
        
        let { UrlItems } = this.state
        let rendered = UrlItems.map((item, key) => {
            const remove = (e) => {
                e.preventDefault()
                this.removeUrlItem(item.id)
            }

            return (
                <div className="col s12" key={key}>
                    <UrlItem {...item} remove={remove} statusTypes={statusTypes} key={key} />
                </div>
            )
        })

        return rendered
    }


    /**
     * Render Main
     */
    render() {
        return (
            <div className="fileForm">
                <form onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s12">
                            <p>Enter your URLs <small>(One per line)</small></p>
                            <p><small>Bad example: www.youtube.com</small><br />
                            <small>Good example: https://www.youtube.com</small></p>
                            <textarea name="urls" className="urlsTextareas" id="textarea" value={this.state.textarea} onChange={this.handleTextarea}></textarea>
                        </div>
                        <div className="col s12">
                            <p>In which category do these screenshots belong?</p>
                            <p>
                                <label>
                                    <input name="category" type="radio" value="Ads" 
                                        checked={this.state.category === categoryTypes.ADS} 
                                        onChange={() => this.handleCategory(categoryTypes.ADS)}/>
                                    <span>{categoryTypes.ADS}</span>
                                </label>
                            </p>
                            <p>
                                <label>
                                    <input name="category" type="radio" value="Non-Ads" 
                                        checked={this.state.category === categoryTypes.NO_ADS}
                                        onChange={() => this.handleCategory(categoryTypes.NO_ADS)}/>
                                    <span>{categoryTypes.NO_ADS}</span>
                                </label>
                            </p>
                        </div>
                        <div className="col s12">
                            <button type="submit" className="btn blue darken-1 right waves-light waves-effect">Snapshot</button>
                            <button type="button" className="btn grey lighten-1 left mr waves-light waves-effect" onClick={this.handleExamples}>Add Examples</button>
                            <button type="button" className="btn grey lighten-1 left mr waves-light waves-effect" onClick={this.handleClear}>Clear</button>
                            {this.canSave() ? 
                                <button type="button" className="btn blue lighten-1 left mr waves-light waves-effect" onClick={this.handleSave}>
                                    Save All Images ({this.getCompletedUrlItemsArray().length})
                                </button> : null}
                        </div>
                    </div>
                </form>
                <div id="UrlItemsContainer mt">
                    {this.renderUrlItems()}
                </div>
            </div>
        )
    }
}

export default FileForm