import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

const USERNAME = 'namasaya';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dataSiswa: any = [];
  id: number | null = null;
  nama: string = '';
  nilai: number = 0;
  modal_tambah: boolean = false;
  modal_edit: boolean = false;
  public namaUser = '';

  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    public _apiService: ApiService,
    private modal: AlertController
  ) {}

  ngOnInit() {
    this.cekSesi();
  }

  async cekSesi() {
    const ambilNama = localStorage.getItem(USERNAME);

    if (ambilNama) {
      let namauser = ambilNama;
      this.nama = namauser;
      this.getSiswa();
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
              //jika tekan yakin
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
  getSiswa() {
    this._apiService.tampil('tampil.php').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.dataSiswa = res;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  reset_model() {
    this.id = null;
    this.nama = '';
    this.nilai = 0;
  }
  open_modal_tambah(isOpen: boolean) {
    this.modal_tambah = isOpen;
    this.reset_model();
    this.modal_tambah = true;
    this.modal_edit = false;
  }
  open_modal_edit(isOpen: boolean, idget: any) {
    this.modal_edit = isOpen;
    this.id = idget;
    console.log(this.id);
    this.ambilSiswa(this.id);
    this.modal_tambah = false;
    this.modal_edit = true;
  }

  cancel() {
    this.modal.dismiss();
    this.modal_tambah = false;
    this.reset_model();
  }
  tambahSiswa() {
    if (this.nama != '' && !isNaN(Number(this.nilai))) {
      let data = {
        nama: this.nama,
        nilai: this.nilai,
      };
      this._apiService.tambah(data, '/tambah.php').subscribe({
        next: (hasil: any) => {
          this.reset_model();
          console.log('berhasil tambah Siswa');
          this.getSiswa();
          this.modal_tambah = false;
          this.modal.dismiss();
        },
        error: (err: any) => {
          console.log('gagal tambah Siswa');
        },
      });
    } else {
      console.log('gagal tambah Siswa karena masih ada data yg kosong');
    }
  }

  hapusSiswa(id: any) {
    this._apiService.hapus(id, '/hapus.php?id=').subscribe({
      next: (res: any) => {
        console.log('sukses', res);
        this.getSiswa();
        console.log('berhasil hapus data');
      },
      error: (error: any) => {
        console.log('gagal');
      },
    });
  }

  ambilSiswa(id: any) {
    this._apiService.lihat(id, '/lihat.php?id=').subscribe({
      next: (hasil: any) => {
        console.log('sukses', hasil);
        let Siswa = hasil;
        this.id = Siswa.id;
        this.nama = Siswa.nama;
        this.nilai = Siswa.nilai;
      },
      error: (error: any) => {
        console.log('gagal ambil data');
      },
    });
  }

  editSiswa() {
    let data = {
      id: this.id,
      nama: this.nama,
      nilai: this.nilai,
    };
    this._apiService.edit(data, '/edit.php').subscribe({
      next: (hasil: any) => {
        console.log(hasil);
        this.reset_model();
        this.getSiswa();
        console.log('berhasil edit Siswa');
        this.modal_edit = false;
        this.modal.dismiss();
      },
      error: (err: any) => {
        console.log('gagal edit Siswa');
      },
    });
  }
}
