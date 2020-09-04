import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const fileSize = (maxSize: number) => {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const file = control.value;
        if (!file) {
            return {maxValue: {valid: false}};
        }
        const fileSize = file.size / 1024;
        if (maxSize < fileSize) {
            return {maxValue: {valid: false}};
        }
        return null;
    }
}