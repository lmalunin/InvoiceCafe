using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InvoiceCafe.Models.Domain
{
    public enum AGENT_TYPES
    {
        SUPPLIER = 1,
        DEBTOR = 2,
        INVESTOR = 3,

        ADMIN = 100
    }

    public enum CONTRACT_DAYS_COUNT
    {
        WORKING = 1,
        CALENDAR = 2
    }

    public enum CONTRACT_PERSON_TYPE
    {
        SUPPLIER_SIGNER = 1,
        DEBTOR_SIGNER = 2
    }

    public enum CONTRACT_TYPE
    {
        Поставки = 1,
        Оказания_услуг = 2,
        Выполнения_работ = 3,
        Иное = 4
    }
    public enum CONTRACT_DELIVERY_TYPE
    {
        Самовывоз = 1,
        Доставка = 2,
        Иное = 3
    }

    public enum DZ_STATUS
    {
        Init = 0,
        ToAcceptByDebtor = 1,
        AcceptedByDebtor = 5,
        AcceptedByPlatform = 6,
        DeclinedByDebtor = 10,
        AtAuction = 15,
        Sold = 20
    }

    public enum DZ_VERIFICATION_TYPE
    {
        Platform = 5,
        Debtor = 10
    }

    public enum LOT_STATUS
    {
        Init = 0,
        ReadyForSale = 1,
        CounterOfferByInvestor = 3,
        AcceptedByInvestor = 5,
        CounterOfferAcceptedBySupplier = 7
    }

    public enum SIGN_FORM_STATUS
    {
        Init = 0,
        ToAcceptByAdmin = 1,
        Accepted = 5,
        Declined = 10
    }

    public enum COMPANY_STATUS
    {
        Init = 0,
        ToAcceptByAdmin = 1,
        DocumentsAcceptedByAdmin = 2,
        Approved = 5,
        Declined = 10
    }

    public enum OFFER_TYPE
    {
        Equal = 5,
        Different = 10
    }

    public enum OFFER_STATUS
    {
        Init = 0,
        Accepting_by_supplier = 1,
        Accepted = 10,
        Declined = 20
    }

    public enum COMPANY_NUM_OF_CONTRACTORS
    {
        From1to4 = 1,
        From5to10 = 2,
        From11to20 = 3,
        From20 = 4
    }

    public enum COMPANY_TYPE_OF_CONTRACTORS
    {
        SmallBusiness = 1,
        MiddleBusiness = 2,
        LargeBusiness = 3
    }

    public enum EDS_DOCUMENT_TYPE
    {
        Questionnaire = 1
    }

    public enum EDS_DOCUMENT_STATUS
    {
        Draft = 1,
        UploadedToStorage = 10,
        SignedByUser = 20,
        SignedByUserAndPlatform = 30
    }

    public enum DB_OPERATION
    {
        Add = 1,
        Update = 5
    }
}
