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
<<<<<<< HEAD
  movement_type: 'ENTRY' | 'EXIT' | string; // Corregido sin comillas
  latitude: number;
  longitude: number;
  observation?: string; // 👈 Agrégala aquí si la vas a usar
=======
  movement_type: 'ENTRY' | 'EXIT';
  latitude: number;
  longitude: number;
>>>>>>> d041a0d029502f074eb7e199e42f0afe106b454b
  created_at?: string;
}