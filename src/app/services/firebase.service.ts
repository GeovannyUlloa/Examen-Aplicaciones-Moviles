import { inject, Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { doc, getDoc, getFirestore, setDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsService = inject(UtilsService);

  get isAuthenticated(): boolean {
    return getAuth().currentUser !== null; // Si currentUser es null, no está autenticado
  }

  getAuth() {
    return getAuth();
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  updateUser(displayName: any) {
    return updateProfile(getAuth().currentUser, { displayName });
  }

  setDocument(path: any, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path: any) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsService.routerLink('/auth');
  }

  // Nuevo método para obtener el rol del usuario
  async getUserRole(): Promise<string> {
    const currentUser = getAuth().currentUser;

    if (!currentUser) {
      throw new Error('No hay un usuario autenticado.');
    }

    try {
      // Se asume que la colección de usuarios está en Firestore con documentos por UID
      const userDoc = await this.getDocument(`usuarios/${currentUser.uid}`);
      return userDoc?.['role'] || 'pasajero'; // Valor predeterminado 'pasajero' si el rol no existe
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      throw new Error('No se pudo obtener el rol del usuario.');
    }
  }
}
