import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export class CustomValidators {
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField)
      const confirmPassword = control.get(confirmPasswordField)

      if (!password || !confirmPassword) {
        return null
      }

      return password.value === confirmPassword.value ? null : { passwordMismatch: true }
    }
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const phoneRegex = /^(\+33|0)[1-9](\d{8})$/
      return phoneRegex.test(control.value) ? null : { invalidPhone: true }
    }
  }

  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value
      if (!value) return null

      const hasNumber = /[0-9]/.test(value)
      const hasUpper = /[A-Z]/.test(value)
      const hasLower = /[a-z]/.test(value)
      const hasSpecial = /[#?!@$%^&*-]/.test(value)
      const isLengthValid = value.length >= 8

      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isLengthValid

      return passwordValid ? null : { weakPassword: true }
    }
  }
}
