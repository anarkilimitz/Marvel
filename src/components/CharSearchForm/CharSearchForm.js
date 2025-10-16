import './charSearchForm.scss';
import { useState } from 'react';
import {
	Formik,
	Form,
	useField,
	ErrorMessage as FormikErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

// import useMarvelService from '../../../services/MarvelService';
// import ErrorMessage from '../../errorMessage/ErrorMessage';

const MyTextInput = ({ label, as, ...props }) => {
	const [field, meta] = useField(props);
	const Component = as || 'input';
	return (
		<>
			<label htmlFor={props.name} className="label">
				{label}
			</label>
			<Component {...field} {...props} className={props.className || 'input'} />
			{meta.touched && meta.error ? (
				<div className="error">{meta.error}</div>
			) : null}
		</>
	);
};

const CharSearchForm = () => {
	return (
		<Formik
			initialValues={{
				name: '',
			}}
			validationSchema={Yup.object({
				name: Yup.string()
					.min(2, 'Введите не менее 2 символов')
					.required('Введите имя персонажа'),
			})}
		>
			<div className="char__search-form">
				<Form className="char__form">
					<MyTextInput
						label="Найти персонажа по имени:"
						id="name"
						name="name"
						type="text"
						placeholder="Введите имя персонажа"
					/>
				</Form>
				<div className="char__btn-wrapper">
					<button className="button button__main" type="submit">
						<div className="inner">Найти</div>
					</button>
				</div>
			</div>
		</Formik>
	);
};

export default CharSearchForm;
