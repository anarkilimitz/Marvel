import { Component } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
import ErrorWindow from '../../resources/img/error-Window.jpg';
import MarvelService from '../../services/MarvelService';

class RandomChar extends Component {
	state = {
		id: null,
		name: null,
		description: null,
		thumbnail: null,
		homepage: null,
		wiki: null,
		loading: true,
		error: false,
		imageError: false, // Новый флаг для ошибки загрузки изображения
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	componentWillUnmount() {
		// clearInterval(this.timerId); // Раскомментируйте, если используете setInterval
	}

	updateChar = () => {
		this.setState({ loading: true, error: false, imageError: false }); // Сбрасываем все флаги
		const id = Math.floor(Math.random() * (20 - 1) + 1); // Случайный ID от 1 до 20

		this.marvelService
			.getCharacter(id)
			.then((res) => {
				const character = res.data.results[0];
				if (!character) {
					console.error('No character data found');
					this.setState({ loading: false, error: true });
					return;
				}

				const maxDescriptionLength = 92;
				const trimmedDescription = character.description
					? character.description.length > maxDescriptionLength
						? character.description.slice(0, maxDescriptionLength) + '...'
						: character.description
					: 'База данных пуста';

				this.setState({
					name: character.name,
					description: trimmedDescription,
					thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
					homepage: character.urls[0]?.url || '#',
					wiki: character.urls[1]?.url || '#',
					loading: false,
					error: false,
					imageError: false,
				});
			})
			.catch(() => {
				console.error('Error fetching character');
				this.setState({ loading: false, error: true, imageError: false });
			});
	};

	// Обработчик ошибки загрузки изображения
	onImageError = () => {
		this.setState({ imageError: true });
	};

	render() {
		const {
			name,
			description,
			thumbnail,
			homepage,
			wiki,
			loading,
			error,
			imageError,
		} = this.state;

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
						onError={this.onImageError} // Добавляем обработчик ошибки
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
					<button onClick={this.updateChar} className="button button__main">
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
				</div>
			</div>
		);
	}
}

export default RandomChar;
