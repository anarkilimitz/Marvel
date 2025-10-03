import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from '../../components/appHeader/AppHeader';
import MainCharPage from '../pages/MainCharPage';
import ComicsPage from '../pages/ComicsPage';

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
					</Routes>
				</main>
			</div>
		</Router>
	);
};

export default App;
