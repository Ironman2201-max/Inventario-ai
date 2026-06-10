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
}

export interface Movement {
  id?: number;
  container_id: number;
  user_id: number;
  movement_type: 'ENTRY' | 'EXIT';
  latitude: number;
  longitude: number;
  created_at?: string;
}