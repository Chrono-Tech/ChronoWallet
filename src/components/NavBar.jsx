import React from "react";


export default class NavBar extends React.Component {

    render() {
        return (
            <nav role="navigation" class="navbar navbar-default navbar-static-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" data-target="#navbarCollapse" data-toggle="collapse"
                                class="navbar-toggle">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a href="#" class="navbar-brand">
                            <p className="blue">Chrono</p>
                            <p className="yellow">Wallet</p>
                        </a>
                    </div>
                    <div id="navbarCollapse" class="collapse navbar-collapse">
                        <div className="nav-right">
                            <ul class="nav navbar-nav">
                                <li><a className="nav-option" href="#">Exchange</a></li>
                                <li><a className="nav-option" href="#">Voting</a></li>
                                <li><a className="nav-option" href="#">Redemption</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}