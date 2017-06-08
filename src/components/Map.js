import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps'
import axios from 'axios'
import cyclingMarker from '../assets/images/cyclingMarker.png'
import runningMarker from '../assets/images/runningMarker.png'
import startMarker from '../assets/images/startMarker.png'
import endMarker from '../assets/images/endMarker.png'

axios.defaults.baseURL = 'http://localhost:3001'

// function to decode google maps api polyline taken from:
// https://gist.github.com/ismaels/6636986
// source: http://doublespringlabs.blogspot.com.br/2012/11/decoding-polylines-from-google-maps.html
function decodePolyline(encoded){

    // array that holds the points

    var points=[ ]
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
        var b, shift = 0, result = 0;
        do {

    b = encoded.charAt(index++).charCodeAt(0) - 63;//finds ascii                                                                                    //and substract it by 63
              result |= (b & 0x1f) << shift;
              shift += 5;
             } while (b >= 0x20);


       var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
       lat += dlat;
      shift = 0;
      result = 0;
     do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
       shift += 5;
         } while (b >= 0x20);
     var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
     lng += dlng;

   points.push({lat:( lat / 1E5),lng:( lng / 1E5)})

  }
  return points
    }

class Map extends Component {
  _handleClickMarker(id) {
    this.props.onMarkerClick(id)
  }

  render() {
    var markerIcon = (this.props.activityType === 'riding')
      ? cyclingMarker
      : runningMarker

    var markerIcon = (this.props.isSegmentSelected)
      ? startMarker
      : markerIcon

    const markers = this.props.segments.map((segment, i) => {
      const marker = {
        position: {
          lat: segment.start_latlng[0],
          lng: segment.start_latlng[1]
        },
        segmentId: segment.id
      }
      return <Marker
              key={i}
              icon={markerIcon}
              onClick={this._handleClickMarker.bind(this, segment.id)}
              {...marker} />
    })

    const currentSegmentMarkerStart = this.props.currentSegment
      ? {
        lat: this.props.currentSegment.start_latitude,
        lng: this.props.currentSegment.start_longitude
      }
      : null

    const currentSegmentMarkerEnd = this.props.currentSegment
      ? {
        lat: this.props.currentSegment.end_latitude,
        lng: this.props.currentSegment.end_longitude
      }
      : null

    const decodedPolyline = this.props.polyline
      ? decodePolyline(this.props.polyline)
      : []

    const polylineOptions = {
      strokeColor: '#ff0d00',
      strokeOpacity: '0.7',
      strokeWeight: '5'
    }

    return (
      <GoogleMap
        ref={this.props.ref}
        onDragEnd={this.props.onDragEnd}
        onZoomChanged={this.props.onZoomChanged}
        defaultZoom={this.props.zoom}
        center={this.props.center} >
        {markers}
        <Marker icon={startMarker} position={currentSegmentMarkerStart}/>
        <Marker icon={endMarker} position={currentSegmentMarkerEnd}/>
        <Polyline
          options={polylineOptions}
          path={decodedPolyline} />
      </GoogleMap>
    )
  }
}

export default withGoogleMap(Map)
