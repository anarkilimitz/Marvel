import './charList.scss';
import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
	state = {
		characters: [],
		loading: true,
		error: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChars(); // Загружаем персонажей при монтировании
	}

	// Обработка успешной загрузки персонажей
	onCharsLoaded = (chars) => {
		const maxChars = 9; // Ограничиваем до 9 персонажей
		const placeholderImage =
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'; // Заглушка
		const newCharacters = chars.data.results
			.slice(0, maxChars) // Берем только первые 9 персонажей
			.map((char) => ({
				id: char.id,
				name: char.name,
				thumbnail:
					char.thumbnail && char.thumbnail.path && char.thumbnail.extension
						? `${char.thumbnail.path}.${char.thumbnail.extension}`
						: placeholderImage, // Используем заглушку, если изображение недоступно
			}));

		this.setState({
			characters: newCharacters,
			loading: false,
			error: false,
		});
	};

	// Обработка ошибки
	onError = () => {
		this.setState({
			loading: false,
			error: true,
		});
	};

	// Метод загрузки персонажей
	updateChars = () => {
		this.setState({ loading: true, error: false }); // Сбрасываем состояние перед запросом

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

	// Обработка клика по персонажу
	onCharSelected = (id) => {
		this.props.onCharSelected(id); // Передаем id в родительский компонент
	};

	render() {
		const { characters, loading, error } = this.state;
		const placeholderImage =
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

		// Условный рендеринг
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content =
			!(loading || error) && characters.length > 0 ? (
				<ul className="char__grid">
					{characters.map((char) => (
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
								src={char.thumbnail}
								alt={char.name}
								style={
									char.thumbnail === placeholderImage ||
									char.thumbnail.includes('image_not_available')
										? { objectFit: 'contain' }
										: { objectFit: 'cover' }
								}
							/>
							<div className="char__name">{char.name}</div>
						</li>
					))}
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
