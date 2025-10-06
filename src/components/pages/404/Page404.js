import './page404.scss';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import { Link } from 'react-router-dom';

const Page404 = () => {
	return (
		<div className="page-404">
			<ErrorMessage />
			<div className="page-404__numbers">
				<span>4</span>
				<span>0</span>
				<span>4</span>
			</div>

			<p className="page-404__text">
				Похоже, ты зашёл не туда. Но не переживай — даже баги бывают красивыми.
			</p>

			<Link to="/" className="page-404__button">
				Вернуться на главную!
			</Link>

			<footer className="page-404__footer">
				© {new Date().getFullYear()} Твоя Вселенная. Ошибки — тоже часть пути 🚀
			</footer>
		</div>
	);
};

export default Page404;
