import { Category } from './category';

export interface Product {
  title: string;
  price: number;
  category: Category;
  imageUrl: string;
  key: string
}
