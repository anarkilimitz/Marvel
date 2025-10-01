import { useState, useCallback } from 'react';

export const useHttp = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const request = useCallback(
		async (
			url,
			method = 'GET',
			body = null,
			headers = {} // Пустой объект заголовков
		) => {
			setLoading(true);

			try {
				const response = await fetch(url, { method, body, headers }); // запрашиваем с сервера
				if (!response.ok) {
					throw new Error(`Could not fetch ${url}, status: ${response.status}`);
				} // если не OK, переходим в блок CATCH
				const data = await response.json(); // получаем эти данные
				setLoading(false);
				return data; // возвращаем чистые данные от API
			} catch (e) {
				setLoading(false);
				setError(e.message);
				throw e;
			}
		},
		[]
	);

	const clearError = useCallback(() => setError(null), []); // очистка ошибки

	return { loading, request, error, clearError };
};
