import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'oauth-fe';
  constructor(private http: HttpClient) {}

  renderText: string = '';
  ngOnInit() {
    this.getHello().subscribe({
      next: (res) => {
        this.renderText = res;
        console.log(`Hello World`, res);
      },
      error: (err) => {
        if (err.status == 401) {
          this.getLoginUri(this.redirectUri).subscribe({
            next: (response: any) => {
              console.log(`Url: `, response);
              window.location.href = response.url;
            },
          });
        }
        console.log(`error: `, err);
      },
    });
  }

  getHello = () => {
    const helloUrl = 'http://localhost:8095/api/hello';
    return this.http.get(helloUrl, {
      withCredentials: true,
      responseType: 'text',
    });
  };
  baseUrl: string = 'http://localhost:8095/api/loginUri';
  redirectUri: string = `http://localhost:8095/api/ticketConsumer?redirectUri=${window.location.href}`;
  getLoginUri = (redirectUri: string) => {
    return this.http.get(`${this.baseUrl}?redirectUri=${redirectUri}`);
  };
}
