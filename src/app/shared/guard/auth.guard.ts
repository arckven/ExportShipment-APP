import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../guard/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, public auth: AuthService) { }

  canActivate() {
      if (this.auth.isAuthenticated()) {
          return true;
      }

      this.router.navigate(['/login']);
      return false;
  }
}
