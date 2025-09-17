import { Component } from 'react';
import './charInfo.scss';
import ErrorWindow from '../../resources/img/error-Window.jpg';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {
	state = {
		id: null,
		char: null,
		name: null,
		description: null,
		homepage: null,
		wiki: null,
		comics: null,
		loading: false,
		error: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentDidUpdate(prevProps) {
		if (this.props.charId !== prevProps.charId) {
			this.updateChar();
		}
	}

	updateChar = () => {
		const { charId } = this.props;
		if (!charId) {
			return;
		}

		this.marvelService
			.getCharacter(charId) // когда придет ответ от сервиса с id персонажа
			.then(this.onCharLoaded) // он попадет в onCharloaded
			.catch(this.onError);
	};

	onCharLoaded = (char) => {
		this.setState({
			char, // и запишется сюда в state
			loading: false,
			error: false,
		});
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true,
		});
	};

	render() {
		const { char, loading, error } = this.state;

		const skeleton = char || loading || error ? null : <Skeleton />;
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error || !char) ? <View char={char} /> : null;
		// Если выполнится хоть одно условие выше, то оно и загрузится ниже
		return (
			<div className="char__info">
				{skeleton}
				{errorMessage}
				{spinner}
				{content}
			</div>
		);
	}
}

const View = ({ char }) => {
	const { name, description, homepage, wiki, comics } = char;

	// Определяем источник изображения
	const imgSrc = ErrorWindow;
	// Устанавливаем стиль для изображения
	let imgStyle = { objectFit: 'cover' };
	if (imgSrc === ErrorWindow) {
		imgStyle = { objectFit: 'contain' };
	}

	return (
		<>
			<div className="char__basics">
				<img src={imgSrc} alt={name} style={imgStyle} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
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
							{item.name}
						</li>
					))
				) : (
					<li className="char__comics-item">Комиксы не загрузились из БД</li>
				)}
			</ul>
		</>
	);
};

export default CharInfo;
