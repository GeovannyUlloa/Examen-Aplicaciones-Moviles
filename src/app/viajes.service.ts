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
  afAuth = inject(AngularFireAuth);
  viajes: any;

  

  // obtenerViajes(): Observable<any[]> {
  //   return this.firestore.collection('viajes').valueChanges();  // "viajes" es el nombre de la colección
  // }

  obtenerViajes(): Observable<any[]> {
    return this.firestore.collection('viajes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // agregarViaje(viaje: any) {
  //   this.firestore.collection('viajes').add(viaje).then(() => {
  //     console.log('Viaje agregado con éxito');
  //   }).catch(error => {
  //     console.error('Error al agregar viaje:', error);
  //   });
  // }

  /**
   * Agrega un nuevo viaje a la colección de Firestore
   * @param viaje - Datos del viaje
   */
  agregarViaje(viaje: any, usuario: any) {
    // Añadir el propietario (conductor) al viaje
    const viajeConductor = { ...viaje, conductorId: usuario.uid }; // Puedes usar el uid o cualquier otro identificador
    this.firestore.collection('viajes').add(viajeConductor).then(() => {
      console.log('Viaje agregado con éxito');
    }).catch(error => {
      console.error('Error al agregar viaje:', error);
    });
  }

  /**
   * Obtiene un viaje específico por su ID
   * @param id - ID del viaje
   */
  // obtenerViajePorId(id: string): Observable<any> {
  //   return this.firestore.collection('viajes').doc(id).valueChanges().pipe(
  //     map(viaje => viaje ? { id, ...viaje } : { id, destino: '', conductor: '', fecha: '', hora: '', puntoEncuentro: '', pasajerosActuales: 0, pasajerosMaximos: 0 }) 
  //     // Si viaje es nulo o undefined, se asignan valores predeterminados
  //   );
  // }

  obtenerViajePorId(id: string): Observable<any> {
    return this.firestore.collection('viajes').doc(id).valueChanges().pipe(
      map(viaje => Object.assign({ id }, viaje))  // Combina id con viaje
    );
  }

  // obtenerViajePorId(id: string): Observable<any> {
  //   return this.firestore.collection('viajes').doc(id).valueChanges().pipe(
  //     map(viaje => viaje ? Object.assign({ id }, viaje) : { id, destino: '', conductor: '', fecha: '', hora: '', puntoEncuentro: '', pasajerosActuales: 0, pasajerosMaximos: 0 })
  //   );
  // }

  obtenerDatosUsuario() {
    return this.usuario;
  }

  actualizarUsuario(nuevosDatos: { nombre: string; contraseña: string }) {
    this.usuario.nombre = nuevosDatos.nombre;
    if (nuevosDatos.contraseña) {
      this.usuario.contraseña = nuevosDatos.contraseña;
    }
  }
}
