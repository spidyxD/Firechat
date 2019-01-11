import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Message } from '../interface/message.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Message>;
  public chats: Message[] = [];
  public user: any = {};
  // tslint:disable-next-line:no-inferrable-types
  public check: boolean = false;
  // tslint:disable-next-line:no-inferrable-types
  public actualProvider: string = 'null';
  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
      this.afAuth.authState.subscribe( u => {
        console.log('state', u);
        if (!u) {
          return;
        } else {
          this.user.name = u.displayName;
          this.user.uid = u.uid;
          this.user.photo = u.photoURL;
          this.check = true;
        }
      });
   }

  loadingMessages() {
    this.itemsCollection = this.afs.collection<Message>('chats', ref => ref.orderBy('date', 'desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(map((messages: Message[]) => {
      console.log(messages);
      this.chats = [];
      for (const m of messages) {
        // shift se encarga de colocar en primera posicion el elemento
        this.chats.unshift(m);
      }
     return this.chats;
    }));
  }

  login(p: string) {
    switch (p) {
      case 'google':
        this.actualProvider = 'google';
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
        break;
      case 'twiter':
        this.actualProvider = 'twiter';
        this.afAuth.auth.signInWithPopup(new auth.TwitterAuthProvider());
        break;
      case 'facebook':
        this.actualProvider = 'facebook';
        this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
        break;
      default:
        break;
    }
  }

  logout() {
    this.user = {};
    this.afAuth.auth.signOut();
  }

  addMessage(text: string) {
    // falta uid del user
    const message: Message = {
      name: this.user.name,
      message: text,
      date: new Date().getTime(),
      uid: this.user.uid,
      photo: this.user.photo
    };
    return this.itemsCollection.add(message);
  }

  // se verifica que el el partner sea distinto al actual para hacer la transferencia de datos
  // asi se intercambian las fotos del chat
  sendPhotoParner(uid: string, prov?: string) {
    // tslint:disable-next-line:no-inferrable-types
    // let p: string = '';
    for (const mens of this.chats) {
      if (mens.uid !== uid) {
        console.log(mens.photo, prov);
        // p = mens.photo;
        return mens.photo;
      }
    }

  }
  sendNameParner(uid: string) {
    for (const mens of this.chats) {
      if (mens.uid !== uid) {
        return mens.name;
      }
    }
  }

  checkStatus(uid: string) {
    for (const mens of this.chats) {
       if (mens.uid !== uid) {
            return true;
       }
         return this.check;
      }
  }
}
