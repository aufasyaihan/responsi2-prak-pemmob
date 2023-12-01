import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Logout', url: '', icon: 'exit' }
  ];

  USERNAME = 'namasaya';
  public nama = '';

  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.cekSesi();
    console.log(this.nama);
  }

  async cekSesi() {
    const ambilNama = localStorage.getItem(this.USERNAME);
    if (ambilNama) {
      let namauser = ambilNama;
      this.nama = namauser;
    } else {
      this.authService.logout();
      this.router.navigateByUrl('/', { replaceUrl: true });
    }
  }

  logout() {
    this.alertController
      .create({
        header: 'Perhatian',
        subHeader: 'Yakin Logout aplikasi ?',
        buttons: [
          {
            text: 'Batal',
            handler: (data: any) => {
              console.log('Canceled', data);
            },
          },
          {
            text: 'Yakin',
            handler: (data: any) => {
              this.authService.logout();
              this.router.navigateByUrl('/', { replaceUrl: true });
            },
          },
        ],
      })
      .then((res) => {
        res.present();
      });
  }
}
