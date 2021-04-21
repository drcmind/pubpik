import { Category } from '../../models/category.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryCollection: AngularFirestoreCollection<Category>;
  constructor(private afs: AngularFirestore) {
    this.categoryCollection = this.afs.collection('categories');
  }

  getCategories(): Observable<Category[]> {
    return this.categoryCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Category;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }
}
