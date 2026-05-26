// Пользователь
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'customer' | 'manager' | 'admin';
  date_joined: string;
}

// Ансамбль (краткий)
export interface EnsembleShort {
  id: number;
  name: string;
  type: string;
  founded: number | null;
  country: string;
  image: string | null;
}

// Ансамбль (полный)
export interface EnsembleDetail extends EnsembleShort {
  description: string;
  members: {
    musician_id: number;
    first_name: string;
    last_name: string;
    role: string;
    instrument: string;
  }[];
}

// Пластинка (краткая)
export interface RecordShort {
  id: number;
  catalogue_number: string;
  title: string;
  ensemble_name: string;
  branch_name: string;
  label: string;
  release_date: string;
  retail_price: string;
  stock_quantity: number;
  sold_current_year: number;
  cover_image: string | null;
}

// Пластинка (полная)
export interface RecordDetail {
  id: number;
  catalogue_number: string;
  title: string;
  label: string;
  supplier_address: string;
  release_date: string;
  wholesale_price: string;
  retail_price: string;
  stock_quantity: number;
  sold_last_year: number;
  sold_current_year: number;
  cover_image: string | null;
  ensemble: EnsembleShort;
  branch: Branch;
  tracks: {
    track_number: number;
    composition: {
      id: number;
      title: string;
      duration: number;
      composer_name: string | null;
    };
  }[];
}

// Филиал
export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  opening_hours: string;
}

// Бронь
export interface Reservation {
  id: number;
  record_title: string;
  record_cover: string | null;
  branch_name: string;
  status_name: string;
  created_at: string;
  expires_at: string;
}