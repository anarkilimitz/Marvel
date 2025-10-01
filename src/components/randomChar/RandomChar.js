import { useState, useEffect } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorWindow from '../../resources/img/error-Window.jpg';
import useMarvelService from '../../services/MarvelService';

const RandomChar = () => {
	const [id, setId] = useState(null);
	const [name, setName] = useState(null);
	const [description, setDescription] = useState(null);
	const [thumbnail, setThumbnail] = useState(null);
	const [homepage, setHomepage] = useState(null);
	const [wiki, setWiki] = useState(null);
	const [imageError, setImageError] = useState(false); // Новый флаг для ошибки загрузки изображения

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => {
		updateChar();
		// const timerId = setInterval(() => {
		// 	updateChar();
		// }, [5000000]);

		// // Функция очистки - выполняется при размонтировании
		// return () => {
		// 	clearInterval(timerId);
		// };
	}, []); // Пустой массив зависимостей = только при монтировании/размонтировании

	const updateChar = () => {
		clearError(); // очистка ошибки если по ID не оказалось персонажа, но он мог переключиться
		setImageError((imageError) => false);

		const id = Math.floor(Math.random() * (20 - 1) + 1); // Случайный ID от 1 до 20

		getCharacter(id)
			.then((res) => {
				const character = res.data.results[0];
				if (!character) {
					console.error('No character data found');
					return;
				}

				const maxDescriptionLength = 92;
				const trimmedDescription = character.description
					? character.description.length > maxDescriptionLength
						? character.description.slice(0, maxDescriptionLength) + '...'
						: character.description
					: 'База данных пуста';

				setName(character.name);
				setDescription(trimmedDescription);
				setThumbnail(
					`${character.thumbnail.path}.${character.thumbnail.extension}`
				);
				setHomepage(character.urls[0]?.url || '#');
				setWiki(character.urls[1]?.url || '#');
				setImageError((imageError) => false);
			})
			.catch(() => {
				setImageError((imageError) => false);
			});
	};

	// Обработчик ошибки загрузки изображения
	const onImageError = () => {
		setImageError((imageError) => true);
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;

	// Определяем источник изображения
	const imgSrc =
		!thumbnail ||
		thumbnail ===
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ||
		imageError
			? ErrorWindow
			: thumbnail;

	// Устанавливаем стиль для изображения
	let imgStyle = { objectFit: 'cover' };
	if (imgSrc === ErrorWindow) {
		imgStyle = { objectFit: 'contain' };
	}

	const content =
		!(loading || error) && name && thumbnail ? (
			<>
				<img
					src={imgSrc}
					alt="Random character"
					className="randomchar__img"
					style={imgStyle}
					onError={onImageError} // Добавляем обработчик ошибки
				/>
				<div className="randomchar__info">
					<p className="randomchar__name">{name}</p>
					<p className="randomchar__descr">{description}</p>
					<div className="randomchar__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</>
		) : null;

	const leftBlockContent = errorMessage || spinner || content;

	return (
		<div className="randomchar">
			<div className="randomchar__block">{leftBlockContent}</div>
			<div className="randomchar__static">
				<p className="randomchar__title">
					Random character for today!
					<br />
					Do you want to get to know him better?
				</p>
				<p className="randomchar__title">Or choose another one</p>
				<button onClick={updateChar} className="button button__main">
					<div className="inner">try it</div>
				</button>
				<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
			</div>
		</div>
	);
};

export default RandomChar;
