import { ElementRef } from '@angular/core'
import { IonInput } from '@ionic/angular'
import { Interface } from 'readline'

export interface IValidatorField {
    name: string,
    ref: any,
    validations: IValidatorPerform[]
}

export interface IValidatorPerform {
    name: string,
    message: string,
    validate: (value: any) => boolean
}

export interface IValidatorPerformResult {
    message: string,
    valid: boolean,
    invalid: boolean
}

export function equals(compare: () => string, message?: string): IValidatorPerform {
    return {
        name: 'equals',
        message: message || `O valor não coincide`,
        validate: (value: string) => {
            return value == compare()
        }
    }
}

export function notEquals(compare: () => string, message?: string): IValidatorPerform {
    return {
        name: 'notEquals',
        message: message || `O valor não deve coincidir`,
        validate: (value: string) => {
            return value != compare()
        }
    }
}

export function required(): IValidatorPerform {
    return {
        name: 'required',
        message: `Campo obrigatório`,
        validate: (value: string) => {
            return !!value
        }
    }
}

export function email(): IValidatorPerform {
    return {
        name: 'email',
        message: `Email inválido`,
        validate: (value: string) => {
            if(!value)
                return false

            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(String(value).toLowerCase())
        }
    }
}

export function minLength(min: number): IValidatorPerform {
    return {
        name: 'minLength',
        message: `O campo deve conter no mínimo ${min} caracteres`,
        validate: (value: string) => {
            return value && value.length >= min
        }
    }
}

export function range(min: number, max: number): IValidatorPerform {
    return {
        name: 'range',
        message: `O campo deve conter entre ${min} e ${max} caracteres`,
        validate: (value: string) => {
            if(!value && min != 0)
                return false
                
            return value && value.length >= min && value.length <= max
        }
    }
}

export class Validator {
    validated: boolean = false
    validations: {[field: string]: {[name: string]: IValidatorPerformResult}} = {}

    constructor(fields: IValidatorField[] = []) {
        for(let field of fields) {
            this.validations[field.name] = {}
            for(let validation of field.validations) {
                this.validations[field.name][validation.name] = {
                    message: validation.message,
                    get valid() { return validation.validate(field.ref.el.value) },
                    get invalid() { return !validation.validate(field.ref.el.value) }
                }
            }
        }
    }

    public reset() {
        this.validated = false
    }

    public isValid(): boolean {
        this.validated = true

        for(let field in this.validations) {
            for(let validation in this.validations[field]) {
                if(this.validations[field][validation].invalid)
                    return false
            }
        }

        return true;
    }

    public isInvalid(): boolean {
        return !this.isValid()
    }
}