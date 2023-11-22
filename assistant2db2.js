//OCT func before modif
 //Ver 10: Updated qrys for new data tables using DBGID and GBG
    var ibmdb = require('ibm_db');
/**
  * Based on Code by Henrik Loeser, IBM
  * Written by TechSales America, Brandon Swink Team Leader
  * https://console.bluemix.net/docs/tutorials/sql-database.html
  */
//======================================================================================================================================================================
//CUSOTMER QUERY
function queryByCustomer(dsn, cust_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    
    //var data=conn.querySync("SELECT CUSTOMER_NAME,IBM_CUST__NUMBER,SITE_ID, CITY, STATE___PROVINCE FROM INTERNDEMO.ENTITLEMENTS_OCTOBER where (ucase(CUSTOMER_NAME) LIKE concat(?,'%'))",[cust_name]);
    var data=conn.querySync("SELECT ACCOUNT_NAME, ACCT_DEF, ACCT_ID, GBG, GBG_NAME, DBG, DBG_NAME, DCID, DCID_NAME FROM INTERNDEMO.US_NATIONAL_ACCOUNTS WHERE (ucase(ACCOUNT_NAME) LIKE concat(?,'%'))",[cust_name]);
    conn.closeSync();
    var resString="Customer Name: " + cust_name + "\n-----------------------";
    resString+="\n-----------------------";

    if (data.length === 0) {
      resString += "\nNo Results Found for Customer Name: " + cust_name;
    }
    else {
      for (var i=0;i<data.length;i++) {
        resString+="\n\nCustomer Site #"+(i+1)+ "\nCustomer Name: " + data[i]['ACCOUNT_NAME']+"\nGlobal Buying Group: "+data[i]['GBG_NAME']+"\nDomestic Client ID: "+data[i]['DCID']+"\n";
        resString+="\n-----------------------";
          
        }
    }

    return {result : "Customer Information:", resString, data:data, cust_name:cust_name, e:0};


    } catch (e) {
        return {result : "No Results Found", data:data, cust_name:cust_name, e:e}
 }
}
//======================================================================================================================================================================
//RDC QUERY
function queryDCID(dsn, dcid, cust_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    var data=conn.querySync("SELECT IOT_ID, IOT_NAME, RPT_TO_IMT_ID, RPT_TO_IMT_NAME, SALES_GROUP, SALES_GROUP_NAME, BRANCH_ID, BRANCH_NAME, SUB_BRANCH_ID, SUB_BRANCH_NAME, TERRITORY_ID, TERRITORY_NAME, RPT_SECTOR_CODE, RPT_SECTOR_NAME, CLIENT_SEGMENT, COVERAGE_TYPE, COV_ID, COVERAGE_ID, COV_NAME, GBL_ULT_CLIENT_ID, GBL_ULT_CLIENT_NAME, GBL_CLIENT_ID, GBL_CLIENT_NAME, DOM_CLIENT_ID, DOM_CLIENT_NAME, GBL_BUY_GRP_ID, GBL_BUY_GRP_NAME, DOM_BUY_GRP_ID, DOM_BUY_GRP_NAME, ENTERPRISE_NO, IBM_CUSTOMER__, SAP_CUSTOMER_NO, CUST_NAME, CUST_NAME_2, CUST_NAME_3, STREET_ADDRESS, CUST_CITY, CUST_COUNTY_CODE, CUST_STATE_PROV, CUST_POSTAL_CODE, ISO_COUNTRY_CODE, ISO_COUNTRY_NAME, SECURITY_CLASS_CODE, ACTIVE_STATUS_INDC, RECD_LAST_UPDT_DATE FROM INTERNDEMO.RDC WHERE DOM_CLIENT_ID =?",[dcid]);
    conn.closeSync();
    var gbgname = data[0]['GBL_BUY_GRP_NAME'];
    var gbgnum = data[0]['GBL_BUY_GRP_ID'];
    var covname = data[0]['COV_NAME'];
    var resString="\nResults for Customer Name:"+ cust_name  + ";" + "\nDomestic ID: " + dcid + "\n" + "List of Customer Numbers Below: \n";
    resString+="\n~\n";
    for (var i=0;i<data.length;i++) {
      resString+="Name:"+data[i]['CUST_NAME']+"\nGBG Name:"+data[i]['GBL_BUY_GRP_NAME']+"\nGBG #:"+data[i]['GBL_BUY_GRP_ID']+"\nCustomer Number: "+data[i]['IBM_CUSTOMER__']+"\nCity: "+data[i]['CUST_CITY']+ "\nState: " + data[i]['CUST_STATE_PROV'] +"\n\n";
      resString+="\n~\n";
    }
    return {result : "Customer Number Search:", resString, data:data, dcid:dcid, cust_name:cust_name, gbgname:gbgname, gbgnum:gbgnum, covname:covname, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, dcid:dcid, cust_name:cust_name, e:e}
 }
}
//======================================================================================================================================================================
//ENTITLEMENT QUERY
function queryEntitlements(dsn, gbg_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    var data=conn.querySync("SELECT IBM_CUST__NUMBER, PID_NAME , SUBSCRIPTION_NAME , LICENSE_QTY, ACTIVE_S_S_QTY, S_S_STATUS, ACTIVE_S_S_END_DATE, START_DATE, END_YEAR, END_QTR FROM INTERNDEMO.ENTITLEMENTS_OCTOBER WHERE (GLOBAL_BUYING_GROUP_NAME =? AND S_S_STATUS ='ACTV')",[gbg_name]);
    conn.closeSync();
    var resString="Results for Customer #:"+ data[0]['IBM_CUST__NUMBER'] +" Click Here to see FastPASS: <https://fastpass.w3cloud.ibm.com/sales/fastpass/search/EntitlementSearchServlet?cust_name=&ibmcustomernum=" + data[0]['IBM_CUST__NUMBER'] + "&postal_code=&contractnum=&customernum=&programselection=PA&programselection=PX&ibm-submit=Search> \n" + "List of Entitlements Below: \n";
    resString+="\n~\n";
    for (var i=0;i<data.length;i++) {
      resString+="PID Name: "+data[i]['PID_NAME']+"\nSubscription Name: "+data[i]['SUBSCRIPTION_NAME']+ "\nStart Date: " + data[i]['START_DATE'] +"\nEnd Year: "+data[i]['END_YEAR']+"  End Qtr: "+data[i]['END_QTR']+"\n\n";
      resString+="\n~\n"; 
        
    }
    return {result : "Customer Entitlement Information:", resString, data:data, gbg_name:gbg_name, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, gbg_name:gbg_name, e:e}
 }
}
//======================================================================================================================================================================
//OPEN CASES QUERY
function queryOpenCases(dsn, gbg_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    var data=conn.querySync("SELECT COVERAGE_NAME, GLOBAL_BUYING_GROUP_ID, GLOBAL_BUYING_GROUP_NAME, CUSTOMER_NUMBER, CUSTOMER_NAME, IS_CRITICAL_SITUATION, SEVERITY, CASE_VIEWER_LINK, CASE_NUMBER, OPEN_DATE, CLOSE_DATE, OPEN_DAYS, MODIFIED_DATE, STATUS, UT_15_NAME, PRODUCT_NAME, BRANCH_NAME FROM INTERNDEMO.OPEN_CASES WHERE (GLOBAL_BUYING_GROUP_NAME =?) ORDER BY SEVERITY",[gbg_name]) ;
    conn.closeSync();
    var resString="Results for Customer Name:"+ data[0]['CUSTOMER_NAME'] + "\n";

    
    for (var i=0;i<data.length;i++) {
      resString+="\n~\n";
      resString+= data[i]['SEVERITY']+"\n Product Name: "+data[i]['PRODUCT_NAME']+"\nStatus: " + data[i]['STATUS'] + "\nDate Opened: " + data[i]['OPEN_DATE'] + "\n Case Number: <https://w3.ibm.com/tools/caseviewer/case/"+data[i]['CASE_NUMBER']+"\n\n";
      
    }


    return {result : "Customer Open Case Information:", resString, data:data, gbg_name:gbg_name, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, resString:"\n\n Currently, there are no new open cases for this customer", gbg_name:gbg_name, e:e }
 }
}
//======================================================================================================================================================================
//Closed CASES QUERY
function queryClosedCases(dsn, gbg_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    var data=conn.querySync("SELECT CUSTOMER_NAME , IBM_PRODUCT_NAME, PRODUCT_VERSION, CASE_NUMBER, CONTACT_NAME__FULL_NAME, CONTACT_EMAIL, CONTACT_PHONE_NUMBER, DATETIMEOPENED, DAYSOPEN, DATETIMECLOSED, STATUS, SEVERITY_LEVEL FROM INTERNDEMO.SUPPORT_OCTOBER WHERE (GLOBAL_BUYING_GROUP_NAME =? AND (STATUS LIKE 'Closed - Archived' OR STATUS LIKE 'Closed by Client')) ORDER BY SEVERITY_LEVEL LIMIT 5",[gbg_name]);
    // Below is for open Cases
    //var data=conn.querySync("SELECT CUSTOMER_NAME , IBM_PRODUCT_NAME, PRODUCT_VERSION, CASE_NUMBER, CONTACT_NAME__FULL_NAME, CONTACT_EMAIL, CONTACT_PHONE_NUMBER, DATETIMEOPENED, DAYSOPEN, SEVERITY_LEVEL FROM INTERNDEMO.SUPPORT_CASES WHERE (IBM_CUST__NUMBER =?)",[cust_num]);
    conn.closeSync();
    var resString="Results for Customer Name:"+ data[0]['CUSTOMER_NAME'] + "\n";
    
    
    for (var i=0;i<data.length;i++) {
      resString+="\n~\n";
      resString+=data[i]['SEVERITY_LEVEL']+"\n Product Name: "+data[i]['IBM_PRODUCT_NAME']+"\n Product Version: "+data[i]['PRODUCT_VERSION']+ "\nStatus: " + data[i]['STATUS'] + "\nDate Opened: " + data[i]['DATETIMEOPENED']+ "\nDate Closed: " + data[i]['DATETIMECLOSED'] + "\n Case Number: https://w3.ibm.com/tools/caseviewer/case/"+data[i]['CASE_NUMBER']+"\n Contact Name: "+data[i]['CONTACT_NAME__FULL_NAME']+"\n Contact Email: "+data[i]['CONTACT_EMAIL']+ "\n";
    }
  
    return {result : "Customer Closed Case Information:", resString, data:data, gbg_name:gbg_name, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, resString:"\n\n Currently, there are no closed cases for this customer", gbg_name:gbg_name, e:e}
 }
}
//======================================================================================================================================================================
function queryCookSecurity(dsn, dcid) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    var data=conn.querySync("SELECT ACCOUNT_NAME, GBG_NAME, TECH_CLIENT_OR_WHITE_SPACE, BRANCH_NAME, SUB_INDUSTRY, INDUSTRY, SECURITY_QUADRANT, SECURITY_SERVICES, ADVANCED_FRAUD_PROTECTION_PORTFOLIO, APPLICATION_SECURITY_PORTFOLIO, DATA_SECURITY_PORTFOLIO, IDENTITY_AND_ACCESS_MANAGEMENT_PORTFOLIO, MOBILE_SECURITY_AND_MANAGEMENT_PORTFOLIO, SECURITY_THREAT_MANAGEMENT_INFRASTRUCTURE_PORTFOLIO, SECURITY_THREAT_MANAGEMENT_PORTFOLIO, EMPLOYEES, EMPLOYEE_RANGE, ANNUAL_SALES, ANNUAL_SALES_RANGE, IT_SPEND_ESTIMATE, IT_SPEND_RANGE, COMPANY_SIZE, CITY, STATE, SECURITY_1H23, SECURITY_2022, SECURITY_2021, SECURITY_2020, Z_INSTALL, CLOUD_PAK_FOR_SECURITY, DISCOVER_AND_CLASSIFY, GUARDIUM_DATA_ENCRYPTION, GUARDIUM_DATA_PROTECTION, GUARDIUM_INSIGHTS, GUARDIUM_KEY_LIFECYCLE_MANAGEMENT, I2_INTELLIGENCE_ANALYSIS, IDENTITY_GOVERNANCE_AND_ADMINISTRATION, MAAS360, PRIVILEGED_ACCESS_MANAGEMENT, QRADAR_ON_CLOUD, QRADAR_SIEM, REAQTA, SECURITY_NETWORK_PROTECTION, SECURITY_ORCHESTRATION_AND_RESPONSE, SECURITY_VERIFY_ON_CLOUD, TRUSTEER_FRAUD_PROTECTION, WATSON_FOR_CYBERSECURITY, XFORCE_THREAT_INTELLIGENCE, ZSYSTEMS_SECURITY, TOTAL_INSTALLED_DIGITAL_SECURITY_PRODUCTS, SECURITY_PRODUCTS, AMAZON_WEB_SERVICES_INSTALL, GOOGLE_CLOUD_INSTALL, MICROSOFT_AZURE_INSTALL FROM INTERNDEMO.COOK_OCTOBER WHERE DCID =?",[dcid]);
    conn.closeSync();
    var resString="Results for Customer Name: "+ data[0]['ACCOUNT_NAME'] + "\n~";
    
    for (var i=0;i<data.length;i++) {
      resString+="\nCity: "+data[i]['CITY']+"\n State: "+data[i]['STATE']+"\n Existing or Whitespace: "+data[i]['TECH_CLIENT_OR_WHITE_SPACE']+"\n Branch Name: "+data[i]['BRANCH_NAME']+"\n Sub Industry: "+data[i]['SUB_INDUSTRY']+"\n Industry: "+data[i]['INDUSTRY']+"\n Security Quadrant: "+data[i]['SECURITY_QUADRANT']+"\nAnnual Sales: $"+ data[i]['ANNUAL_SALES']+"\n Sec 22: "+data[i]['SECURITY_2022']+"\n Sec 21: "+data[i]['SECURITY_2021'] + "\n~";      
      resString+="\nSecurity Services: "+data[i]['SECURITY_SERVICES']+"\n Advanced Fraud Prot Port: "+data[i]['ADVANCED_FRAUD_PROTECTION_PORTFOLIO']+"\n App Sec Port: "+data[i]['APPLICATION_SECURITY_PORTFOLIO']+"\n Data Sec Port: "+data[i]['DATA_SECURITY_PORTFOLIO']+"\n ID & Access Mgmt Port: "+data[i]['IDENTITY_AND_ACCESS_MANAGEMENT_PORTFOLIO']+"\n Mobile Sec & Mgmt Port: "+data[i]['MOBILE_SECURITY_AND_MANAGEMENT_PORTFOLIO']+"\n Sec Threat Mgmt Infra Port: "+data[i]['SECURITY_THREAT_MANAGEMENT_INFRASTRUCTURE_PORTFOLIO']+"\n Sec Threat Mgmt Port: "+data[i]['SECURITY_THREAT_MANAGEMENT_PORTFOLIO']+"\n~" + "\n Competitor Installs: ";

      // if statements below remove nulls
      const pieces = [];
      
      if (data[i]['Z_INSTALL'] !== null && data[i]['Z_INSTALL'] !== "N") {
        pieces.push("\nZ Install: " + data[i]['Z_INSTALL']);
      }
      
      if (data[i]['DB2']) {
        pieces.push("\nDb2: " + data[i]['DB2']);
      }
      
      if (data[i]['ACCESS_MANAGEMENT']) {
        pieces.push("\nAccess Mgmt: " + data[i]['ACCESS_MANAGEMENT']);
      }
      
      if (data[i]['CLOUD_PAK_FOR_SECURITY']) {
        pieces.push("\nCP4Sec: " + data[i]['CLOUD_PAK_FOR_SECURITY']);
      }
      
      if (data[i]['DISCOVER_AND_CLASSIFY']) {
        pieces.push("\nDisc & Classfy: " + data[i]['DISCOVER_AND_CLASSIFY']);
      }
      
      if (data[i]['GUARDIUM_DATA_ENCRYPTION']) {
        pieces.push("\nGuardium DE: " + data[i]['GUARDIUM_DATA_ENCRYPTION']);
      }
      
      if (data[i]['GUARDIUM_DATA_PROTECTION']) {
        pieces.push("\nGuardium DP: " + data[i]['GUARDIUM_DATA_PROTECTION']);
      }
      
      if (data[i]['GUARDIUM_INSIGHTS']) {
        pieces.push("\nGuardium Insights: " + data[i]['GUARDIUM_INSIGHTS']);
      }
      
      if (data[i]['GUARDIUM_KEY_LIFECYCLE_MANAGEMENT']) {
        pieces.push("\nGuardium LM: " + data[i]['GUARDIUM_KEY_LIFECYCLE_MANAGEMENT']);
      }
      
      if (data[i]['I2_INTELLIGENCE_ANALYSIS']) {
        pieces.push("\nGuardium I2 IA: " + data[i]['I2_INTELLIGENCE_ANALYSIS']);
      }
      
      if (data[i]['IDENTITY_GOVERNANCE_AND_ADMINISTRATION']) {
        pieces.push("\nIdent Gov & Admin: " + data[i]['IDENTITY_GOVERNANCE_AND_ADMINISTRATION']);
      }
      
      if (data[i]['MAAS360']) {
        pieces.push("\nMaaS360: " + data[i]['MAAS360']);
      }
      
      if (data[i]['PRIVILEGED_ACCESS_MANAGEMENT']) {
        pieces.push("\nPriv Access Mgmt: " + data[i]['PRIVILEGED_ACCESS_MANAGEMENT']);
      }
      
      if (data[i]['QRADAR_ON_CLOUD']) {
        pieces.push("\nQradar Cloud: " + data[i]['QRADAR_ON_CLOUD']);
      }
      
      if (data[i]['QRADAR_SIEM']) {
        pieces.push("\nQradar SIEM: " + data[i]['QRADAR_SIEM']);
      }
      
      if (data[i]['REAQTA']) {
        pieces.push("\nREAQTA: " + data[i]['REAQTA']);
      }
      
      if (data[i]['SECURITY_NETWORK_PROTECTION']) {
        pieces.push("\nSec Net Prot: " + data[i]['SECURITY_NETWORK_PROTECTION']);
      }
      
      if (data[i]['SECURITY_ORCHESTRATION_AND_RESPONSE']) {
        pieces.push("\nSec Orch: " + data[i]['SECURITY_ORCHESTRATION_AND_RESPONSE']);
      }
      
      if (data[i]['SECURITY_VERIFY_ON_CLOUD']) {
        pieces.push("\nSec Verify Cloud: " + data[i]['SECURITY_VERIFY_ON_CLOUD']);
      }
      
      if (data[i]['TRUSTEER_FRAUD_PROTECTION']) {
        pieces.push("\nTrusteer Fraud Prot: " + data[i]['TRUSTEER_FRAUD_PROTECTION']);
      }
      
      if (data[i]['WATSON_FOR_CYBERSECURITY']) {
        pieces.push("\nWatson Cyber: " + data[i]['WATSON_FOR_CYBERSECURITY']);
      }
      
      if (data[i]['XFORCE_THREAT_INTELLIGENCE']) {
        pieces.push("\nXforce Threat: " + data[i]['XFORCE_THREAT_INTELLIGENCE']);
      }
      
      if (data[i]['ZSYSTEMS_SECURITY']) {
        pieces.push("\nZSystem Sec: " + data[i]['ZSYSTEMS_SECURITY']);
      }
      
      if (data[i]['AMAZON_WEB_SERVICES_INSTALL']) {
        pieces.push("\nAWS: " + data[i]['AMAZON_WEB_SERVICES_INSTALL']);
      }
      
      if (data[i]['GOOGLE_CLOUD_INSTALL']) {
        pieces.push("\nGoogle: " + data[i]['GOOGLE_CLOUD_INSTALL']);
      }
      
      if (data[i]['MICROSOFT_AZURE_INSTALL']) {
        pieces.push("\nAzure: " + data[i]['MICROSOFT_AZURE_INSTALL']);
      }
    
      resString += pieces.join('\n');
    }

    return {result : "Customer Details:", resString, data:data, dcid:dcid, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, dcid:dcid, e:e}
 }
}
//======================================================================================================================================================================
/**
//ZoomInfo QUERY
function queryZoom(dsn, contact_fname, contact_lname, cust_name) { 
 try {    
    var conn=ibmdb.openSync(dsn);
    
  //  var data=conn.querySync("SELECT ZOOMINFO_CONTACT_ID, LAST_NAME, FIRST_NAME, MIDDLE_NAME, SALUTATION, SUFFIX, JOB_TITLE, JOB_FUNCTION, MANAGEMENT_LEVEL, COMPANY_DIVISION_NAME, DIRECT_PHONE_NUMBER, EMAIL_ADDRESS, EMAIL_DOMAIN, DEPARTMENT, MOBILE_PHONE, CONTACT_ACCURACY_SCORE, CONTACT_ACCURACY_GRADE, ZOOMINFO_CONTACT_PROFILE_URL, LINKEDIN_CONTACT_PROFILE_URL, NOTICE_PROVIDED_DATE, PERSON_STREET, PERSON_CITY, PERSON_STATE, PERSON_ZIP_CODE, COUNTRY, ZOOMINFO_COMPANY_ID, COMPANY_NAME, WEBSITE, FOUNDED_YEAR, COMPANY_HQ_PHONE, FAX, TICKER, REVENUE__IN_000S_USD_, REVENUE_RANGE__IN_USD_, EMPLOYEES, EMPLOYEE_RANGE, SIC_CODE_1, SIC_CODE_2, SIC_CODES, NAICS_CODE_1, NAICS_CODE_2, NAICS_CODES, PRIMARY_INDUSTRY, PRIMARY_SUB_INDUSTRY, ALL_INDUSTRIES, ALL_SUB_INDUSTRIES, INDUSTRY_HIERARCHICAL_CATEGORY, SECONDARY_INDUSTRY_HIERARCHICAL_CATEGORY, ALEXA_RANK, ZOOMINFO_COMPANY_PROFILE_URL, LINKEDIN_COMPANY_PROFILE_URL, FACEBOOK_COMPANY_PROFILE_URL, TWITTER_COMPANY_PROFILE_URL, OWNERSHIP_TYPE, BUSINESS_MODEL, CERTIFIED_ACTIVE_COMPANY, CERTIFICATION_DATE, TOTAL_FUNDING_AMOUNT__IN_000S_USD_, RECENT_FUNDING_AMOUNT__IN_000S_USD_, RECENT_FUNDING_ROUND, RECENT_FUNDING_DATE, RECENT_INVESTORS, ALL_INVESTORS, COMPANY_STREET_ADDRESS, COMPANY_CITY, COMPANY_STATE, COMPANY_ZIP_CODE, COMPANY_COUNTRY, FULL_ADDRESS, NUMBER_OF_LOCATIONS, QUERY_NAME FROM INTERNDEMO.ZOOMINFO WHERE (upper(LAST_NAME) = upper(?) AND upper(FIRST_NAME) = upper(?) AND (upper(COMPANY_NAME) LIKE concat(upper(?),'%')))",[contact_fname, contact_lname, cust_name]);
    var data=conn.querySync("SELECT * FROM INTERNDEMO.ZOOMINFO WHERE upper(LAST_NAME) = upper(?) AND upper(COMPANY_NAME) LIKE concat(upper(?), '%')",[contact_lname,cust_name]);
    conn.closeSync();
    var resString="Results for Contact Name: "+ contact_lname +" at "+ cust_name +"\n";
    for (var i=0;i<data.length;i++) {
      resString+="First Name: "+data[i]['FIRST_NAME']+"\n Last Name: "+data[i]['LAST_NAME']+"\n Job Title: "+data[i]['JOB_TITLE']+"\n Job Function: "+data[i]['JOB_FUNCTION']+"\n Management Level: "+data[i]['MANAGEMENT_LEVEL']+"\n Company Division: "+data[i]['COMPANY_DIVISION_NAME']+"\n Direct Phone Number: "+data[i]['DIRECT_PHONE_NUMBER']+"\n Email : "+data[i]['EMAIL_ADDRESS']+"\n City & State: "+data[i]['PERSON_CITY']+","+data[i]['PERSON_STATE']+"\n ZoomInfo URL: "+data[i]['ZOOMINFO_CONTACT_PROFILE_URL']+"\n LinkedIN URL: "+data[i]['LINKEDIN_CONTACT_PROFILE_URL']+"\n";
    }
    return {result : "Contact Research:", resString, data:data, cust_name:cust_name, contact_fname:contact_fname, contact_lname:contact_lname, e:0};
 } catch (e) {
     return {result : "No Results Found", data:data, ccust_name:cust_name, e:e}
 }
}

*/
//======================================================================================================================================================================
/**
  * Bind query parameter and dashDB (Db2 Warehouse on Cloud) credentials
  *
  */
function main(params) {
  dsn=params.__bx_creds[Object.keys(params.__bx_creds)[0]].dsn;
  
  // dsn does not exist in the DB2 credential for Standard instance. It must be built manually
  if(!dsn) {
    const dbname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.database;
    const hostname = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].hostname;
    const port = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.hosts[0].port;
    const protocol = 'TCPIP';
    const uid = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.username;
    const password = params.__bx_creds[Object.keys(params.__bx_creds)[0]].connection.db2.authentication.password;
    
    //dsn="DATABASE=;HOSTNAME=;PORT=;PROTOCOL=;UID=;PWD=;Security=SSL";
    dsn = `DATABASE=${dbname};HOSTNAME=${hostname};PORT=${port};PROTOCOL=${protocol};UID=${uid};PWD=${password};Security=SSL`;

  }
  
  // switch between search types
  switch(params.actionname) {
        case "queryByCustomer":
            return queryByCustomer(dsn,params.cust_name);
        case "queryDCID":
            return queryDCID(dsn,params.dcid, params.cust_name);
        case "queryEntitlements":
            return queryEntitlements(dsn,params.gbg_name);
        case "queryOpenCases":
            return queryOpenCases(dsn,params.gbg_name);
        case "queryClosedCases":
            return queryClosedCases(dsn,params.gbg_name);
        case "queryCookSecurity":
            return queryCookSecurity(dsn,params.dcid);
        //case "queryZoom":
         //   return queryZoom(dsn,params.contact_fname, params.contact_lname, params.cust_name);
        default:
            return { dberror: "Lookup action not defined", actionname: params.actionname}
    }
}