var CADESCOM_CADES_BES = 1;
var CAPICOM_CURRENT_USER_STORE = 2;
var CAPICOM_MY_STORE = "My";
var CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED = 2;
var CAPICOM_CERTIFICATE_FIND_SUBJECT_NAME = 1;
var ProviderName = "Crypto-Pro GOST R 34.10-2001 Cryptographic Service Provider";
var ProviderType = 75;

cadesplugin.then(function () {
    cadesplugin.async_spawn(function* (args) {
        //var oSignedData = yield cadesplugin.CreateObjectAsync("CAdESCOM.CadesSignedData");
        //var dataToSign = "dataToSign";
        //yield oSignedData.propset_Content(dataToSign);
        var oStore = yield cadesplugin.CreateObjectAsync("CAdESCOM.Store");
        var oAbout = yield cadesplugin.CreateObjectAsync("CAdESCOM.About");
        yield oStore.Open(CAPICOM_CURRENT_USER_STORE, CAPICOM_MY_STORE,
                CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED);
        var oVersion= yield oAbout.CSPVersion(ProviderName, parseInt(ProviderType, 10));
        var Version = yield oVersion.toString();
        console.log(Version);
        var CertificatesObj = yield oStore.Certificates;
        var oCertificate = yield CertificatesObj.Item(1);
        var sName = yield oCertificate.GetInfo(6);
        var sThumb = yield oCertificate.Thumbprint;   
                
        AddDebtorComponent.prototype.dialogEDS_Show(sName, sThumb);
    });
});