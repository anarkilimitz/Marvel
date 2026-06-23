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
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const MyTextInput = ({ label, as, ...props }) => {
	const [field, meta] = useField(props);
	const Component = as || 'input';
	return (
		<>
			<label htmlFor={props.id} className="label">
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
	const [char, setChar] = useState(null);
	const [notFound, setNotFound] = useState(false);
	const { loading, error, getCharName, clearError } = useMarvelService();

	const onCharLoaded = (response) => {
		const charData = response.data.results[0];
		if (!charData) {
			setChar(null);
			setNotFound(true);
			return;
		}
		setChar({
			name: charData.name,
			id: charData.id,
		});
		setNotFound(false);
	};

	const updateChar = (name) => {
		clearError();

		// 2 функции для поиска персов любым спрособом (с заглавной или маленькой или даже без дефиса)
		const formattedName = name
			.trim()
			.toLowerCase()
			.split(/[\s-]+/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		const searchName =
			name.toLowerCase() === 'spider-man' || name.toLowerCase() === 'spider man'
				? 'Spider-Man'
				: formattedName;

		getCharName(searchName)
			.then(onCharLoaded)
			.catch(() => {
				setChar(null);
				setNotFound(true);
			});
	};

	return (
		<Formik
			initialValues={{
				charName: '',
			}}
			validationSchema={Yup.object({
				charName: Yup.string()
					.min(2, 'Введите не менее 2 символов')
					.required('Введите имя персонажа'),
			})}
			onSubmit={({ charName }) => updateChar(charName)}
		>
			{({ values }) => (
				<div className="char__search-form">
					<Form className="char__form">
						<MyTextInput
							label="Найти персонажа по имени:"
							id="charName"
							name="charName"
							type="text"
							placeholder="Введите имя персонажа"
						/>
						<div className="char__btn-wrapper">
							<button
								className="button button__main"
								type="submit"
								disabled={loading}
							>
								<div className="inner">Найти</div>
							</button>
						</div>

						{/* Сообщения о результате поиска */}
						<div style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
							{error && <ErrorMessage />}
							{loading && (
								<div style={{ textAlign: 'center' }}>
									<Spinner />
								</div>
							)}
							{char && !loading && !error && (
								<div className="char__success">
									<p>
										Персонаж{' '}
										<span style={{ fontWeight: 'bold' }}>{char.name}</span>{' '}
										найден!
									</p>
									<Link
										to={`/characters/${char.name}`}
										className="button button__secondary"
										style={{ marginTop: '10px', display: 'inline-block' }}
									>
										<div className="inner">Перейти к странице</div>
									</Link>
								</div>
							)}
							{notFound && !loading && !error && (
								<div className="char__error">
									Персонаж не найден. Проверьте имя!
								</div>
							)}
						</div>
					</Form>
				</div>
			)}
		</Formik>
	);
};

export default CharSearchForm;
