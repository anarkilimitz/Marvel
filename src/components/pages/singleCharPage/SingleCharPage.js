import './singleCharPage.scss';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AppBanner from '../../appBanner/AppBanner';
import useMarvelService from '../../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';

const SingleCharPage = () => {
	const { charName } = useParams();
	const [char, setChar] = useState(null);
	const { loading, error, getCharName, clearError } = useMarvelService();

	useEffect(() => {
		updateChar();
	}, [charName]);

	const updateChar = () => {
		if (!charName) return;
		clearError();
		getCharName(charName)
			.then((res) => {
				onCharLoaded(res);
			})
			.catch(() => setChar(null));
	};

	const onCharLoaded = (response) => {
		const charData = response.data.results[0];
		if (!charData) {
			setChar(null);
			return;
		}

		setChar({
			id: charData.id,
			name: charData.name,
			description: charData.description || 'Описание отсутствует',
			thumbnail:
				charData.thumbnail?.path && charData.thumbnail?.extension
					? `${charData.thumbnail.path}.${charData.thumbnail.extension}`
					: null,
			urls: charData.urls?.map((u) => u.url) || [],
			comics: charData.comics?.items || [],
		});
	};

	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<Spinner />
		</div>
	) : null;
	const content = !(loading || error || !char) ? <View char={char} /> : null;

	return (
		<>
			<AppBanner />
			<div className="char__info">
				{errorMessage}
				{spinner}
				{content}
			</div>
		</>
	);
};

const View = ({ char }) => {
	const { name, description, thumbnail, urls, comics } = char;

	return (
		<div className="single-char">
			{thumbnail ? (
				<img src={thumbnail} alt={name} className="single-char__img" />
			) : (
				<div className="single-char__img-placeholder">Нет изображения</div>
			)}
			<div className="single-char__info">
				<h2 className="single-char__name">{name}</h2>
				<p className="single-char__descr">{description}</p>

				{comics?.length > 0 && (
					<div className="single-char__comics">
						<h3>Комиксы:</h3>
						<ul>
							{comics.map((comic, i) => (
								<li key={i}>{comic}</li>
							))}
						</ul>
					</div>
				)}

				{urls?.length > 0 && (
					<div className="single-char__links">
						<h3>Ссылки:</h3>
						<ul>
							{urls.map((url, i) => (
								<li key={i}>
									<a href={url} target="_blank" rel="noreferrer">
										{url}
									</a>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>

			<Link to="/" className="single-char__back">
				На главную
			</Link>
		</div>
	);
};

export default SingleCharPage;
