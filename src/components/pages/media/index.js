import React, { Component } from 'react'
import { categoryTypes } from '../../../constants'
import { getFiles, deleteFile } from '../../../libs/api';
import File from './file'

class Media extends Component {

    constructor(props) {
        super(props)

        var defaultCategory = this.props.match.params.category || categoryTypes.NONE
        console.log({defaultCategory, props})
        this.state = {
            category: defaultCategory,
            oldCategory: defaultCategory,
            files: []
        }
    }

    componentDidMount() {
        this.loadFiles()
    }

    /**
     * Load files from API
     */
    componentDidUpdate() {
        console.log('new state', this.state)
        if(this.state.oldCategory !== this.state.category) {
            this.loadFiles()
            this.setState({oldCategory: this.state.category})
        }
    }

    loadFiles = async() => {
        try {
            let request = await getFiles(this.state.category)

            if(request.status === 200) {
                this.setState({files: request.data.files})
            }
            else {
                console.log('Bad response', {request})
            }
        }
        catch (err) {
            console.log('Error loading files')
        }
    }

    /**
     * Category changed
     */
    handleCategory = (e) => {
        this.props.history.push('/media/'+e.target.value)
        this.setState({category: e.target.value})
    }

    handleImageClick = (file) => {
        window.open(file.image_url, '_blank')
    }

    /**
     * Handle delete with confirmation
     */
    handleDelete = async(file, confirmDelete) => {

        // Update state 
        const updateFile = file => {
            let { files } = this.state
            files[file.index] = file
            this.setState({files})
        }

        // Ask for confirmation
        if(!confirmDelete) {
            
            file.confirmDelete = true
            file.timeoutHandle = null
            updateFile(file)

            // Revert confirmation after a few sceonds
            file.timeoutHandle = setTimeout(() => {
                file.confirmDelete = false
                updateFile(file)
            }, 3000)
        }
        else {
            console.log('Sending delete request...')

            clearTimeout(file.timeoutHandle)
            
            try {
                await deleteFile(file.id)
                this.loadFiles()
            }
            catch (err) {
                console.log('Error deleting file', err)
            }
        }
    }

    renderFiles() {
        return (
            <div className="row FilesContainer">
                {this.state.files.map((file, key) => {
                    file.index = key
                    return (
                        <div className="col s12 m6" key={key}>
                            <File file={{...file}}
                                confirmDelete={file.confirmDelete || false}
                                handleDelete={this.handleDelete}
                                handleImageClick={this.handleImageClick}/>
                        </div>
                    )
                })}

            </div>
        )
    }

    render() {
        return (
            <div className="Media">
                <h4 className="header">Manage Media</h4>
                <p>Select which images you would like to view...</p>
                <form>
                    <p>
                        <label>
                            <input name="category" type="radio" value={categoryTypes.ADS} 
                                onChange={this.handleCategory}
                                checked={this.state.category === categoryTypes.ADS} />
                            <span>Ads</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="category" type="radio" value={categoryTypes.NO_ADS} 
                                onChange={this.handleCategory}
                                checked={this.state.category === categoryTypes.NO_ADS} />
                            <span>Non-Ads</span>
                        </label>
                    </p>
                    <p>
                        <label>
                            <input name="category" type="radio" value={categoryTypes.NONE} 
                                onChange={this.handleCategory}
                                checked={this.state.category === categoryTypes.NONE} />
                            <span>Others (Unsaved)</span>
                        </label>
                    </p>
                </form>
                <div className="row">
                    <div className="col s12">
                        {this.renderFiles()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Media