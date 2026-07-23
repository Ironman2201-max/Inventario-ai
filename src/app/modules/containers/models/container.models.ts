export interface Container {
  id?: number;
  code: string;
  type: 'Dry Van' | 'Reefer' | 'High Cube' | 'Vacío' | 'Tránsito';
  customs_status: boolean; // true = Liberado, false = Retenido
  status: 'Operativo' | 'Mantenimiento' | 'Dañado';
  warehouse: string;
  slot: string;
  entry_date?: string;
  exit_date?: string;
  // 👤 Datos del operador que lo registró
  operador_nombre?: string;
  operador_cedula?: string;
}

export interface Movement {
  id?: number;
  container_id: number;
  user_id: number;
  movement_type: 'ENTRY' | 'EXIT' | string; // Corregido sin comillas
  latitude: number;
  longitude: number;
  observation?: string; // 👈 Agrégala aquí si la vas a usar
  created_at?: string;
  // 👤 Datos opcionales traídos desde la BD para mostrar en tablas/historial
  operador_nombre?: string;
  operador_cedula?: string;
}