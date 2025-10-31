import { AuthService } from './../services/auth.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.loadProfile().pipe(
    switchMap(() => auth.userObservable$),
    take(1),
    map((user) => (user ? true : router.createUrlTree(['/login'])))
  );
};
