import React, {PropTypes, Component} from "react";
import {send} from "../actions";
import {List} from "immutable";
import BigNumber from "bignumber.js";

export default class Send extends Component {

    constructor() {
        super();
        this.state = {
            showDropdownCurrency: false,
        };
        this.showDropdownCurrency = this.showDropdownCurrency.bind(this);
    }


    showDropdownCurrency() {
        return (
            <div className="currency-dropdown">
                {this.props.currencies.map(currency =>
                    <p onClick={() => this.pickCurrency(currency)}
                       className="currency-dropdown-entry">{currency}</p>)}
            </div>
        );

    }

    render() {
        let currencyChoices = this.showDropdownCurrency();
        return (
            <div className="transparent-box">
                <div className="row">
                    <h2>Send</h2>
                </div>

                <div className="row">
                    <p className="send-label">Recipient</p>
                    <input className="send-recipient-input"
                           type="text" value={this.props.recipient}
                           placeholder="Recipient"
                           onChange={input => this.props.recipientHandler(input.target.value)}
                    />
                    {this.props.recipientInputError.length === 0 ? null :
                        <span className="send-input-error-sign">
                                    <i class="fa fa-hand-o-left" aria-hidden="true"/>
                                </span>
                    }
                </div>

                <div className="row">
                    <p className="send-input-error"> {this.props.recipientInputError}</p>
                </div>

                <div className="row">
                    <p className="send-label">Amount</p>
                    <input className="send-amount-input" type="text"
                           value={this.props.amount}
                           placeholder="0.0"
                           onChange={input => this.props.amountHandler(input.target.value)}
                    />
                    <span style={{"position": "relative"}}>
                        <p className="send-input-currency-label">{this.props.currency}</p>
                        <button className="dropdown-button"
                                onClick={() => this.revertShowCurrency()}
                        >
                            <div className="dropdown-symbol">
                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                            </div>
                        </button>
                        {this.state.showDropdownCurrency ? currencyChoices : null}
                    </span>
                    {this.props.amountInputError.length === 0 ? null :
                        <span className="send-input-error-sign">
                            <i class="fa fa-hand-o-left" aria-hidden="true"/>
                        </span>
                    }
                </div>

                <div className="row">
                    <p className="send-input-error"> {this.props.amountInputError}</p>
                </div>

                <div className="row">
                    <p className="send-amount-alias">
                        ≈ {this.props.amountAlias} {this.props.currencyAlias}</p>

                    <button className="sent-switch-button"
                            onClick={() => this.switchAlias()}
                    >
                        Switch
                    </button>
                </div>

                <div className="row">
                    <div>
                        <p className="send-fee-label">Fee:</p>
                        <span>
                            <p className="send-fee-amount">{this.props.fee}</p>
                            <p className="send-fee-text">{this.props.currency}&nbsp;
                                ≈ {this.props.feeAlias} {this.props.currencyAlias}</p>
                        </span>

                    </div>
                    <div>
                        <p className="send-fee-label">Total:</p>
                        <p className="send-fee-amount">{this.props.total}</p>
                        <p className="send-fee-text">{this.props.currency}&nbsp;
                            ≈ {this.props.totalAlias} {this.props.currencyAlias}</p>

                    </div>
                </div>

                <div className="row">
                    <button className="send-button" onClick={this.send}>Send</button>
                </div>
            </div>
        );
    }
}

Send.propTypes = {
    currencies: PropTypes.array.isRequired,
    currency: PropTypes.string.isRequired,
    currencyAlias: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    amountAlias: PropTypes.string.isRequired,
    fee: PropTypes.string.isRequired,
    feeAlias: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    totalAlias: PropTypes.string.isRequired,
    amountInputError: PropTypes.string.isRequired,
    recipientInputError: PropTypes.string.isRequired,
    recipientHandler: PropTypes.func.isRequired,
    amountHandler: PropTypes.func.isRequired,
};
