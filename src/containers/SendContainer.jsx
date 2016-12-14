import React, {PropTypes, Component} from "react";
import {send} from "../actions";
import {List} from "immutable";
import BigNumber from "bignumber.js";
import Send from "../components/Send";

export default class SendContainer extends Component {

    constructor() {
        super();
        this.state = {
            recipientInputError: '',
            recipient: '', //variable for recipient input
            amountInputError: '',
            amount: '', //variable for amount input
            amountLH: 0,
            amountFiat: 0,
            currency: '',
            currencyAlias: '',
            currencies: '',
            currenciesAlias: '',
            fee: '0',
            feeRate: 0, //is a BigNumber
            feeAlias: '0',
            aliasRate: 0, //is a BigNumber
            total: 0,
            totalAlias: 0,
            switched: false
        };
        this.recipientHandler = this.recipientHandler.bind(this);
        this.amountHandler = this.amountHandler.bind(this);
        this.send = this.send.bind(this);
        this.checkAmount = this.checkAmount.bind(this);
        this.switchAlias = this.switchAlias.bind(this);
        this.pickCurrency = this.pickCurrency.bind(this);
        this.clearAmount = this.clearAmount.bind(this);
    }

    componentWillMount() {
        this.pickCurrency(this.props.balances.get(0).get('symbol'));
    }

    recipientHandler(text) {
        if (text.length <= 42) {
            this.setState({recipient: text, recipientInputError: ''});
        } else {
            this.setState({
                recipient: text,
                recipientInputError: 'Address has to be 42 symbols long.'
            });
        }
    }

    checkAmount(text) {
        if (text !== '' && isNaN(text)) {
            this.setState({amount: text, amountInputError: 'Not a number.'});
        } else if (text.startsWith('-')) {
            this.setState({amount: text, amountInputError: 'Has to be positive number.'});
        } else if (text === '') {
            this.clearAmount();
            this.setState({
                amount: text,
                amountInputError: '',
            });
        } else if (this.state.switched) {
            if (!/^\d*[\.]?\d{0,2}$/.test(text.replace(/\.?0+$/, ""))) {
                this.setState({
                    amount: text,
                    amountInputError: 'You can\'t send amount having more than 2 decimal places'
                });
            } else {
                return true;
            }
        } else {
            if (!/^\d*[\.]?\d{0,8}$/.test(text.replace(/\.?0+$/, ""))) {
                this.setState({
                    amount: text,
                    amountInputError: 'You can\'t send amount having more than 8 decimal places'
                });
            } else {
                return true;
            }
        }
        return false;
    }

    amountHandler(text) {
        if (this.checkAmount(text)) {
            let integer = new BigNumber(text);
            let aliasRate = this.state.aliasRate;
            let amountLH;
            let amountFiat;
            let fee;
            let feeAlias;
            let total;
            let totalAlias;

            let balance = this.props.balances
                .find(balance => balance.get('symbol') === this.state.currency)
                .get('balance');

            if (this.state.switched) {
                amountLH = integer.times(aliasRate.pow(-1)).round(8);
                amountFiat = integer;
                fee = amountFiat.times(this.state.feeRate).round(2);
                feeAlias = amountLH.times(this.state.feeRate).round(8);
                total = amountFiat.plus(fee).round(2);
                totalAlias = amountLH.plus(feeAlias).round(8);

                let aliasBalance = new BigNumber(balance).times(this.state.aliasRate);

                if (total.greaterThan(aliasBalance)) {
                    this.setState({
                        amountInputError: 'Not enough tokens on your balance.'
                    });
                } else {
                    this.setState({
                        amountInputError: ''
                    });
                }
            } else {
                amountLH = integer;
                amountFiat = integer.times(aliasRate).round(2);
                fee = amountLH.times(this.state.feeRate.round(8));
                if (integer.lessThan('0.000004')) {
                    //Sets fee for extra-small numbers
                    fee = new BigNumber('0.00000001');
                }
                feeAlias = amountFiat.times(this.state.feeRate).round(2);
                total = amountLH.plus(fee).round(8);
                totalAlias = amountFiat.plus(feeAlias).round(2);

                if (total.greaterThan(balance)) {
                    this.setState({
                        amountInputError: 'Not enough tokens on your balance.',
                    });
                } else {
                    this.setState({
                        amountInputError: ''
                    });
                }
            }

            this.setState({
                amount: text,
                amountLH: amountLH.toFixed(8),
                amountFiat: amountFiat.toFixed(2),
                fee: fee.toFixed(8).replace(/\.?0+$/, ""),
                feeAlias: feeAlias.toFixed(8).replace(/\.?0+$/, ""),
                total: total.toFixed(8).replace(/\.?0+$/, ""),
                totalAlias: totalAlias.toFixed(8).replace(/\.?0+$/, "")
            });
        }
    }

    send() {
        if (this.state.recipient.length === 0) {
            this.setState({recipientInputError: 'This field is required to make send.'});
            return;
        } else if (this.state.amount.length === 0) {
            this.setState({amountInputError: 'This field is required to make send.'});
            return;
        }

        if (this.state.recipient.length !== 40 && this.state.recipient.length !== 42) {
            this.setState({recipientInputError: 'Address has to be 40 symbols long not including \'0x\' or 42 including \'0x\'.'});
            return;
        } else if (!web3.isAddress(this.state.recipient)) {
            this.setState({recipientInputError: 'Address has to be hexadecimal string. Check it has no special symbols and correct encoding.'});
            return;
        } else if (this.state.amountInputError.length > 0) {
            return;
        }

        send(this.state.recipient, this.state.amountLH, this.state.currency);
        this.setState({recipient: ''});
        this.clearAmount();
    }

    switchAlias() {
        let switched = this.state.switched;
        this.setState({
            switched: !switched
        });
        this.clearAmount();
    }

    clearAmount() {
        this.setState({
            amount: '',
            amountLH: 0,
            amountFiat: 0,
            fee: '0',
            feeAlias: '0',
            total: 0,
            totalAlias: 0
        });
    }

    pickCurrency(pickedCurrency) {
        let currencies = [];
        let currency = pickedCurrency;
        let currencyAlias = '';
        let currenciesAlias = [];
        let aliasRate = 1;
        let fee = 0;
        this.props.balances.forEach((balance) => {
            if (balance.get('symbol') === pickedCurrency || balance.get('fiatSymbol') === pickedCurrency) {
                if (balance.get('fiatSymbol') === pickedCurrency) {
                    currency = balance.get('symbol');
                }
                currencyAlias = balance.get('fiatSymbol');
                aliasRate = balance.get('fiatRate');
                fee = new BigNumber(balance.get('fee'));
                return;
            }
            currencies.push(balance.get('symbol'));
            currenciesAlias.push(balance.get('fiatSymbol'));
        });
        this.setState({
            currency: currency,
            currencies: currencies,
            currenciesAlias: currenciesAlias,
            currencyAlias: currencyAlias,
            aliasRate: aliasRate,
            feeRate: fee,
        });
        this.clearAmount();
    }

    render() {
        let currency;
        let currencyAlias;
        let currencies;
        let amountAlias;
        if (this.state.switched) {
            currency = this.state.currencyAlias;
            currencyAlias = this.state.currency;
            currencies = this.state.currenciesAlias;
            amountAlias = this.state.amountLH.toString();
        } else {
            currency = this.state.currency;
            currencyAlias = this.state.currencyAlias;
            currencies = this.state.currencies;
            amountAlias = this.state.amountFiat.toString();
        }
        return (
            <Send currencies={currencies}
                  currency={currency}
                  currencyAlias={currencyAlias}
                  amount={this.state.amount}
                  amountAlias={amountAlias}
                  fee={this.state.fee}
                  feeAlias={this.state.feeAlias}
                  total={this.state.total.toString()}
                  totalAlias={this.state.totalAlias.toString()}
                  amountInputError={this.state.amountInputError}
                  recipient={this.state.recipient}
                  recipientInputError={this.state.recipientInputError}
                  recipientHandler={this.recipientHandler}
                  amountHandler={this.amountHandler}
                  send={this.send}
                  switchAlias={this.switchAlias}
                  pickCurrency={this.pickCurrency}
            />
        );
    }
}

SendContainer.propTypes = {
    balances: PropTypes.instanceOf(List).isRequired,
};
