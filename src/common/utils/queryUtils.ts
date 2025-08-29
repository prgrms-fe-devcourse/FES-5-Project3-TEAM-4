export function applySort(query: any, sort: string, ascending: boolean) {
  return query.order(sort, { ascending });
}

// pagination
export function applyRange(query: any, page?: number, pageSize?: number) {
  if (!page || !pageSize) return query;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return query.range(from, to);
}
