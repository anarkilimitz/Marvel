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
	const [offset, setOffset] = useState(3);
	const [charEnded, setCharEnded] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		onRequest();
	}, []); // функция выполнится только 1 раз т.к массив пустой

	// метод отвечает за запрос на сервер, вызывается по клику на кнопку load more
	const onRequest = (offset) => {
		onCharListLoading();
		marvelService
			.getAllCharacters(offset)
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

		let ended = false;
		if (formattedCharList.length < 3) {
			ended = true;
		}

		setCharList((charList) => [...charList, ...formattedCharList]);
		setLoading((loading) => false);
		setNewItemLoading((newItemLoading) => false);
		setOffset((offset) => offset + 1);
		setCharEnded((charEnded) => ended);
	};

	const onError = () => {
		setError((error) => true);
		setLoading((loading) => false);
	};

	const itemRefs = useRef([]);

	// метод для перебора и сравнения карточек для добавления тени
	const focusOnItem = (id) => {
		if (id >= 0 && id < itemRefs.current.length) {
			itemRefs.current.forEach((item, index) => {
				if (item && item.current) {
					if (index === id) {
						item.current.classList.add('char__item_selected');
						item.current.focus();
					} else {
						item.current.classList.remove('char__item_selected');
					}
				}
			});
		}
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
					key={item.id}
					ref={(el) => (itemRefs.current[i] = el)}
					tabIndex={0} // Для доступности клавиатуры
					role="button" // Для доступности
					aria-label={`Выбрать персонажа ${item.name}`} // Для скринридеров
					onClick={() => {
						props.onCharSelected(item.id);
						focusOnItem(i); // Теперь i доступен
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
							e.target.src = placeholderImage; // Подставляем заглушку при ошибке загрузки
							e.target.style.objectFit = 'unset'; // Устанавливаем стиль для заглушки
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
				disabled={newItemLoading}
				style={{ display: charEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};

// Валидация, что это функция - onCharSelected
CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
