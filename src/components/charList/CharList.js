import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(9); // Начинаем с 9, так как изначально загрузили 9 персонажей
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		onRequest(0, 9); // Первоначальная загрузка 9 персонажей
	}, []); // выполнится только один раз, тк массив пустой

	const onRequest = (offset, limit = 3) => {
		onCharListLoading();
		marvelService
			.getAllCharacters(offset, limit)
			.then(onCharListLoaded)
			.catch(onError);
	};

	const onCharListLoading = () => {
		setNewItemLoading(true);
	};

	const onCharListLoaded = (newCharList) => {
		const formattedCharList = newCharList.data.results.map((char) => ({
			id: char.id,
			name: char.name,
			thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
		}));

		// Убираем дубликаты по ID
		const uniqueCharList = formattedCharList.filter(
			(newChar) =>
				!charList.some((existingChar) => existingChar.id === newChar.id)
		);

		// Проверяем, достигли ли мы лимита в 20 персонажей
		const totalCharacters = charList.length + uniqueCharList.length;
		let ended = totalCharacters >= 20;

		setCharList((prevCharList) => {
			const updatedList = [...prevCharList, ...uniqueCharList];
			// Ограничиваем список 20 персонажами
			return updatedList.slice(0, 20);
		});
		setLoading(false);
		setNewItemLoading(false);
		setOffset((prevOffset) => prevOffset + 3);
		setCharEnded(ended);
	};

	const onError = () => {
		setError(true);
		setLoading(false);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item, index) => {
			if (item) {
				if (index === id) {
					item.classList.add('char__item_selected');
					item.focus();
				} else {
					item.classList.remove('char__item_selected');
				}
			}
		});
	};

	function renderItems(arr) {
		const placeholderImage =
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (item.thumbnail === placeholderImage) {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					className="char__item"
					key={`${item.id}-${i}`} // Добавляем индекс к ключу для уникальности
					ref={(el) => (itemRefs.current[i] = el)}
					tabIndex={0}
					role="button"
					aria-label={`Выбрать персонажа ${item.name}`}
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i);
					}}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							props.onCharSelected(item.id);
							focusOnItem(i);
						}
					}}
				>
					<img
						src={item.thumbnail}
						alt={item.name}
						style={imgStyle}
						onError={(e) => {
							e.target.src = placeholderImage;
							e.target.style.objectFit = 'unset';
						}}
					/>
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return <ul className="char__grid">{items}</ul>;
	}

	const items = renderItems(charList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error) ? items : null;

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			{content}
			<button
				className="button button__main button__long"
				disabled={newItemLoading || charEnded}
				style={{ display: charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset, 3)}
			>
				<div className="inner">
					{newItemLoading ? 'Loading...' : 'Load more'}
				</div>
			</button>
		</div>
	);
};

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
