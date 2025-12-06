export type Employee = {
  id?: number;
  id_empleado?: number;
  nombre: string;
  area?: string | null;
  turno?: string | null;
  activo?: boolean;
  produccion?: any[];
  asistencia?: any[];
  [key: string]: any;
};

export default Employee;
