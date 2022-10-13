import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const DESTROY = Symbol('__destroyed');

export function Destroyable(): ClassDecorator {
  return (target: any) => {

    const ngOnDestroy: (() => void) | null = target.prototype.ngOnDestroy;

    target.prototype.ngOnDestroy = function OnDestroy() {

      if (ngOnDestroy) {
        ngOnDestroy.call(this);
      }

      if (this[DESTROY]) {
        this[DESTROY].next();
        this[DESTROY].complete();
        console.log('--------------------------------');
      }
    };

    return target;
  };
}

/**
 * @example
 *
 *  this.pending$.pipe(
 *     takeUntilDestroyed(this)
 *  ).subscribe(() => {
 *     Do somethings
 *  });
 *
 * @param() component
 */

export const takeUntilDestroyed = <T>(component: any): MonoTypeOperatorFunction<T> => (source: Observable<T>) => {
  if (!component[DESTROY]) {
    component[DESTROY] = new Subject<void>();


  }

  return source.pipe(
    takeUntil(component[DESTROY])
  );
};
