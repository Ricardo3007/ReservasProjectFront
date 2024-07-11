

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from 'src/app/Services/auth.service';
import { SessionService } from '../../utils/session.service';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,RouterOutlet,FormsModule,ReactiveFormsModule,NzButtonModule,NzInputModule,NzIconModule,NzNotificationModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  showPassword: boolean = false;
  url = window.location.href;
  conexion: string | null = null;
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  form: FormGroup = this._fb.group({
      nombre: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
  });
  loadingLogin: boolean = false;
  passwordVisible = false;
  constructor(
    private _fb: FormBuilder,
    private _route: Router, private _auth: AuthService, private _sesionServicio: SessionService,
  ) {

}

ingresar() {
  this.loadingLogin = true;
  this._auth.signIn(this.form.value).subscribe((result: any | null) => {
      if (result) {
          this.loadingLogin = false;
          this._route.navigate(['home']);

      } else {
        
          this.loadingLogin = false;
      }
  });
}
}
