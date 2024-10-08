import useSWR from 'swr';

// @ts-ignore
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('데이터를 조회하지 못했습니다');
  }
  return response.json();
};

// @ts-ignore
const useFetch = (url) => {
  const { data, error } = useSWR(url, fetcher);

  const isLoading = !data && !error;

  return { data, error, isLoading };
};

export default useFetch;