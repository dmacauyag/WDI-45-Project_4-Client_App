import React, { Component } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import './App.css'
import clientAuth from './clientAuth'
import SignUp from './components/SignUp'
import LogIn from './components/LogIn'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import Button from './components/Button'
import Map from './components/Map.js'
//////////////////////////////////////////////////////////////
const mql = window.matchMedia(`(min-width: 800px)`)
const serverUrl = 'https://warm-lowlands-86926.herokuapp.com'
//////////////////////////////////////////////////////////////
axios.defaults.baseURL = serverUrl
//////////////////////////////////////////////////////////////
class App extends Component {

  constructor() {
    super()

    this.state = {
      mql: mql,
      segments: [],
      isSegmentsAvailable: false,
      segmentSelected: 'riding',
      isBookmarkSelected: false,
      isSegmentSelected: false,
      isCurrentSegment: false,
      activityType: 'riding',
      bookmarks: [],
      updatedBookmark: null,
      currentSegment: null,
      currentSegmentPolyline: null,
      map: null,
      mapCenter: {
        lat: 37.832429,
        lng: -122.479534
      },
      bounds: null,
      currentUser: null,
      loggedIn: false,
      view: 'home',
      isModalOpen: false,
      currentModal: null
    }

    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = pos.coords
        console.log('user coords', coords)
        this.setState({
          mapCenter: {
            lat: coords.latitude,
            lng: coords.longitude
          }
        })
      })
    }

    const currentUser = clientAuth.getCurrentUser()
    clientAuth.getBookmarks().then(res => {
      this.setState({
        currentUser: currentUser,
        loggedIn: !!currentUser,
        bookmarks: res.data || []
      })
    })
  }
//////////////////////////////////////////////////////////////
  openModal(evt) {
    this.setState({
      isModalOpen: true,
      currentModal: evt.target.name
    })
  }

  closeModal() {
    this.setState({isModalOpen: false})
  }
//////////////////////////////////////////////////////////////
  _signUp(newUser) {
    clientAuth.signUp(newUser).then((data) => {
      const currentUser = clientAuth.getCurrentUser()
      this.setState({
        currentUser: currentUser,
        loggedIn: !!currentUser,
        isModalOpen: false
      })
    })
  }

  _logIn(credentials) {
    console.log(credentials)
    clientAuth.logIn(credentials).then(user => {
      this.setState({
        currentUser: user,
        loggedIn: true,
        isModalOpen: false
      }, () => {
        clientAuth.getBookmarks().then(res => {
          this.setState({
            bookmarks: res.data || []
          })
        })
      })
    })
  }

  _logOut() {
    clientAuth.logOut().then(message => {
      console.log(message)
      this.setState({
        currentUser: null,
        loggedIn: false,
        view: 'home',
        bookmarks: []
      })
    })
  }

  _setView(evt) {
    evt.preventDefault()
    const view = evt.target.name
    this.setState({
      view: view
    })
  }

  _handleSegmentSelect(evt) {
    this.setState({
      segmentSelected: evt.target.value
    })
  }
//////////////////////////////////////////////////////////////
  _mapLoaded(map) {
    console.log('_mapLoaded')
    if (this.state.map != null)
      return
    this.setState({
      map: map
    })
  }

  _mapMoved() {
    console.log('_mapMoved center:', JSON.stringify(this.state.map.state.map.getCenter()))

    const bounds = this.state.map.state.map.getBounds()
    const boundaryStr = `${bounds.f.b}, ${bounds.b.b}, ${bounds.f.f}, ${bounds.b.f}`

    this._loadNewMapSegments(boundaryStr)
  }

  _zoomChanged() {
    console.log('_zoomChanged:', this.state.map.state.map.getZoom())

    const bounds = this.state.map.state.map.getBounds()
    const boundaryStr = `${bounds.f.b}, ${bounds.b.b}, ${bounds.f.f}, ${bounds.b.f}`

    this._loadNewMapSegments(boundaryStr)
  }

  _loadNewMapSegments(bounds) {
    console.log('retrieving new strava segments')
    return axios({
      url: '/api/strava/segments',
      method: 'post',
      data: {
        boundary: bounds,
        activityType: this.state.segmentSelected
      }
    })
    .then(res => {
      console.log(res.data.data.segments)
      this.setState({
        isSegmentsAvailable: true,
        segments: [
          ...res.data.data.segments
        ],
        bounds: bounds,
        segmentSelected: this.state.segmentSelected,
        activityType: this.state.segmentSelected,
        isSegmentSelected: false
      })
    })
  }

  _markerClicked(id) {
    console.log('marker was clicked:', id)
    this._getMarkerSegment(id)
  }

  _inputChange(newCenter, boundaryStr) {
    console.log("new search input at:", newCenter)

    this.setState({
      mapCenter: newCenter
    })
  }
//////////////////////////////////////////////////////////////
  _addBookmark(evt) {
    evt.preventDefault()
    console.log("Bookmarked item", evt.target.id)

    const newBookmark = {
      stravaId: this.state.currentSegment.id,
      name: this.state.currentSegment.name,
      activityType: this.state.currentSegment.activity_type,
      distance: this.state.currentSegment.distance,
      city: this.state.currentSegment.city,
      state: this.state.currentSegment.state,
      polyline: this.state.currentSegment.map.polyline
    }

    clientAuth.addBookmark(newBookmark).then(res => {
      this.setState({
        bookmarks: [
          ...this.state.bookmarks,
          res.data.segment
        ],
        isBookmarkSelected: true
      })
    })
  }

  _updateBookmarkPlus(evt) {
    evt.preventDefault()
    const id = evt.target.id
    console.log('update bookmark +1 by:', id)

    clientAuth.updateBookmarkPlus(id).then(res => {
      const updatedSegment = res.data.segment
      this._updateBookmarkList(updatedSegment)
    })
  }

  _updateBookmarkMinus(evt) {
    evt.preventDefault()
    const id = evt.target.id
    console.log('update bookmark -1 by:', id)

    clientAuth.updateBookmarkMinus(id).then(res => {
      const updatedSegment = res.data.segment
      this._updateBookmarkList(updatedSegment)
    })
  }

  _updateBookmarkList(updatedSegment) {
    this.setState({
      bookmarks: this.state.bookmarks.map((segment, i) => {
        if (updatedSegment._id !== segment._id) {
          return segment
        } else {
          return updatedSegment
        }
      })
    })
  }

  _deleteBookmark(evt) {
    evt.preventDefault()
    const id = evt.target.id

    clientAuth.deleteBookmark(id).then(res => {
      this._isSegmentBookmarked(id)
      this.setState({
        bookmarks: this.state.bookmarks.filter((segment) => {
          return segment._id !== id
        }),
      })
    })
  }
  //////////////////////////////////////////////////////////////
  _getSegment(evt) {
    evt.preventDefault()
    console.log("Get segment info from strava for:", evt.target.id)
    const id = evt.target.id

    this._isSegmentBookmarked(id)

    this._getSegmentFromStrava(id)
  }

  _getBookmarkedSegment(evt) {
    evt.preventDefault()
    console.log("Get segment info for the bookmarked segment:", evt.target.id)
    const id = evt.target.id

    this.setState({
      isBookmarkSelected: true
    })

    this._getSegmentFromStrava(id)
  }

  _getMarkerSegment(id) {
    console.log("Get segment info for marker:", id)
    this._isSegmentBookmarked(id)

    this._getSegmentFromStrava(id)
  }

  _getSegmentFromStrava(id) {
    return axios({
      url:`/api/strava/segments/${id}`,
      method: 'get'
    })
    .then(res => {
      console.log(res.data.data)
      const currentSegment = res.data.data

      this.setState({
        currentSegment: currentSegment,
        currentSegmentPolyline: currentSegment.map.polyline,
        isCurrentSegment: true,
        isSegmentSelected: true,
        mapCenter: {
          lat: currentSegment.start_latitude,
          lng: currentSegment.start_longitude
        },
        segments: [
          currentSegment
        ]
      })
    })
  }

  _isSegmentBookmarked(id) {
    var isBookmarked = false
    for (var i = 0; i < this.state.bookmarks.length; i++) {
      if (Number(this.state.bookmarks[i].stravaId) === Number(id)) {
        isBookmarked = true
        break
      }
    }

    this.setState({
      isBookmarkSelected: isBookmarked
    })
  }
//////////////////////////////////////////////////////////////
  render() {
    const isLoggedIn = this.state.loggedIn

    const bannerHeader = isLoggedIn
      ? `Welcome ${this.state.currentUser.name}!`
      : "Welcome to Let's Move!"

    const bannerText = isLoggedIn
      ? "Select the type of activity you're looking for and navigate the map below to find corresponding segments."
      : "Click on Sign Up or Log In on the left to begin"

    const bookmarkElements = this.state.bookmarks.map((segment, i) => {
      return (
        <li key={i} id={segment.stravaId}>
          <li onClick={this._getBookmarkedSegment.bind(this)} className='cursorTxt'><strong id={segment.stravaId} >{segment.name}</strong></li>
          <p style={{margin: 0}}><i>{segment.city}, {segment.state}</i></p>
          <p style={{margin: 0}}>Times Completed: {segment.timesCompleted}</p>
          <div>
            <span value="1" id={segment._id} className="glyphicon glyphicon-plus cursorIcon" aria-hidden="true" onClick={this._updateBookmarkPlus.bind(this)}></span>
            <span value="-1" id={segment._id} className="glyphicon glyphicon-minus cursorIcon" aria-hidden="true" onClick={this._updateBookmarkMinus.bind(this)} style={{paddingLeft:'10px'}}></span>
            <span id={segment._id} className="glyphicon glyphicon-trash cursorIcon" aria-hidden="true" onClick={this._deleteBookmark.bind(this)} style={{paddingLeft:'10px'}}></span>
          </div>
          <hr className="short" />
        </li>
      )
    })

    const bookmarkBtn = (this.state.currentSegment && (this.state.currentUser && !(this.state.isBookmarkSelected)))
      ? (
        <button id={this.state.currentSegment.id} name={this.state.currentSegment.name} style={{height: '30px', backgroundColor: 'green'}} onClick={this._addBookmark.bind(this)}>Bookmark Segment</button>
      )
      : null

    const currentSegmentElement = this.state.currentSegment
      ? (
        <ul>
          <li><h4><strong>Selected Segment</strong></h4></li>
          <li><strong>Name:</strong> {this.state.currentSegment.name}</li>
          <li><strong>Location:</strong> {this.state.currentSegment.city}, {this.state.currentSegment.state}</li>
          <li><strong>Activity Type:</strong> {this.state.currentSegment.activity_type}</li>
          <li><strong>Distance:</strong> {(this.state.currentSegment.distance / 1609.344).toFixed(2)} miles</li>
          <li><strong>Average Grade:</strong> {this.state.currentSegment.average_grade}%</li>
          {bookmarkBtn}
          <hr />
        </ul>
      )
      : null

    const segmentElements = this.state.segments.map((segment, i) => {
      return (
        <li key={i} id={segment.id} className='cursorTxt'>
          <span id={segment.id} onClick={this._getSegment.bind(this)} >{segment.name}</span>
        </li>
      )
    })

    var navButtons = null

    if (isLoggedIn) {
      navButtons = (
        <div style={{textAlign: 'center'}}>
          <Button
            label='Log Out'
            name='login'
            className='btn-link'
            onClick={this._logOut.bind(this)}
          />
        </div>
      )
    } else {
      navButtons = (
        <div style={{textAlign: 'center'}}>
          <Button
            label='Sign Up'
            name='signup'
            className='btn btn-primary customBtn'
            onClick={this.openModal.bind(this)}
          />
          <span className='	glyphicon glyphicon-option-vertical'></span>
          <Button
            label='Log In'
            name='login'
            className='btn-link'
            onClick={this.openModal.bind(this)}
          />
        </div>
      )
    }

    var modalElement = null

    if (this.state.currentModal === "signup") {
      modalElement = <SignUp onSignup={this._signUp.bind(this)} />
    } else if (this.state.currentModal === "login") {
      modalElement = <LogIn onLogin={this._logIn.bind(this)} />
    }

    const customModalStyles = {
      content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
      }
    }
//////////////////////////////////////////////////////////////
    return (
      <div>
        <div>
          <Modal
            isOpen={this.state.isModalOpen}
            onRequestClose={this.closeModal}
            contentLabel={this.state.currentModal}
            style={customModalStyles}
          >
            {modalElement}
          </Modal>

          <Sidebar
            user = {this.state.currentUser}
            isSegmentsAvailable = {this.state.isSegmentsAvailable}
            isCurrentSegment = {this.state.isCurrentSegment}
            navButtons={navButtons}
            bookmarks={bookmarkElements}
            segments={segmentElements}
            currentSegment={currentSegmentElement}
          />

          <div className="main-container">
            <section className="imagebg image--light cover cover-blocks bg--secondary" style={{padding: 0}}>
              <div className="container">
                <div className="row">
                    <div className="col-sm-6 col-md-5 col-md-offset-1">
                      <div>
                        <h1>{bannerHeader}</h1>
                        <p className="lead">
                          {bannerText}
                        </p>
                        <hr className="short" />
                        <div className="form-group">
                          <label>Activity Type:</label>
                            <select className="form-control" onChange={this._handleSegmentSelect.bind(this)}>
                              <option value="riding">Cycling</option>
                              <option value="running">Running</option>
                            </select>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </section>

            <section id="elements" style={{padding: 0}}>
              <div className="container" style={{padding: `10px`, height: `500px`, width: `100%`}}>
                <Map
                  zoom={14}
                  center={this.state.mapCenter}
                  segments={this.state.segments}
                  activityType={this.state.activityType}
                  polyline={this.state.currentSegmentPolyline}
                  isSegmentSelected={this.state.isSegmentSelected}
                  currentSegment={this.state.currentSegment}
                  ref={this._mapLoaded.bind(this)}
                  onMarkerClick={this._markerClicked.bind(this)}
                  onPlacesChanged={this._inputChange.bind(this)}
                  onDragEnd={this._mapMoved.bind(this)}
                  onZoomChanged={this._zoomChanged.bind(this)}
                  containerElement={<div style={{ height: `100%` }} />}
                  mapElement={<div style={{ height: `100%` }} />}
                />
              </div>
            </section>
            <Footer />
          </div>
        </div>
      </div>
    )
  }
}
//////////////////////////////////////////////////////////////
export default App
