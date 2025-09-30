class MarvelService {
	_apiBase = 'https://marvel-server-zeta.vercel.app/';
	_apiKey = 'apikey=d4eecb0c66dedbfae4eab45d312fc1df';
	_baseOffset = 0;

	getResource = async (url) => {
		let res = await fetch(url);
		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}
		return await res.json();
	};

	// Добавляем параметры по умолчанию
	getAllCharacters = (offset = this._baseOffset, limit = 3) => {
		return this.getResource(
			`${this._apiBase}characters?offset=${offset}&limit=${limit}&${this._apiKey}`
		);
	};

	getCharacter = (id) => {
		return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
	};
}

export default MarvelService;
