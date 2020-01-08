import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';

import QrReader from 'react-qr-reader'

class CheckUser extends Component {
    constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			tab: 1,
			wrong_address: false,
			status: false,
			requests: {
				ticketsOfUser: false,
				listOfTickets: false,
				requestsDone: false
			}
		};
		this.address = null;
		this.ticketsOfUser = null;
		this.listOfTickets = [];
	}

	changeTab = (tab, event) => {
		event.preventDefault();
		this.setState({
			tab: tab
		});
	}

	checkManual = () => {
		if (!this.address.value || !this.context.drizzle.web3.utils.isAddress(this.address.value)) {
			this.setState({wrong_address: true});
		} else {
			this.runChecking(this.address.value);
		}
	}

	checkQR = (data) => {
		if (data) {
			if (this.context.drizzle.web3.utils.isAddress(data)) {
				this.runChecking(data);
			}
		}
	}

	runChecking = (address) => {
		this.ticketsOfUser = this.contracts['OpenEvents'].methods.ticketsOf.cacheCall(address);
		this.setState({
			wrong_address: false,
			requests: {
				ticketsOfUser: true,
				listOfTickets: false,
				requestsDone: false
			},
			status: false
		});
	}

	checkTickets = () => {
		if (
			this.state.requests.ticketsOfUser &&
			this.ticketsOfUser !== null &&
			typeof this.props.contracts['OpenEvents'].ticketsOf[this.ticketsOfUser] !== 'undefined' &&
			!this.state.requests.listOfTickets
		) {
			let tickets = this.props.contracts['OpenEvents'].ticketsOf[this.ticketsOfUser].value;

			for (let i = 0; i < tickets.length; i++) {
				this.listOfTickets.push(this.contracts['OpenEvents'].methods.getTicket.cacheCall(tickets[i]));
			}

			this.setState({
				requests: {
					ticketsOfUser: true,
					listOfTickets: true,
					requestsDone: false
				}
			});
		}

		if (this.state.requests.listOfTickets) {
			let loading = false;
			let found = false;

			for (let i = 0; i < this.listOfTickets.length; i++) {
				if (typeof this.props.contracts['OpenEvents'].getTicket[this.listOfTickets[i]] === 'undefined') {
					loading = true;
				} else {
					if (this.props.contracts['OpenEvents'].getTicket[this.listOfTickets[i]].value[0] === this.props.event_id) {
						found = true;
					}
				}
			}

			if (!loading) {
				this.setState({
					requests: {
						ticketsOfUser: false,
						listOfTickets: false,
						requestsDone: true
					},
					status: found
				});

				this.ticketsOfUser = null;
				this.listOfTickets = [];
			}
		}
	}

	render() {
		let body, message;
		if (this.state.tab === 1) {
			let warning = this.state.wrong_address ? 'is-invalid' : '';
			body =
				<div className="mt-3">
					<div className="form-group">
						<label htmlFor="address">Adresse Ethereum</label>
						<input type="text" className={"form-control " + warning} id="address" ref={(input) => this.address = input} />
					</div>
					<button className="btn btn-dark" onClick={this.checkManual}><i className="fas fa-receipt"></i> Vérifier la possession</button>
				</div>
			;
		} else if (this.state.tab === 2) {
			body =
				<div className="mt-3">
					<QrReader
						delay={300}
						onScan={this.checkQR}
						onError={() => {return}}
						style={{ width: '100%' }}
					/>
				</div>
			;
		}


		if (this.state.requests.ticketsOfUser || this.state.requests.listOfTickets) {
			message = <div className="alert alert-secondary" role="alert"><i className="fas fa-spinner"></i> Chargement</div>;
		} else if (this.state.requests.requestsDone) {
			if (this.state.status) {
				message = <div className="alert alert-success" role="alert"><i className="fas fa-check-circle"></i> L'utilisateur a ce ticket</div>;
			} else {
				message = <div className="alert alert-danger" role="alert"><i className="fas fa-times"></i> L'utilisateur n'a pas ce ticket</div>;
			}
		}

		return(
			<div>
				<hr className="mt-5" />
				<h3>Vérifier la possession</h3>
				<p>Vérifie si un utilisateur a ce ticket en sa possession</p>
				{message}
				<ul className="nav nav-pills nav-fill nav-justified mt-3">
					<li className="nav-item">
						<a href="" className={"nav-link " + (this.state.tab === 1 ? 'active' : '')} onClick={(e) => this.changeTab(1, e)}>Par adresse</a>
					</li>
					<li className="nav-item">
						<a href="" className={"nav-link " + (this.state.tab === 2 ? 'active' : '')} onClick={(e) => this.changeTab(2, e)}>Par QR code</a>
					</li>
				</ul>
				{body}
			</div>
		);
	}

	componentDidUpdate() {
		this.checkTickets();
	}

	componentDidMount() {
		this.checkTickets();
	}
}

CheckUser.contextTypes = {
    drizzle: PropTypes.object
}

const mapStateToProps = state => {
    return {
		contracts: state.contracts,
		accounts: state.accounts
    };
};

const AppContainer = drizzleConnect(CheckUser, mapStateToProps);
export default AppContainer;
