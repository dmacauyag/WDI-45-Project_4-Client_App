import React, { Component } from 'react'

class Button extends Component {
  render() {
    const btnLabel = this.props.label

    return (
      <button
        name={this.props.name}
        className={this.props.className}
        onClick={this.props.onClick}>
        {btnLabel}
      </button>
    )
  }
}

export default Button
