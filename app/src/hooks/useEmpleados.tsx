import { useEffect, useState, useCallback } from 'react';
import { empleadosApi } from '../api/empleadosApi';
import { Employee } from '../interfaces/empleadosinterface';

export function useEmpleados(initialPage = 1, initialLimit = 10) {
  const [employees, setEmployees] = useState<Employee[]>([] as any);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [limit] = useState<number>(initialLimit);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const normalizeEmpleado = (emp: any) => {
    return {
      id: emp.id ?? emp.id_empleado ?? emp.idEmpleado,
      nombre: emp.nombre ?? emp.firstName ?? emp.name ?? '',
      area: emp.area ?? null,
      turno: emp.turno ?? null,
      activo: emp.activo ?? emp.active ?? true,
      produccion: emp.produccion ?? emp.productions ?? [],
      asistencia: emp.asistencia ?? emp.attendance ?? [],
      ...emp,
    } as any;
  };

  const fetchEmployees = useCallback(async (requestedPage = initialPage, requestedLimit = initialLimit, append = false) => {
    setError(null);
    if (append) setLoadingMore(true);
    else setLoading(true);
    try {
      const res = await empleadosApi.get(`/empleados?page=${requestedPage}&limit=${requestedLimit}`);
      // payload may be in res.data.data or res.data itself
      const payload = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);

      if (Array.isArray(payload)) {
        const normalized = payload.map((e: any) => normalizeEmpleado(e));
        if (append) setEmployees((prev) => [...prev, ...normalized]);
        else setEmployees(normalized);

        const receivedPage = res.data?.page ?? requestedPage;
        const receivedTotalPages = res.data?.totalPages ?? null;
        setPage(receivedPage);
        setTotalPages(receivedTotalPages);
      } else {
        if (!append) setEmployees([] as any);
      }
    } catch (err: any) {
      console.warn('useEmpleados fetch error', err?.message ?? err);
      setError(err?.message ?? 'Error al cargar empleados');
      if (!append) setEmployees([] as any);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [initialLimit, initialPage]);

  const createEmpleado = useCallback(async (data: Partial<Employee>) => {
    const res = await empleadosApi.post('/empleados', data);
    const emp = normalizeEmpleado(res.data);
    setEmployees((prev) => [emp, ...prev]);
    return emp;
  }, []);

  const updateEmpleado = useCallback(async (id: number, data: Partial<Employee>) => {
    const res = await empleadosApi.patch(`/empleados/${id}`, data);
    const emp = normalizeEmpleado(res.data);
    setEmployees((prev) => prev.map((p) => (p.id === id ? emp : p)));
    return emp;
  }, []);

  const deleteEmpleado = useCallback(async (id: number) => {
    await empleadosApi.delete(`/empleados/${id}`);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    // reset to first page
    await fetchEmployees(1, limit, false);
  }, [fetchEmployees, limit]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading) return;
    const nextPage = (page ?? 1) + 1;
    if (totalPages != null && nextPage > totalPages) return;
    await fetchEmployees(nextPage, limit, true);
  }, [fetchEmployees, limit, loadingMore, loading, page, totalPages]);

  useEffect(() => {
    fetchEmployees(page, limit, false);
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    refreshing,
    error,
    loadingMore,
    fetchEmployees,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
    refresh,
    loadMore,
  };
}

export default useEmpleados;
