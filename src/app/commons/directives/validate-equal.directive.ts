import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[validateEqual]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidateEqualDirective,
      multi: true,
    },
  ],
})
export class ValidateEqualDirective implements Validator {
  @Input('validateEqual') validateEqual: string = ''; // Valor do campo a ser comparado

  validate(control: AbstractControl): ValidationErrors | null {
    if (!control || !control.parent) {
      alert("equalssss")
      return null;
    }

    // Obtém o valor do campo que está sendo validado
    const fieldToCompare = control.parent.get(this.validateEqual);

    // Compara os valores
    if (fieldToCompare && control.value !== fieldToCompare.value) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
