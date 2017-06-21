"use strict";
var core_1 = require('@angular/core');
var RX_1 = require('rxjs/RX');
var ContractViewModel_1 = require('../../models/ContractViewModel');
core_1.Injectable();
var ContractSrv = (function () {
    function ContractSrv() {
        var cvm = new ContractViewModel_1.ContractViewModel();
        this.CVMChanged = new RX_1.BehaviorSubject(cvm);
        this.emitter = this.CVMChanged.asObservable();
    }
    ContractSrv.prototype.update = function (cvm) {
        this.CVMChanged.next(cvm);
    };
    return ContractSrv;
}());
exports.ContractSrv = ContractSrv;
