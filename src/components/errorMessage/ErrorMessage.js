import img from './error.gif';

const ErrorMessage = () => {
	return (
		<img
			className="error-message"
			style={{
				display: 'block',
				width: '130px',
				height: '130px',
				objectFit: 'contain',
				margin: '0 auto',
			}}
			src={img}
			alt="Error"
		/>
	);
};

export default ErrorMessage;
