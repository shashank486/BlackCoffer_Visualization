import { useState, useEffect } from 'react';

export default function useChartData(api, endpoint, query) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const url = `${api}${endpoint}${query ? '?' + query : ''}`;
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [api, endpoint, query]);

  return { data, loading };
}
