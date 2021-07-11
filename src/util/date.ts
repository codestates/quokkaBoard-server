/* String to Date */
export const convertDate = (date: string) => {
    var yyyyMMdd = date;
    var sYear = yyyyMMdd.substring(0,4);
    var sMonth = yyyyMMdd.substring(5,7);
    var sDate = yyyyMMdd.substring(8,10);
    
    return new Date(Number(sYear), Number(sMonth)-1, Number(sDate));
}

/* Date to String */
export const convertStr = (date: Date) => {
    var sYear:string | number = date.getFullYear();
    var sMonth:string | number = date.getMonth() + 1;
    var sDate:string | number = date.getDate();

    sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
    sDate  = sDate > 9 ? sDate : "0" + sDate;
    return `${sYear}-${sMonth}-${sDate}`;
}