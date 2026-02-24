import { useState } from 'react';

export function useTable({ defaultPage = 1, defaultLimit = 10 } = {}) {
  const [page,   setPage]   = useState(defaultPage);
  const [limit,  setLimit]  = useState(defaultLimit);
  const [search, setSearch] = useState('');

  const reset = () => { setPage(1); setSearch(''); };

  return { page, limit, search, setPage, setLimit, setSearch, reset };
}
