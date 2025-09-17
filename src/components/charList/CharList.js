import './charList.scss';
import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import ErrorWindow from '../../resources/img/error-Window.jpg';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
	state = {
		characters: [],
		loading: true,
		error: false,
		imageErrors: {}, // Объект для отслеживания ошибок загрузки изображений
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChars();
	}

	onCharsLoaded = (chars) => {
		const maxChars = 9;
		const newCharacters = chars.data.results.slice(0, maxChars).map((char) => ({
			id: char.id,
			name: char.name,
			thumbnail:
				char.thumbnail && char.thumbnail.path && char.thumbnail.extension
					? `${char.thumbnail.path}.${char.thumbnail.extension}`
					: ErrorWindow, // Используем ErrorWindow вместо placeholderImage
		}));

		this.setState({
			characters: newCharacters,
			loading: false,
			error: false,
			imageErrors: {}, // Сбрасываем ошибки изображений
		});
	};

	onError = () => {
		this.setState({
			loading: false,
			error: true,
		});
	};

	// Обработчик ошибки загрузки изображения
	onImageError = (id) => {
		this.setState((prevState) => ({
			imageErrors: { ...prevState.imageErrors, [id]: true },
		}));
	};

	updateChars = () => {
		this.setState({ loading: true, error: false, imageErrors: {} });

		this.marvelService
			.getAllCharacters()
			.then((res) => {
				if (!res.data.results || res.data.results.length === 0) {
					console.error('No character data found');
					this.setState({ loading: false, error: true });
					return;
				}
				this.onCharsLoaded(res);
			})
			.catch(this.onError);
	};

	onCharSelected = (id) => {
		this.props.onCharSelected(id);
	};

	render() {
		const { characters, loading, error, imageErrors } = this.state;
		const placeholderImage =
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content =
			!(loading || error) && characters.length > 0 ? (
				<ul className="char__grid">
					{characters.map((char) => {
						// Определяем источник изображения
						const imgSrc =
							char.thumbnail === placeholderImage ||
							char.thumbnail.includes('image_not_available') ||
							imageErrors[char.id]
								? ErrorWindow
								: char.thumbnail;

						// Устанавливаем стиль
						const imgStyle =
							imgSrc === ErrorWindow
								? { objectFit: 'contain' }
								: { objectFit: 'cover' };

						return (
							<li
								key={char.id}
								className={`char__item ${
									this.props.selectedCharId === char.id
										? 'char__item_selected'
										: ''
								}`}
								onClick={() => this.onCharSelected(char.id)}
							>
								<img
									src={imgSrc}
									alt={char.name}
									style={imgStyle}
									onError={() => this.onImageError(char.id)} // Обработчик ошибки
								/>
								<div className="char__name">{char.name}</div>
							</li>
						);
					})}
				</ul>
			) : null;

		return (
			<div className="char__list">
				{errorMessage || spinner || content}
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

export default CharList;
