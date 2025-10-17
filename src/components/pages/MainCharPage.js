import RandomChar from '../../components/randomChar/RandomChar';
import CharList from '../../components/charList/CharList';
import CharInfo from '../../components/charInfo/CharInfo';
import CharSearchForm from '../../components/CharSearchForm/CharSearchForm';
import ErrorBoundary from '../../components/errorBoundary/ErrorBoundary';
import decoration from '../../resources/img/vision.png';

const MainCharPage = ({ onCharSelected, selectedChar }) => {
	return (
		<>
			<ErrorBoundary>
				<RandomChar />
			</ErrorBoundary>
			<div className="char__content">
				<ErrorBoundary>
					<CharList onCharSelected={onCharSelected} />
				</ErrorBoundary>
				<div>
					<ErrorBoundary>
						<CharInfo charId={selectedChar} />
					</ErrorBoundary>
					<ErrorBoundary>
						<CharSearchForm />
					</ErrorBoundary>
				</div>
			</div>
			<img className="bg-decoration" src={decoration} alt="vision" />
		</>
	);
};

export default MainCharPage;
