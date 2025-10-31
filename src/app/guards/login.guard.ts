import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { switchMap, take, map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.loadProfile().pipe(
    switchMap(() => auth.userObservable$),
    take(1),
    map((user) => (user ? router.createUrlTree(['/home']) : true))
  );
};
