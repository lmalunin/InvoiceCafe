import { Pipe, PipeTransform } from "@angular/core";

const PADDING = "000000";

@Pipe({ name: "CurrencyRur" })
export class CurrencyRurPipe implements PipeTransform {

    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;

    constructor() {
        this.THOUSANDS_SEPARATOR = ' ';
    }

    transform(value: number): string {
        if (value == undefined)
            return '';
        let nStr = '';
        let x = value.toString().split('.');
        let x1 = x[0];
        let x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + this.THOUSANDS_SEPARATOR + '$2');
        }
        return x1 + x2;
    }
}

@Pipe({ name: "LabelDays" })
export class LabelDaysPipe implements PipeTransform {

    constructor() {
    }

    transform(value: number): string {
        if (value == undefined)
            return '';    
        return value + ' ' + getNumEnding(value, ['день', 'дня','дней']);
    }
}

@Pipe({ name: "LabelChooseLots" })
export class LabelChooseLotsPipe implements PipeTransform {

    constructor() {
    }

    transform(value: number): string {
        if (value == undefined)
            return '';
        return getNumEnding(value, ['Выбран', 'Выбрано', 'Выбрано']) + ' ' + value + ' ' + getNumEnding(value, ['лот', 'лота', 'лотов']);
    }
}

function getNumEnding(iNumber, aEndings) {
    var sEnding, i;
    iNumber = iNumber % 100;
    if (iNumber >= 11 && iNumber <= 19) {
        sEnding = aEndings[2];
    }
    else {
        i = iNumber % 10;
        switch (i) {
            case (1): sEnding = aEndings[0]; break;
            case (2):
            case (3):
            case (4): sEnding = aEndings[1]; break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}