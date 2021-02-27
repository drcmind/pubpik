import { Category } from './../../models/category.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  usersCollection: AngularFirestoreCollection<User>;
  interestCenter: Observable<Category[]> | undefined;

  constructor(private afs: AngularFirestore) {
    // collection utilisateur
    this.usersCollection = this.afs.collection('users');
  }

  getUser = (userid: any) => this.usersCollection.doc(userid).valueChanges();

  // Centre d'interet de l'utilisateur courrement connnecté
  getInterestCenter(userid: any): Observable<Category[]> {
    return this.usersCollection
      .doc(userid)
      .collection('interestCenter')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Category;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  // ajout des centres d'interet
  async addInterestCenter(userID: string, category: Category): Promise<void> {
    try {
      await this.usersCollection
        .doc(userID)
        .collection('interestCenter')
        .add(category);
    } catch (error) {
      console.log(error);
    }
  }

  // Sauvegade des données de nouveau utilisateur dans firestore
  // et initialisation de la sous-collection "interestCenter"
  async newUser(user: User): Promise<void> {
    await this.usersCollection
      .doc(`${user.id}`)
      .collection('interestCenter')
      .add({});
    await this.usersCollection.doc(`${user.id}`).set(user);
  }
}
