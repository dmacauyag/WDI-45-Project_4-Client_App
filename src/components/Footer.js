import React, { Component } from 'react'

class Footer extends Component {
  render() {
    return (
      <footer className="text-center space--sm footer-5  ">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div>
                            <ul className="social-list list-inline list--hover">
                                <li>
                                    <a target="_blank" href="https://github.com/dmacauyag/WDI-45-Project_4-Server_App">
                                        <img src={require('../assets/images/github-small.png')} alt="Github" style={{width: '25px'}}></img>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <span className="type--fine-print">&copy;
                                <span className="update-year"></span> Let's Move 2017</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
  }
}

export default Footer
