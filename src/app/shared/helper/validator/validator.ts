import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"
import { NgbDate } from "@ng-bootstrap/ng-bootstrap"
import { dateTime2NgbDateTime, dateTime2UnixTimeStamp, ngbDateTime2UnixTimeStamp } from "../convert/dateTime.helper"


export function isValidNgbDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const empty = !control.value && typeof(control.value) === "string"
        const notTypeNgB = typeof(control.value) !== "object"
        return notTypeNgB && !empty ? { isValidNgbDate: true }: null;
    }
}

export function isGreaterDate(targetDate: NgbDate): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if(!targetDate || !value) return null;        
        const currentSecs = ngbDateTime2UnixTimeStamp(value); //secs
        const targetSecs = ngbDateTime2UnixTimeStamp(targetDate); //secs
        return currentSecs > targetSecs ? { isGreaterDate: true }: null;
    }
}

export function isLessThanDate(targetDate: NgbDate): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if(!targetDate || !value) return null;
        
        const currentSecs = ngbDateTime2UnixTimeStamp(value); //secs
        const targetSecs = ngbDateTime2UnixTimeStamp(targetDate); //secs
        return currentSecs < targetSecs ? { isLessThanDate: true }: null;
    }
}

export function notNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if(!value){
            return { notNumber: true };
        }
        const valueString = value + '';
        const isError = (new RegExp('^\d+$').test(valueString));
        return isError ? { notNumber: true }: null;
    }
}

export function maximumLength(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const isError = (value + '').length > length;
        return isError ? { maximumLength: true }: null;
    }
}

export function minimumLenght(length: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        const isError = (value + '').length < length;
        return isError ? { minimumLenght: true }: null;
    }
}
export function onlyNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if(!value){
            return { notNumber: false };
        }
        const valueString = value + ''
        const isError = (new RegExp('^[0-9]*$').test(valueString));
        return isError ? { onlyNumber: true }: null;
    }
}
export function onlySpecialCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if(!value){
            return { notCharacters: false };
        }
        const valueString = value + '';
        const isError = (new RegExp('^[$&+,:;=?@#|<>.^*()%!-]*$').test(valueString));

        return isError ? { onlySpecialCharacters: true }: null;
    }
}
export function notPhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value
        if(!value || value == null || value == ''){
            return { notPhoneNumber: false };
        }
        const valueString = value + '';
        
        let isError = (new RegExp('^9999[0-9]{6}').test(valueString));

        if(!isError)
            isError = (new RegExp('^0[0-9]{9}').test(valueString));

        return !isError ? { notPhoneNumber: true }: null;
    }
}

export function phoneNumber(value: string) {
    const REGEXP = '^0[0-9]{9}';
    if(value == null || value == ''){
        return false;
    }
    return (new RegExp(REGEXP).test(value)) ? true : false;
}

export function email(value: string) {
    var REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(value == null || value == ''){
        return false;
    }
    return REGEXP.test(value) ? true : false;
}