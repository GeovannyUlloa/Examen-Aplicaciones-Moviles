import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'YOUR_API_ENDPOINT'; // Replace with your email sending API endpoint

  constructor(private http: HttpClient) {}

  sendEmail(emailData: { to: string; subject: string; body: string }): Observable<any> {
    return this.http.post(this.apiUrl, emailData);
  }
}
