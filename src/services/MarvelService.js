import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
	const { loading, request, error, clearError } = useHttp();

	const _apiBase = 'https://marvel-server-zeta.vercel.app/';
	const _apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
	const _baseOffset = 0;

	// Добавляем параметры по умолчанию
	const getAllCharacters = (offset = _baseOffset, limit = 3) => {
		return request(
			`${_apiBase}characters?offset=${offset}&limit=${limit}&${_apiKey}`
		);
	};

	const getCharacter = (id) => {
		return request(`${_apiBase}characters/${id}?${_apiKey}`);
	};

	return { loading, error, clearError, getAllCharacters, getCharacter };
};

export default useMarvelService;
