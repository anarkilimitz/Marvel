import './comicsList.scss';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(0);
	const [comicsEnded, setComicsEnded] = useState(false);
	const isMountedRef = useRef(false); // ✅ Добавляем флаг монтирования
	const { loading, error, getAllComics } = useMarvelService();

	useEffect(() => {
		// ✅ Предотвращаем двойной вызов в Strict Mode
		if (!isMountedRef.current) {
			isMountedRef.current = true;
			onRequest(0, 4, true);
		}
	}, []);

	const onRequest = (offset, limit = 4, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
		getAllComics(offset, limit).then(onComicsListLoaded);
	};
	// функция для фильтрации дубликатов коммиксов
	const onComicsListLoaded = (newComicsList) => {
		const formattedComicsList = newComicsList.data.results.map((comics) => ({
			id: comics.id,
			title: comics.title,
			thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
			price: `${comics.prices[0].price}$`,
		}));

		setComicsList((prevComicsList) => {
			// ✅ Фильтруем дубликаты относительно ПРЕДЫДУЩЕГО состояния
			const uniqueComicsList = formattedComicsList.filter(
				(newComics) =>
					!prevComicsList.some(
						(existingComics) => existingComics.id === newComics.id
					)
			);

			const updatedList = [...prevComicsList, ...uniqueComicsList];
			const limitedList = updatedList.slice(0, 20);

			// ✅ Обновляем comicsEnded синхронно с новым состоянием
			setComicsEnded(limitedList.length >= 20);

			return limitedList;
		});

		setNewItemLoading(false);
		setOffset((prevOffset) => prevOffset + 4);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item, index) => {
			if (index === id) {
				item.classList.add('comics__item_selected');
				item.focus();
			} else {
				item.classList.remove('comics__item_selected');
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
					className="comics__item"
					key={item.id}
					ref={(el) => (itemRefs.current[i] = el)}
					tabIndex={0}
					role="button"
					aria-label={`Выбрать комикс ${item.title}`}
					onClick={() => {
						focusOnItem(i);
					}}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							focusOnItem(i);
						}
					}}
					onFocus={() => {
						focusOnItem(i);
					}}
				>
					<Link to={`/comics/${item.id}`}>
						<img
							src={item.thumbnail}
							alt={item.title}
							className="comics__item-img"
							style={imgStyle}
							onError={(e) => {
								e.target.src = placeholderImage;
								e.target.style.objectFit = 'unset';
							}}
						/>
					</Link>
					<div className="comics__name">{item.title}</div>
					<div className="comics__item-price">{item.price}</div>
				</li>
			);
		});

		return <ul className="comics__grid">{items}</ul>;
	}

	const items = renderItems(comicsList);

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner =
		loading && !newItemLoading ? (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<Spinner />
			</div>
		) : null;

	return (
		<div className="comics__list">
			{errorMessage}
			{spinner}
			{items}
			<button
				className="button button__main button__long"
				disabled={newItemLoading || comicsEnded}
				style={{ display: comicsEnded ? 'none' : 'block' }}
				onClick={() => onRequest(offset, 4)}
			>
				<div className="inner">
					{newItemLoading ? 'Загрузка...' : 'Загрузить ещё'}
				</div>
			</button>
		</div>
	);
};

export default ComicsList;
