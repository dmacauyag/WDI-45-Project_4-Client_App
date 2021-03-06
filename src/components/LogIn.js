import React, { Component } from 'react'

class LogIn extends Component {
  _handleLogin(evt) {
    evt.preventDefault()
    const credentials = {
      email: this.refs.email.value,
      password: this.refs.password.value
    }
    this.props.onLogin(credentials)

    this.setState({
      view: 'home'
    })
  }

  render() {
    return (
      <div className='container login-container'>
        <h2>Log In</h2>
        <form onSubmit={this._handleLogin.bind(this)}>
          <input type='text' placeholder='Email' ref='email' required='true' />
          <input type='password' placeholder='Password' ref='password' required='true' />
          <button type='submit'>Log In</button>
        </form>
      </div>
    )
  }
}

export default LogIn
