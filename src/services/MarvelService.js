import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();

	const _apiBase = 'https://marvel-server-zeta.vercel.app/';
	const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
	const _baseOffset = 0;

	const getAllCharacters = (offset = _baseOffset, limit = 3) => {
		return request(
			`${_apiBase}characters?offset=${offset}&limit=${limit}&${_apiKey}`
		);
	};

	const getCharacter = (id) => {
		return request(`${_apiBase}characters/${id}?${_apiKey}`);
	};

	const getAllComics = (offset = _baseOffset, limit = 4) => {
		return request(
			`${_apiBase}comics?offset=${offset}&limit=${limit}&${_apiKey}`
		);
	};

	const getComic = (id) => {
		return request(`${_apiBase}comics/${id}?${_apiKey}`);
	};

	return {
		loading,
		error,
		clearError,
		getAllCharacters,
		getCharacter,
		getAllComics,
		getComic
	};
};

export default useMarvelService;
