import React from 'react';

function Loader(props) {
	return (
		<div className="mt-5">
			<p className="text-center">Un instant, nous sommes en train de traiter les données.</p>
			<div className="progress" style={{height: 25 + 'px'}}>
				<div
					className="progress-bar progress-bar-striped progress-bar-animated"
					role="progressbar"
					aria-valuenow={props.progress}
					aria-valuemin="0"
					aria-valuemax="100"
					style={{width: props.progress + '%'}}
				>{props.text}</div>
			</div>
		</div>
	);
}

export default Loader;
