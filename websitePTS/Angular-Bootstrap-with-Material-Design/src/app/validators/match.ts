import { FormGroup } from '@angular/forms';

/*
  Autor: Jakob Hocheneder
  Titel: Match Funktion
  Beschreibung: Funktion zum Überprüfen der Übereinstimmung von Passwort und Passwort wiederholen
*/
export function match(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}