import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado para confirmar a igualdade entre dois campos
 * @param passwordField - Nome do campo que contém a senha principal
 */
export function confirmPasswordValidator(passwordField: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const formGroup = control.parent; // Obtém o grupo de controles pai
    if (!formGroup) {
      alert("validator")
      return null;
    }
    const password = formGroup.get(passwordField)?.value; // Obtém o valor do campo de senha
    const confirmPassword = control.value; // Obtém o valor do campo de confirmação

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
