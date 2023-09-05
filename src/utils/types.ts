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
