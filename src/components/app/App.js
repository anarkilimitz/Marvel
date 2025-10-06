import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from '../../components/appHeader/AppHeader';
import MainCharPage from '../pages/MainCharPage';
import ComicsPage from '../pages/ComicsPage';
import Page404 from '../pages/404/Page404';
import SingleComicPage from '../pages/singleComicPage/SingleComicPage';

const App = () => {
	const [selectedChar, setChar] = useState(null);

	const onCharSelected = (id) => {
		setChar(id);
	};

	return (
		<Router>
			<div className="app">
				<AppHeader />
				<main>
					<Routes>
						<Route
							path="/"
							element={
								<MainCharPage
									onCharSelected={onCharSelected}
									selectedChar={selectedChar}
								/>
							}
						/>
						<Route path="/comics" element={<ComicsPage />} />
						<Route path="/comics/:comicId" element={<SingleComicPage />} />
						<Route path="*" element={<Page404 />} />
					</Routes>
				</main>
			</div>
		</Router>
	);
};

export default App;
