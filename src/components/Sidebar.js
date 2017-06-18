import React, { Component } from 'react'

class Sidebar extends Component {

  render() {
    const bookmarkSection = this.props.user
    ? (
      <div className="text-block">
          <ul className="menu-vertical">
            <li><h4>Bookmarked Segments</h4></li>
            {this.props.bookmarks}
          </ul>
      </div>
    )
    : null

    const lineBreakBookmarkSection = this.props.user
    ? <hr />
    : null

    const currentSegmentSection = this.props.isSegmentsAvailable
    ? (
      <div className="text-block">
          <ul className="menu-vertical">
              <li><h4>Current Map Segments</h4></li>
              {this.props.segments}
          </ul>
      </div>
    )
    : null

    const lineBreakSegmentSection = this.props.isSegmentsAvailable
    ? <hr />
    : null

    const selectedSegmentSection = this.props.isCurrentSegment
    ? <div className="text-block">
        {this.props.currentSegment}
    </div>
    : null

    return (
      <div className="nav-container nav-container--sidebar">
			<div className="nav-sidebar-column bg--dark">
	            <div className="text-center text-block">
	                <a href="/">
	                    <h2 style={{fontFamily: 'Black Ops One, cursive'}}>Let's Move</h2>
	                </a>
	                <p>Find your next activity.</p>
	            </div>
	            <hr />
              <div className="text-block">
	                <ul className="menu-vertical">
	                    {this.props.navButtons}
	                </ul>
	            </div>
	            <hr />
	            {bookmarkSection}
              {lineBreakBookmarkSection}
              {selectedSegmentSection}
              {currentSegmentSection}
	            {lineBreakSegmentSection}
	            <div>

	            </div>
	        </div>

            <div className="nav-sidebar-column-toggle visible-xs visible-sm" data-toggle-className=".nav-sidebar-column;active">
                <i className="stack-menu"></i>
            </div>
        </div>
    )
  }
}

export default Sidebar
