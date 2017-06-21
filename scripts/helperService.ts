import { Injectable } from '@angular/core';

import { CompanyViewModel } from './models/CompanyViewModel';

@Injectable()
export class HelperService {

    showToast(toast: any, message: string) {
        if (toast) {
            toast.text = message;
            toast.open();
        }
    }

    processUploadFileName(localFileName: string) {
        console.log("before: ", localFileName);
        let serverFileName: string = localFileName.replace(/;+/g, '-').replace(/\s+/g, '_').replace(/.+/g, '_');
        console.log("after reg: ", serverFileName);
        let timestamp: string = Date.now().toString();

        serverFileName = timestamp + "_" + serverFileName;

        console.log("after: ", serverFileName);
        return serverFileName;
    }

    mapCompany(company: CompanyViewModel, outerObj: any) {
        company.Id = outerObj.getAttribute('companyId');
        company.Guid = outerObj.getAttribute('_cg');
        company.AgentType = parseInt(outerObj.getAttribute('companyType'));
        company.Status = parseInt(outerObj.getAttribute('companyStatus'));
        company.CompanyName = outerObj.getAttribute('companyName');
        company.LegalForm = outerObj.getAttribute('legalForm');
        company.RegisterSteps = parseInt(outerObj.getAttribute('registerSteps'));
    }

    public DATE_PICKER_i18n_ru = {
        week: 'неделя',
        calendar: 'календар',
        clear: 'очистить',
        today: 'сегодня',
        cancel: 'отмена',
        firstDayOfWeek: 1,
        monthNames: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
        weekdays: 'воскресенье_понедельник_вторник_среда_чертверг_пятница_суббота'.split('_'),
        weekdaysShort: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
        formatDate: function (d) {
            return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.');
        },
        parseDate: function (text) {
            // This example produces a really strict parser which only accepts
            // perfectly formatted dates like '12.8.2013'. Less strict implementation or
            // a 3rd party parser like in the example below is recommended.
            var parts = text.split('.');
            if (parts.length === 3) {
                var date = new Date(0, 0);
                date.setFullYear(parseInt(parts[2]));
                date.setMonth(parseInt(parts[1]) - 1);
                date.setDate(parseInt(parts[0]));
                return date;
            }
        },
        formatTitle: function (monthName, fullYear) {
            return monthName + ' ' + fullYear;
        }
    };

    public DATE_PICKER_i18n_en = {
        today: 'today',
        cancel: 'cancel',
        firstDayOfWeek: 1,
        monthNames: ['january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'],
        weekdaysShort: ['son', 'mon', 'tue', 'wen', 'thu', 'fr', 'sat'],
        formatDate: function (d) {
            return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('.');
        },
        formatTitle: function (monthName, fullYear) {
            return monthName + ' ' + fullYear;
        }
    };

    public UPLOAD_i18n_ru = {
        dropFiles: {
            one: 'Перетяните файл сюда...',
            many: 'Перетяните файлы сюда...'
        },
        addFiles: {
            one: 'Выбрать файл',
            many: 'Добавить файлы'
        },
        cancel: 'Отменить',
        error: {
            tooManyFiles: 'Превышено количество файлов.',
            fileIsTooBig: 'Превышен размер файла.',
            incorrectFileType: 'Неправильный тип файла.'
        },
        uploading: {
            status: {
                connecting: 'Соединение...',
                stalled: 'Сбой.',
                processing: 'Обработка файла...'
            },
            remainingTime: {
                prefix: 'remaining time: ',
                unknown: 'unknown remaining time'
            },
            error: {
                serverUnavailable: 'Сервер недоступен',
                unexpectedServerError: 'Неожиданная ошибка сервера',
                forbidden: 'Доступ запрещен'
            }
        },
        units: {
            size: ['Б', 'КБ', 'МБ', 'ГБ', 'TB', 'PB', 'EB', 'ZB', 'YB']
        },
        //formatSize: function (bytes) {...},
        //formatTime: function (seconds, [secs, mins, hours]) {...}
    };

    public UPLOAD_i18n_en = {
        dropFiles: {
            one: 'Drop file here...',
            many: 'Drop files here...'
        },
        addFiles: {
            one: 'Upload file',
            many: 'Add files'
        },
        cancel: 'Cancel',
        error: {
            tooManyFiles: 'Too many files.',
            fileIsTooBig: 'File is too big.',
            incorrectFileType: 'Incorrect file type.'
        },
        uploading: {
            status: {
                connecting: 'Connecting...',
                stalled: 'Stalled.',
                processing: 'Processing...'
            },
            remainingTime: {
                prefix: 'remaining time: ',
                unknown: 'unknown remaining time'
            },
            error: {
                serverUnavailable: 'Server unavailable',
                unexpectedServerError: 'Unexpected server error',
                forbidden: 'Forbidden'
            }
        },
        units: {
            size: ['b', 'kb', 'mb', 'gb', 'tb', 'PB', 'EB', 'ZB', 'YB']
        },
        //formatSize: function (bytes) {...},
        //formatTime: function (seconds, [secs, mins, hours]) {...}
    };


}