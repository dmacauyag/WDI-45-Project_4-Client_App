import React, { Component } from 'react'

class SignUp extends Component {
  _handleSignup(evt) {
    evt.preventDefault()
    const newUser = {
      name: this.refs.name.value,
      username: this.refs.username.value,
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onSignup(newUser)
  }

  render() {
    return (
      <div className='container'>
        <h2>Sign Up</h2>
        <form onSubmit={this._handleSignup.bind(this)}>
          <input type='text' placeholder='Name' ref='name' required='true' />
          <input type='text' placeholder='Username' ref='username' required='true' />
          <input type='text' placeholder='Email' ref='email' required='true' />
          <input type='password' placeholder='Password' ref='password' required='true' />
          <button type='submit'>Create Account</button>
        </form>
      </div>
    )
  }
}

export default SignUp
