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

  // async getDocument(path: any) {
  //   return (await getDoc(doc(getFirestore(), path))).data();
  // }

  async getDocument(path: string) {
    try {
      const docRef = doc(getFirestore(), path);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log('Documento obtenido:', docSnap.data());  // Asegúrate de que el documento contiene los datos correctos
        return docSnap.data();
      } else {
        console.log('No se encontró el documento.');
        return null;  // Si no existe, retorna null
      }
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      return null;
    }
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
      console.error('No hay un usuario autenticado.');
      return 'pasajero';  // Valor predeterminado para evitar errores
    }
  
    try {
      const userDoc = await this.getDocument(`usuarios/${currentUser.uid}`);
  
      if (userDoc && userDoc['role']) {
        console.log('Rol del usuario:', userDoc['role']);  // Verifica el valor del rol
        return userDoc['role'];  // Devuelve el rol
      } else {
        console.log('No se encontró el rol del usuario.');
        return 'pasajero';  // Valor por defecto si no hay rol
      }
    } catch (error) {
      console.error('Error al obtener el rol del usuario:', error);
      return 'pasajero';  // Valor por defecto si ocurre un error
    }
  }
  
  
}
