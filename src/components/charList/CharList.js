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
	const [offset, setOffset] = useState(0);
	const [charEnded, setCharEnded] = useState(false);

	const marvelServiceRef = useRef(new MarvelService());
	const isMountedRef = useRef(false); // ✅ Добавляем флаг монтирования

	useEffect(() => {
		// ✅ Предотвращаем двойной вызов в Strict Mode
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			onRequest(0, 3);
		}
	}, []);

	const onRequest = (offset, limit = 3) => {
		onCharListLoading();
		marvelServiceRef.current
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

		setCharList((prevCharList) => {
			// ✅ Фильтруем дубликаты относительно ПРЕДЫДУЩЕГО состояния
			const uniqueCharList = formattedCharList.filter(
				(newChar) =>
					!prevCharList.some((existingChar) => existingChar.id === newChar.id)
			);

			const updatedList = [...prevCharList, ...uniqueCharList];
			const limitedList = updatedList.slice(0, 20);

			// ✅ Обновляем charEnded синхронно с новым состоянием
			setCharEnded(limitedList.length >= 20);

			return limitedList;
		});

		setLoading(false);
		setNewItemLoading(false);
		setOffset((prevOffset) => prevOffset + 3);
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
					key={item.id} // ✅ Используем только id, без индекса
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
