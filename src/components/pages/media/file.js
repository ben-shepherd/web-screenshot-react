import React from 'react'
import Moment from 'react-moment'

const File = (props) => {

    if(props.confirmDelete) {
        console.log(props.index, 'has confirm delete')
    }
    
    const thumbnail = props.file.image_url
    const date = (
        <Moment format="DD/MM/YY H:ma">{props.file.created_at}</Moment>
    )

    return (
        <div className="File">
            <div className="card">
                <div className="card-content">
                    <div className="card-title-container">
                        <div className="thumbnail"
                            style={{
                                backgroundImage: `url(${thumbnail})`
                            }}></div>
                            <span className="card-title">{props.file.nice_url}</span>
                    </div>
                    <p className="time"><small>{date}</small></p>
                    <p>Snapshot from {props.file.url}</p>
                    
                    <div className="FileActions">
                        <button onClick={() => props.handleImageClick(props.file)} 
                            className="ViewButton btn-small blue darken-2 waves-light waves-effect">View Image</button>
                        <button onClick={() => props.handleDelete(props.file, props.confirmDelete)} 
                            className="DeleteButton btn-small red lighten-3 waves-light waves-effect">{props.confirmDelete ? 'Are you sure?' : 'Delete'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default File