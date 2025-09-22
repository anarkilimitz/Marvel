import './charList.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 3,
		charEnded: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}
	// метод отвечает за запрос на сервер, вызывается по клику на кнопку load more
	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
		});
	};

	onCharListLoaded = (newCharList) => {
		const formattedCharList = newCharList.data.results.map((char) => ({
			id: char.id,
			name: char.name,
			thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
		}));

		let ended = false;
		if (formattedCharList.length < 3) {
			ended = true;
		}

		this.setState(({ offset, charList }) => ({
			charList: [...charList, ...formattedCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 1,
			charEnded: ended,
		}));
	};

	onError = () => {
		this.setState({
			error: true,
			loading: false,
		});
	};

	itemRefs = [];

	setRef = (ref) => {
		this.itemRefs.push(ref);
	};

	focusOnItem = (id) => {
		this.itemRefs.forEach((item, index) => {
			if (index === id) {
				item.classList.add('char__item_selected');
				item.focus();
			} else {
				item.classList.remove('char__item_selected');
			}
		});
	};

	renderItems(arr) {
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
					key={item.id}
					ref={this.setRef} // Добавьте ref
					tabIndex={0} // Для доступности клавиатуры
					role="button" // Для доступности
					aria-label={`Выбрать персонажа ${item.name}`} // Для скринридеров
					onClick={() => {
						this.props.onCharSelected(item.id);
						this.focusOnItem(i); // Теперь i доступен
					}}
					onKeyDown={(e) => {
						if (e.key === ' ' || e.key === 'Enter') {
							this.props.onCharSelected(item.id);
							this.focusOnItem(i);
						}
					}}
				>
					<img
						src={item.thumbnail}
						alt={item.name}
						style={imgStyle}
						onError={(e) => {
							e.target.src = placeholderImage; // Подставляем заглушку при ошибке загрузки
							e.target.style.objectFit = 'unset'; // Устанавливаем стиль для заглушки
						}}
					/>
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return <ul className="char__grid">{items}</ul>;
	}

	render() {
		const { charList, loading, error, offset, newItemLoading, charEnded } =
			this.state;

		const items = this.renderItems(charList);

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
					disabled={newItemLoading}
					style={{ display: charEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

// Валидация, что это функция - onCharSelected
CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
