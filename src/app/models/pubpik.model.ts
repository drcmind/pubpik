import { User } from './user.model';
import { Category } from './category.model';
export interface PubPik {
  pubpikId?: string;
  pubpikTitle: string;
  pubpikDescription?: string;
  pubpikCategory: Category;
  pubpikUserData?: User;
  pubpikFavoriteCount: number;
  isMyFavorite?: boolean;
  pubpikTimestamp: any;
  pubpikImages: string[];
}
