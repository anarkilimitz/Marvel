import { Component } from 'react';
import './randomChar.scss';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import mjolnir from '../../resources/img/mjolnir.png';
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
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar(); // вызываем при монтировании
		// this.timerId = setInterval(this.updateChar, 4000); // можно автообновление каждые 5 сек
	}

	componentWillUnmount() {
		// clearInterval(this.timerId); // 💡 правильнее очищать конкретный id, а не 'unmount'
	}

	// обработка успешной загрузки персонажа
	onCharLoaded = (char) => {
		this.setState({
			...char, // загружаем данные персонажа в state
			loading: false,
			error: false,
		});
	};

	// обработка ошибки
	onError = () => {
		this.setState({
			loading: false,
			error: true,
		});
	};

	updateChar = () => {
		this.setState({ loading: true, error: false }); // Сбрасываем loading и error перед запросом
		const id = Math.floor(Math.random() * (20 - 1) + 1); // 💡 получаем случайного персонажа с id 1–20

		this.marvelService
			.getCharacter(id)
			.then((res) => {
				const character = res.data.results[0];
				if (!character) {
					console.error('No character data found');
					this.setState({ loading: false, error: true }); // Устанавливаем error: true, если данные не получены
					return;
				}

				// 💡 обрезаем описание, если оно слишком длинное
				const maxDescriptionLength = 92;
				const trimmedDescription = character.description
					? character.description.length > maxDescriptionLength
						? character.description.slice(0, maxDescriptionLength) + '...'
						: character.description
					: 'База данных пуста';

				// обновляем state
				this.setState({
					name: character.name,
					description: trimmedDescription,
					thumbnail: `${character.thumbnail.path}.${character.thumbnail.extension}`,
					homepage: character.urls[0].url,
					wiki: character.urls[1].url,
					loading: false,
					error: false, // Успешная загрузка, сбрасываем error
				});
			})
			.catch(this.onError); // 💡 используем вынесенный обработчик ошибок
	};

	render() {
		const { name, description, thumbnail, homepage, wiki, loading, error } =
			this.state;

		// Определяем переменные для условного рендеринга
		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		// 💡 стиль картинки по умолчанию
		let imgStyle = { objectFit: 'cover' };
		if (
			thumbnail ===
			'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
		) {
			imgStyle = { objectFit: 'contain' };
		}

		// Изменение: Исправляем синтаксис для content, используя тернарный оператор
		const content =
			!(loading || error) && name && thumbnail ? (
				<>
					<img
						src={thumbnail}
						alt="Random character"
						className="randomchar__img"
						style={imgStyle}
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

		// Выбираем одно из состояний для левой части
		const leftBlockContent = errorMessage || spinner || content;

		return (
			<div className="randomchar">
				<div className="randomchar__block">{leftBlockContent}</div>
				{/* Блок randomchar__static рендерится всегда, независимо от loading или error */}
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!
						<br />
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">Or choose another one</p>
					{/* 💡 теперь кнопка вызывает updateChar */}
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
