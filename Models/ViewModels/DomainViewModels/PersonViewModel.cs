using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

/*
import { CompanyViewModel } from './CompanyViewModel';
import {UUID} from 'angular2-uuid';
*/

namespace InvoiceCafe.Models.ViewModels.DomainViewModels
{
    public class PersonViewModel
    {
        public Guid Id { get; set; }

        #region 2.2.1.	 Форма регистрации нового Уполномоченного Лица Поставщика
        [Required]
        public string FullName { get; set; } //1
        public DateTime DateOfBirth { get; set; } //2
        public string PlaceOfBirth { get; set; } //3
        public string Position { get; set; } //4
        public string SourceOfAuthority { get; set; } //5

        public string FullPowersDocumentsNames { get; set; } //6 {JSON string of URIs}

        public string Login { get; set; } //7

        public string Password { get; set; } //8
        public int EDS_type { get; set; }//9

        //10. Ограничения для пользователя
        public bool PossibilityToInputContract { get; set; } //10.1
        public bool PossibilityToExposeBid { get; set; } //10.2

        //Если 10.2 Да;
        public bool PossibilityToExposeBidWithoutRestrictions { get; set; } //10.2.1

        //Если 10.2.1 Нет
        public double LimitOfSumOfEveryBid { get; set; } //10.2.2.1
        public double LimitOfCommonSumOfNotCalculatedBids { get; set; } //10.2.2.2
        public bool CounterOfferAcceptPossibility { get; set; } //10.3
        
        //Если 10.3 Да
        public bool CounterOfferAcceptPossibilityWithoutRestrictions { get; set; } //10.3.1

        //Если 10.3.1 Нет
        public double LimitOfDeviationRateFromInitialBidInPercentage { get; set; } //10.3.1.1
        public double LimitOfDeviationByDiscountFromStartBid { get; set; } //10.3.1.2
        public bool PossibilityToAddAndEditNewUsers { get; set; } //10.4
        public bool PossibilityToChangeCompanyInformation { get; set; } //10.5

        public string IdentityDocumentsNames { get; set; }
        #endregion

        #region 2.3.1.	 Форма регистрации нового Уполномоченного Лица Дебитора
        public int PossibilityType { get; set; }
        #endregion

        #region 2.4.1.	 Форма регистрации нового Уполномоченного Лица Инвестора
        public bool UserRestrictions { get; set; }
        public double LimitOfOneBid { get; set; } //10.1
        public double TotalLimitForAllUnsettledBidsAndCounterOffer { get; set; } //10.2
        public double LimitUsettledDebtOnOneSupplierTakingIntoAccountTheCreditQuality { get; set; } //10.3
        public bool PossibilityToAddNewUsers { get; set; } //10.4
        public bool PossibilityToEditNewUsers { get; set; } //10.5
        #endregion

        public string Citizenship { get; set; }
        public string Occupation { get; set; }
        public string MobilePhone { get; set; }
        public string AuthDocumentType { get; set; }
        public string AuthDocumentURL { get; set; }
        public DateTime AuthDateFrom { get; set; }
        public DateTime AuthDateTo { get; set; }

        public string NewPassword { get; set; }

        public string GetDocsBaseUrl { get; internal set; }
        public string DeleteDocsBaseUrl { get; internal set; }

        public bool IsActive { get; set; }

        public virtual CompanyViewModel Company { get; set; }
    }
}
