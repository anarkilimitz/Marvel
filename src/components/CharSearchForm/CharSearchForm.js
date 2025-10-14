import './charSearchForm.scss';
// import { useState } from 'react';
// import {
// 	Formik,
// 	Form,
// 	Field,
// 	ErrorMessage as FormikErrorMessage,
// } from 'formik';
// import * as Yup from 'yup';
// import { Link } from 'react-router-dom';

// import useMarvelService from '../../../services/MarvelService';
// import ErrorMessage from '../../errorMessage/ErrorMessage';

const CharSearchForm = () => {
	return (
		<div className="char__search-form">
			<form className="char__form">
				<label htmlFor="name">Or find a character by name:</label>
				<input
					id="name"
					name="name"
					type="text"
					placeholder="Enter the characters name"
				/>
			</form>
			<div className="char__btn-wrapper">
				<button className="button button__main">
					<div className="inner">Find</div>
				</button>
			</div>
		</div>
	);
};

export default CharSearchForm;
