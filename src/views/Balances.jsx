import React, {PropTypes, Component} from "react";
import {List} from "immutable";
import {setCurrentAccount} from "../actions";

export default class Balances extends Component {

    constructor() {
        super();
        this.state = {
            showDropdownAddress: false,
            loading: false
        };
        this.revertShowAddress = this.revertShowAddress.bind(this);
        this.showDropdownAddress = this.showDropdownAddress.bind(this);
    }

    componentWillMount() {
        if (!this.props.balances) {
            this.setState({loading: true});
        }
    }

    revertShowAddress() {
        console.log("CHANGE!!!!!!");
        let revert = this.state.showDropdownAddress;
        this.setState({showDropdownAddress: !revert})
    }

    showDropdownAddress() {
        if (this.props.accounts) {
            return (
                <div className="address-dropdown">
                    {this.props.accounts.map(account => {
                        if (account === this.props.currentAccount) {
                            return;
                        }
                        return ( <p onClick={() => this.pickAddress(account)}
                                    className="address-dropdown-entry">{account}</p>);
                    })}
                </div>
            );
        }
    }

    pickAddress(address) {
        setCurrentAccount(address);
        this.setState({
            showDropdownAddress: false
        });

    }

    showBalances() {
        if (this.props.balances && this.props.balances.size > 0) {
            let balanceInfo = [];
            this.props.balances.toArray().forEach((entry, index) => {
                balanceInfo.push(
                    <div key={entry.get('symbol')}>
                        <p className="balance-value">{entry.get('balance')}&nbsp;</p>
                        {entry.get('pending') === 0 ? null :
                            <p className="balance-pending">{entry.get('pending')}&nbsp;</p>
                        }
                        <p className="balance-currency">{entry.get('symbol')}</p>
                        <div className="balance-vertical-separator"/>
                        <p className="balance-value">alias-balance&nbsp;</p>
                        <p className="balance-currency">alias-currency</p>
                        {(index + 1) === this.props.balances.size ? null :
                            <div className="balance-horizontal-separator"/> }
                    </div>
                )
            });
            return balanceInfo;
        }
    }

    render() {
        let accountChoices = this.showDropdownAddress();
        let balances = this.showBalances();

        return (
            <div className="transparent-box">
                <div className="row">
                    <h2>Balances</h2>
                </div>
                <div className="row">
                    <h3>for</h3>
                    <span style={{"position": "relative"}}>
                        <p className="dropdown-label">{this.props.currentAccount}</p>
                        <button className="dropdown-button"
                                onClick={() => this.revertShowAddress()}>
                            <div className="dropdown-symbol">
                                <i class="fa fa-arrow-down" aria-hidden="true"/>
                            </div>
                        </button>
                        {this.state.showDropdownAddress ? accountChoices : null}
                    </span>
                </div>

                <div className="row">
                    <div className="balance-container">
                        {this.props.balances ? balances :
                            <image src="../assets/cat1.gif" className="cat"/>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Balances.propTypes = {
    currentAccount: PropTypes.string.isRequired,
    accounts: PropTypes.object.isRequired,
    balances: PropTypes.instanceOf(List),
};
