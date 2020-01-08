import React from 'react';

function LoadingApp() {
	return (
		<div className="mt-5 text-center">
			<h3 className="mt-5">Chargement de l'application</h3>
			<p className="emoji"><span role="img" aria-label="hourglass">⌛</span></p>
			<p>Soyez sûr d'être connecté au réseau Etherum via votre navigateur et d'être connecté sur le réseau : <b>LocalHost (8545)</b>.</p>
		</div>
	);
}

export default LoadingApp;
