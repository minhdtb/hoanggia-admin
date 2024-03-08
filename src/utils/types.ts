export interface MenuLink {
  title: string;
  to?: string;
  icon?: string;
  children?: MenuLink[];
}

export interface ListOptions {
  limit?: number;
  page?: number;
}

export const HANOI_LOCATION = '21.02026206488695, 105.84568497791143'
