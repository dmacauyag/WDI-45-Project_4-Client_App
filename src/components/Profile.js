import React, { Component } from 'react'
import Button from './Button'
import defaultProfileImg from '../assets/images/default-profile.png'

class Profile extends Component {
  constructor() {
    super()

    this.state = {
      editingProfile: false,
      name: "",
      username: "",
      email: "",
      password: "",
      locationLat: "",
      locationLng: ""
    }
  }

  _editProfile(evt) {
    evt.preventDefault()
    console.log(this.props.currentUser);
    this.setState({
      editingProfile: true,
      name: this.props.currentUser.name,
      username: this.props.currentUser.username,
      email: this.props.currentUser.email,
      locationLat: this.props.currentUser.locationLat,
      locationLng: this.props.currentUser.locationLng
    })
  }

  _handleInputChange(evt) {
    console.log(evt.target.value);
    if (evt.target.name === "name") {
      this.setState({
        name : evt.target.value
      })
    } else if (evt.target.name === "username") {
      this.setState({
        username : evt.target.value
      })
    } else if (evt.target.name === "email") {
      this.setState({
        email : evt.target.value
      })
    }
  }

  _setDefaultLocation(evt) {
    this.setState({
      locationLat: this.props.mapState.state.map.center.lat(),
      locationLng: this.props.mapState.state.map.center.lng()
    })
  }

  _finishEditProfile(evt) {
    evt.preventDefault()
    var updatedUserData = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      locationLat: this.state.locationLat,
      locationLng: this.state.locationLng
    }
    console.log(updatedUserData);
    this.props.onEditUser(updatedUserData)
    this.setState({
      editingProfile: false
    })
  }

  _handleDeleteProfile(evt) {
    evt.preventDefault()
    var confirmDelete = window.confirm("Are you sure you want to delete your account?")
    if (confirmDelete) {
      this.props.onDeleteUser()
    }
  }

  render() {
    const profileInfo = this.state.editingProfile
      ? (
        <div className='profile-info-container'>
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              required="true"
              onChange={this._handleInputChange.bind(this)} />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={this.state.username}
              required="true"
              onChange={this._handleInputChange.bind(this)} />
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              required="true"
              onChange={this._handleInputChange.bind(this)}/>
          </form>
          <Button
            label='Set the current map as the default location.'
            className='btn-link'
            onClick={this._setDefaultLocation.bind(this)}
          />
        </div>
      )
      : (
        <div className='profile-info-container'>
          <p className="lead">Name: {this.props.currentUser.name}</p>
          <p className="lead">Email: {this.props.currentUser.email}</p>
        </div>
      )

    const profileButtons = this.state.editingProfile
      ? (
        <div className='profile-button-container'>
          <Button
            label='Finish Edit'
            className='btn btn-warning'
            onClick={this._finishEditProfile.bind(this)}
          />
        </div>
      )
      : (
        <div className='profile-button-container'>
          <Button
            label='Edit Profile'
            className='btn btn-primary'
            onClick={this._editProfile.bind(this)}
          />
          <Button
            label='Delete Profile'
            className='btn btn-danger'
            onClick={this._handleDeleteProfile.bind(this)}
          />
        </div>
      )

    return (
      <div className='container profile-container'>
        <img className='profile-img' src={defaultProfileImg} />
        <h2>{this.props.currentUser.username}</h2>
        {profileInfo}
        <br />
        {profileButtons}
      </div>
    )
  }
}

export default Profile
