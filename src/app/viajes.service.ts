import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Importar Firebase Authentication


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
  viajes: any;

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
   * Obtiene un viaje específico por su ID
   * @param id - ID del viaje
   */
  obtenerViajePorId(id: string): Observable<any> {
    return this.firestore.collection('viajes').doc(id).valueChanges().pipe(
      map(viaje => Object.assign({ id }, viaje))  // Combina id con los datos del viaje
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
