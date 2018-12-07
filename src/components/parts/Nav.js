import React from 'react'
import { Link } from 'react-router-dom'
import config from '../../config'

const Nav = () => {
    return (
        <nav>
          <div className="nav-wrapper blue darken-2">
            <div className="container">
              <a href="/" className="brand-logo">{config.app_name}</a>
              <ul className="right">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/media">Saved Media</Link></li>
              </ul>
            </div>
          </div>
        </nav>
    )
}

export default Nav