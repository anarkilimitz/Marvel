import './singleComicPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppBanner from '../../appBanner/AppBanner';
import useMarvelService from '../../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';

const SingleComicPage = () => {
	const { comicId } = useParams();
	const [comic, setComic] = useState(null);
	const { loading, error, getComic, clearError } = useMarvelService();

	useEffect(() => {
		updateComic();
	}, [comicId]);

	const updateComic = () => {
		if (!comicId) return;
		clearError();
		getComic(comicId)
			.then(onComicLoaded)
			.catch(() => setComic(null));
	};

	const onComicLoaded = (response) => {
		console.log('Полученные данные:', response); 
		const comicData = response.data.results[0];
		console.log('Данные комикса:', comicData);
		if (!comicData) {
			setComic(null);
			return;
		}

		setComic({
			id: comicData.id,
			title: comicData.title,
			description: comicData.description || 'Описание отсутствует',
			thumbnail:
				comicData.thumbnail?.path && comicData.thumbnail?.extension
					? `${comicData.thumbnail.path}.${comicData.thumbnail.extension}`
					: null,
			pageCount: comicData.pageCount
				? `${comicData.pageCount} страниц`
				: 'Нет данных о количестве страниц',
			languages: comicData.textObjects?.languages || 'Не указан',
			price: comicData.prices?.[0]?.price
				? `${comicData.prices[0].price}$`
				: 'Цена не указана',
		});
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Spinner />
		</div>
	) : null;
	const content = !(loading || error || !comic) ? <View comic={comic} /> : null;

	return (
		<>
			<AppBanner />
			<div className="comic__info">
				{errorMessage}
				{spinner}
				{content}
			</div>
		</>
	);
};

const View = ({ comic }) => {
	const { title, description, pageCount, thumbnail, languages, price } = comic;

	return (
		<div className="single-comic">
			{thumbnail ? (
				<img src={thumbnail} alt={title} className="single-comic__img" />
			) : (
				<div className="single-comic__img-placeholder">Нет изображения</div>
			)}
			<div className="single-comic__info">
				<h2 className="single-comic__name">{title}</h2>
				<p className="single-comic__descr">{description}</p>
				<p className="single-comic__descr">{pageCount}</p>
				<p className="single-comic__descr">Язык: {languages}</p>
				<div className="single-comic__price">{price}</div>
			</div>
			<Link to="/comics" className="single-comic__back">
				Назад к комиксам
			</Link>
		</div>
	);
};

export default SingleComicPage;
