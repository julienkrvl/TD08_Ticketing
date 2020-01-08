import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import makeBlockie from 'ethereum-blockies-base64';

class Sidebar extends Component {
	render() {
		let user =
			<div>
				<div className="user-status-icon">
					<i className="fas fa-plug"></i>
				</div>
				<p className="mt-3 small">Le réseau Ethereum n'est pas connecté</p>
			</div>
		;

		if (this.props.connection === true) {
			user =
				<div>
				</div>
			;
		}

		return (
			<div id="sidebar-wrapper" className="my-sidebar text-center">
				<div className="user-status mt-5">
					{user}
				</div>
				<div className="menu mt-5">
					<h5>Je veux acheter un ticket</h5>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link to="/findevents/1" className="nav-link">Trouver un événement</Link>
						</li>
						<li className="nav-item">
							<Link to="/mytickets/1" className="nav-link">Mes tickets</Link>
						</li>
					</ul>
					<h5 className="mt-5">Je veux créer un événement</h5>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link to="/createevent" className="nav-link">Créer un événement</Link>
						</li>
						<li className="nav-item">
							<Link to="/myevents/1" className="nav-link">Mes événement</Link>
						</li>
					</ul>
					<h5 className="mt-5">Outils</h5>
					<ul className="nav flex-column">
						<li className="nav-item">
							<Link to="/token" className="nav-link">Obtenir des tokens USD</Link>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default Sidebar;
