import { Category } from './../../models/category.model';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/firestore';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userCollection: AngularFirestoreCollection<User>;
  constructor(private afs: AngularFirestore) {
    this.userCollection = this.afs.collection('users');
  }

  getUser = (userid?: string) => this.userCollection.doc(userid).valueChanges();

  // Centre d'interet initial de l'utilisateur
  getInitialSubscription(userid: string): Observable<DocumentData[]> {
    const userDoc = this.userCollection.doc(userid);
    return userDoc.collection('interestCenter').valueChanges();
  }

  // Tous les centres d'interet de l'utilisateur courrement connnecté
  async getInterestCenter(userid: string): Promise<Category[]> {
    const userDoc = this.afs.firestore.collection('users').doc(userid);
    const interestCenters = await userDoc.collection('interestCenter').get();
    return interestCenters.docs.map((doc) => {
      const data = doc.data() as Category;
      const id = doc.id;
      return { id, ...data };
    });
  }

  // souscription aux centres d'interet
  setInterestCenter(userID: string, category: Category): Promise<void> {
    const userDoc = this.userCollection.doc(userID);
    return userDoc.collection('interestCenter').doc(category.id).set(category);
  }

  // desabonnement aux centres d'interet
  deleteInterestCenter(userID: string, category: Category): Promise<void> {
    const userDoc = this.userCollection.doc(userID);
    return userDoc.collection('interestCenter').doc(category.id).delete();
  }

  // Sauvegade des données de nouveau utilisateur dans firestore
  // et initialisation de la sous-collection "interestCenter"
  newUser(user: User): Promise<void> {
    const defaultInterestCenter = {
      categoryName: 'Google Tech',
      categoryDesc:
        'Faisons de la nouvelle technologie Google utile et plus accessible dans la francophonie',
      categoryColor: '#ff91f9',
    };
    const userDoc = this.userCollection.doc(`${user.id}`);
    userDoc.collection('interestCenter').add(defaultInterestCenter);
    return userDoc.set(user);
  }

  updateUserProfileImg(urlImg: string, userID?: string): Promise<void> {
    return this.userCollection.doc(userID).update({ imgProfil: urlImg });
  }

  updateUserProfilInfo(userInfo: User, userID?: string): Promise<void> {
    return this.userCollection.doc(userID).update(userInfo);
  }
}
