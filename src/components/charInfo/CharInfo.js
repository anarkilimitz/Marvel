import './charInfo.scss';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ErrorWindow from '../../resources/img/error-Window.jpg';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import useMarvelService from '../../services/MarvelService';

const CharInfo = (props) => {
	const { charId } = props; // Деструктуризируем props
	const [char, setChar] = useState();

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [charId]); // charId в зависимостях - эффект выполнится при изменении charId

	const updateChar = () => {
		if (!charId) {
			return;
		}
		clearError();
		getCharacter(charId).then(onCharLoaded);
	};

	const onCharLoaded = (response) => {
		const charData = response.data.results[0];
		if (!charData) {
			return;
		}
		const thumbnail =
			charData.thumbnail?.path && charData.thumbnail?.extension
				? `${charData.thumbnail.path}.${charData.thumbnail.extension}`
				: null;

		setChar({
			id: charData.id,
			name: charData.name,
			description: charData.description || 'Описание отсутствует',
			thumbnail,
			homepage: charData.urls[0]?.url || '#',
			wiki: charData.urls[1]?.url || '#',
			comics: charData.comics.items || [],
		});
	};

	const skeleton = char || loading || error ? null : <Skeleton />;
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Spinner />
		</div>
	) : null;
	const content = !(loading || error || !char) ? <View char={char} /> : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	);
};

const View = ({ char }) => {
	const { name, description, homepage, wiki, comics, thumbnail } = char;
	const fallbackImage =
		'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

	// Определяем источник изображения
	const imgSrc =
		thumbnail && !thumbnail.includes('image_not_available')
			? thumbnail
			: fallbackImage;

	// Устанавливаем стиль для изображения
	const imgStyle =
		imgSrc === fallbackImage
			? { objectFit: 'contain' }
			: { objectFit: 'cover' };

	return (
		<>
			<div className="char__basics">
				<img
					src={imgSrc}
					alt={name}
					style={imgStyle}
					onError={(e) => {
						e.target.src = fallbackImage; // Сначала пробуем fallbackImage
						e.target.style.objectFit = 'contain';
						e.target.onerror = () => {
							e.target.src = ErrorWindow; // Если и fallbackImage не загрузился, используем ErrorWindow
							e.target.style.objectFit = 'contain';
						};
					}}
				/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a
							href={homepage}
							target="_blank"
							rel="noreferrer"
							className="button button__main"
						>
							<div className="inner">Персонаж</div>
						</a>
						<a
							href={wiki}
							target="_blank"
							rel="noreferrer"
							className="button button__secondary"
						>
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{Array.isArray(comics) && comics.length > 0 ? (
					comics.slice(0, 5).map((item, i) => (
						<li key={i} className="char__comics-item">
							{item}
						</li>
					))
				) : (
					<li className="char__comics-item">Комиксы не найдены</li>
				)}
			</ul>
		</>
	);
};
// Валидация, что charId - это число, а не строка, например
CharInfo.propTypes = {
	charId: PropTypes.number,
};

export default CharInfo;
