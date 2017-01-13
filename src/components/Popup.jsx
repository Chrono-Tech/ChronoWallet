import React, {PropTypes, Component} from "react";

export default class Popup extends Component {

    render() {
        if (this.props.custom) {
            return <div className="popup-background">
                <div className="popup-container">
                    <p className="popup-header">{this.props.header}</p>
                    {this.props.custom}
                    <button className="popup-button"
                            onClick={() => this.props.closePopup()}
                    >
                        {this.props.buttonText}
                    </button>
                </div>
            </div>
        } else {
            return <div className="popup-background">
                <div className="popup-container">
                    <p className="popup-header">{this.props.header}</p>
                    <p className="popup-text">{this.props.text}</p>
                    <button className="popup-button"
                            onClick={() => this.props.closePopup()}
                    >
                        {this.props.buttonText}
                    </button>
                </div>
            </div>
        }
    }

}

Popup.propTypes = {
    closePopup: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired,
    text: PropTypes.string,
    buttonText: PropTypes.string,
    custom: PropTypes.renderable
};

Popup.defaultProps = {
    header: 'Popup header',
    text: 'Popup text!',
    buttonText: 'Got it!',
};