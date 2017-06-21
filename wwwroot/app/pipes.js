"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var PADDING = "000000";
var CurrencyRurPipe = (function () {
    function CurrencyRurPipe() {
        this.THOUSANDS_SEPARATOR = ' ';
    }
    CurrencyRurPipe.prototype.transform = function (value) {
        if (value == undefined)
            return '';
        var nStr = '';
        var x = value.toString().split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + this.THOUSANDS_SEPARATOR + '$2');
        }
        return x1 + x2;
    };
    CurrencyRurPipe = __decorate([
        core_1.Pipe({ name: "CurrencyRur" }), 
        __metadata('design:paramtypes', [])
    ], CurrencyRurPipe);
    return CurrencyRurPipe;
}());
exports.CurrencyRurPipe = CurrencyRurPipe;
var LabelDaysPipe = (function () {
    function LabelDaysPipe() {
    }
    LabelDaysPipe.prototype.transform = function (value) {
        if (value == undefined)
            return '';
        return value + ' ' + getNumEnding(value, ['день', 'дня', 'дней']);
    };
    LabelDaysPipe = __decorate([
        core_1.Pipe({ name: "LabelDays" }), 
        __metadata('design:paramtypes', [])
    ], LabelDaysPipe);
    return LabelDaysPipe;
}());
exports.LabelDaysPipe = LabelDaysPipe;
var LabelChooseLotsPipe = (function () {
    function LabelChooseLotsPipe() {
    }
    LabelChooseLotsPipe.prototype.transform = function (value) {
        if (value == undefined)
            return '';
        return getNumEnding(value, ['Выбран', 'Выбрано', 'Выбрано']) + ' ' + value + ' ' + getNumEnding(value, ['лот', 'лота', 'лотов']);
    };
    LabelChooseLotsPipe = __decorate([
        core_1.Pipe({ name: "LabelChooseLots" }), 
        __metadata('design:paramtypes', [])
    ], LabelChooseLotsPipe);
    return LabelChooseLotsPipe;
}());
exports.LabelChooseLotsPipe = LabelChooseLotsPipe;
function getNumEnding(iNumber, aEndings) {
    var sEnding, i;
    iNumber = iNumber % 100;
    if (iNumber >= 11 && iNumber <= 19) {
        sEnding = aEndings[2];
    }
    else {
        i = iNumber % 10;
        switch (i) {
            case (1):
                sEnding = aEndings[0];
                break;
            case (2):
            case (3):
            case (4):
                sEnding = aEndings[1];
                break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}
