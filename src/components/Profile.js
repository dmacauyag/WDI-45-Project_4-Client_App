import React, { Component } from 'react'
import Button from './Button'
import defaultProfileImg from '../assets/images/default-profile.png'

class Profile extends Component {
  render() {
    return (
      <div className='container profile-container'>
        <img className='profile-img' src={defaultProfileImg} />
        <h2>{this.props.currentUser.username}</h2>
        <div className='profile-info-container'>
          <p className="lead">Name: {this.props.currentUser.name}</p>
          <p className="lead">Email: {this.props.currentUser.email}</p>
          <p className="lead">Location: </p>
        </div>
        <Button
          label='Edit Profile'
          className='btn btn-primary'
        />
        <Button
          label='Delete Profile'
          className='btn btn-danger'
        />
      </div>
    )
  }
}

export default Profile
