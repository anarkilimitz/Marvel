import { lazy, Suspense } from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AppHeader from '../../components/appHeader/AppHeader';
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../pages/404/Page404'));
const MainCharPage = lazy(() => import('../pages/MainCharPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicPage = lazy(() =>
	import('../pages/singleComicPage/SingleComicPage')
);
const SingleCharPage = lazy(() =>
	import('../pages/singleCharPage/SingleCharPage')
);

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
					<Suspense fallback={<Spinner />}>
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
							<Route path="/characters/:charName" element={<SingleCharPage />} />
							<Route path="*" element={<Page404 />} />
						</Routes>
					</Suspense>
				</main>
			</div>
		</Router>
	);
};

export default App;
