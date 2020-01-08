import React from 'react';

function Done(props) {
	return (
		<div className="mt-5 text-center">
			<h3 className="mt-5">Chargement terminée, votre événement sera créé après la confirmation de la transaction</h3>
			<code>{props.message}</code>
		</div>
	);
}

export default Done;
