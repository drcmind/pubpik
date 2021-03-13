import { User } from './user.model';
import { Category } from './category.model';
export interface PubPik {
  pubpikId?: string;
  pubpikTitle: string;
  pubpikDescription?: string;
  pubpikVisibility: string;
  pubpikCategory: Category;
  pubpikUserData: User;
  pubpikFavoriteCount: number;
  isFavoriteCount?: boolean;
  pubpikTimestamp: firebase.default.firestore.FieldValue;
  pubpikImages: string[];
}
