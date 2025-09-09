import { Component } from 'react';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/MarvelService';

class RandomChar extends Component {
	state = {
		name: null,
		description: null,
		thumbnail: null,
		homepage: null,
		wiki: null,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
	}

	updateChar = () => {
		const id = Math.floor(Math.random() * (20 - 1) + 1);
		this.marvelService
			.getCharacter(id)
			.then((res) => {
				const character = res.data.results[0];
				if (!character) {
					console.error('No character data found');
					return;
				}
				// Начало изменений: обработка описания
				const maxDescriptionLength = 92; // Максимальная длина описания 92 символа
				const trimmedDescription = res.data.results[0].description
					? res.data.results[0].description.length > maxDescriptionLength
						? res.data.results[0].description.slice(0, maxDescriptionLength) +
						  '...' // Обрезаем до 92 символов и добавляем многоточие
						: res.data.results[0].description
					: 'База данных пуста'; // Если описание отсутствует, возвращаем сообщение

				this.setState({
					name: res.data.results[0].name,
					description: trimmedDescription, // Используем обработанное описание
					thumbnail:
						res.data.results[0].thumbnail.path +
						'.' +
						res.data.results[0].thumbnail.extension,
					homepage: res.data.results[0].urls[0].url,
					wiki: res.data.results[0].urls[1].url,
				});
			})
			.catch((error) => {
				console.error('Error fetching character:', error);
			});
	};

	render() {
		const { name, description, thumbnail, homepage, wiki } = this.state;

		if (!name || !thumbnail) {
			return <div>Loading...</div>;
		}

		return (
			<div className="randomchar">
				<div className="randomchar__block">
					<img
						src={thumbnail}
						alt="Random character"
						className="randomchar__img"
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
				</div>
				<div className="randomchar__static">
					<p className="randomchar__title">
						Random character for today!
						<br />
						Do you want to get to know him better?
					</p>
					<p className="randomchar__title">Or choose another one</p>
					<button className="button button__main">
						<div className="inner">try it</div>
					</button>
					<img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
				</div>
			</div>
		);
	}
}

export default RandomChar;
