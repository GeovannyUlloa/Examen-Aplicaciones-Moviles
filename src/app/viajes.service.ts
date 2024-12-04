import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from './services/utils.service';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private usuario = {
    nombre: 'Usuario Actual',
    contraseña: '',
  };

  firestore = inject(AngularFirestore);
  afAuth = inject(AngularFireAuth);  // Inyectar Firebase Authentication
  utilsService = inject(UtilsService);  // Inyectar UtilsService

  /**
   * Obtiene todos los viajes de la colección
   */
  obtenerViajes(): Observable<any[]> {
    return this.firestore.collection('viajes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  obtenerTodosLosViajes(): Observable<any[]> {
    return this.firestore.collection('viajes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  obtenerRolUsuario(): Promise<string | null> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return this.firestore.collection('users').doc(user.uid).get().toPromise()
          .then(doc => {
            const userData = doc.data();
            return userData ? userData['role'] : null;
          });
      }
      return null;
    });
  }

  /**
   * Agrega un nuevo viaje a la colección de Firestore
   * @param viaje - Datos del viaje
   */
  agregarViaje(viaje: any) {
    // Obtener el usuario autenticado
    this.afAuth.currentUser.then(user => {
      if (user) {
        // Añadir el usuario actual como conductor al viaje
        const viajeConductor = { 
          ...viaje, 
          conductorId: user.uid,    // Asociamos el UID del conductor
          conductor: user.displayName || 'Desconocido' // Agregar nombre del conductor
        };
  
        // Guardar el viaje con los datos del conductor
        this.firestore.collection('viajes').add(viajeConductor).then(() => {
          console.log('Viaje agregado con éxito');
        }).catch(error => {
          console.error('Error al agregar viaje:', error);
        });
      } else {
        console.error('No hay usuario autenticado');
      }
    });
  }

  /**
   * Obtiene los viajes del conductor autenticado
   */
  obtenerViajesDelConductor(): Observable<any[]> {
    return from(this.afAuth.currentUser).pipe(
      map(user => {
        if (!user) {
          console.error('No hay usuario autenticado');
          return [];
        }
        return this.firestore.collection('viajes', ref => ref.where('conductorId', '==', user.uid))
          .snapshotChanges().pipe(
            map(actions => actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
      }),
      // Aplanar el Observable anidado
      mergeMap(obs => obs instanceof Array ? of(obs) : obs)
    );
  }

  inscribirPasajero(viajeId: string) {
    const viajeRef = this.firestore.collection('viajes').doc(viajeId);
    const currentUser = this.utilsService.getLocalStorage('user') as User;
  
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    // Obtener el viaje actual
    return viajeRef.get().toPromise().then(doc => {
      const viaje = doc.data() as { 
        pasajerosActuales: number, 
        pasajerosMaximos: number,
        pasajeros: Array<{uid: string, name: string, email: string}>
      };

      if (!viaje) {
        throw new Error('No se encontró el viaje');
      }

      // Inicializar el array de pasajeros si no existe
      if (!viaje.pasajeros) {
        viaje.pasajeros = [];
      }

      // Verificar si el pasajero ya está inscrito
      const yaInscrito = viaje.pasajeros.some(p => p.uid === currentUser.uid);
      if (yaInscrito) {
        throw new Error('Ya estás inscrito en este viaje');
      }

      if (viaje.pasajerosActuales >= viaje.pasajerosMaximos) {
        throw new Error('El viaje ha alcanzado su capacidad máxima de pasajeros');
      }

      // Agregar el nuevo pasajero
      const nuevoPasajero = {
        uid: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email
      };

      return viajeRef.update({
        pasajerosActuales: viaje.pasajerosActuales + 1,
        pasajeros: [...viaje.pasajeros, nuevoPasajero]
      }).then(() => {
        console.log('Pasajero inscrito con éxito');
      });
    }).catch(error => {
      console.error('Error al inscribir pasajero:', error);
      throw error;
    });

  }

  /**
   * Obtiene un viaje específico por su ID
   * @param id - ID del viaje
   */
  obtenerViajePorId(id: string): Observable<any> {
    return this.firestore.collection('viajes').doc(id).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data() as any;
        return { id: doc.payload.id, ...data };
      })
    );
  }

  /**
   * Obtiene los pasajeros inscritos para un viaje específico
   * @param viajeId - ID del viaje
   */
  obtenerPasajerosPorViaje(viajeId: string): Observable<any> {
    return this.firestore.collection('viajes').doc(viajeId).snapshotChanges().pipe(
      map(doc => {
        const data = doc.payload.data() as any;
        return { id: doc.payload.id, ...data.pasajeros };
      })
    );
  }

  /**
   * Obtiene los datos del usuario actual (ej. nombre y contraseña)
   */
  obtenerDatosUsuario() {
    return this.usuario;
  }

  /**
   * Actualiza los datos del usuario
   * @param nuevosDatos - Datos a actualizar
   */
  actualizarUsuario(nuevosDatos: { nombre: string; contraseña: string }) {
    this.usuario.nombre = nuevosDatos.nombre;
    if (nuevosDatos.contraseña) {
      this.usuario.contraseña = nuevosDatos.contraseña;
    }
  }
}
