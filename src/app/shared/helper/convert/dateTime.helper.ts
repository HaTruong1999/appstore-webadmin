import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

export function unixTimeStamp2TimeStamp(time: number) {
  return (time / 1000).toFixed(0).toString();
}

export function dateTime2UnixTimeStamp(dateTime: Date){
  return dateTime ? new Date(dateTime).getTime() / 1000 : null
}

export function dateTime2NgbDateTime(date: Date){
  return { day: date.getDay(), month: date.getMonth(), year: date.getFullYear()};
}

export function ngbDateTime2DateTime(ngbDate: NgbDate){
  return ngbDate ? new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day) : null
}

export function ngbDateTime2UnixTimeStamp(ngbDate: NgbDate){
  return ngbDate ? dateTime2UnixTimeStamp(ngbDateTime2DateTime(ngbDate)) : null
}

export function ngbDateTime2NormalDate(ngbDate: NgbDate){
  const date = ngbDateTime2DateTime(ngbDate)
  if(!date) return null
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

export function stringDate2NgbDateTime(stringDate: string){
  if(!stringDate) return null
  const [day, month, year] = stringDate.split("/")
  return {day: parseInt(day), month: parseInt(month), year: parseInt(year)}
}

export function dateTime2StringDate(date: Date){
  if(!date) return null
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

export function dateTimeToString(date: Date){
  if(!date) return null
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  let HH = date.getHours();
  let MM = date.getMinutes();
  let ss = date.getSeconds();
  return dd + '/' + mm + '/' + yyyy + " " + HH + ":" + MM + ":" + ss;
}

export function dateTimeToJsonString(date: Date){
  if(!date) return null
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  let HH = date.getHours();
  let MM = date.getMinutes();
  let ss = date.getSeconds();
  return yyyy + '-'+ mm + '-' + dd + 'T' + HH + ":" + MM + ":" + ss;
}

export function dateTimeToJsonStringNotTime(date: Date){
  if(!date) return null
  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  let HH = date.getHours();
  let MM = date.getMinutes();
  let ss = date.getSeconds();
  return yyyy + '-'+ mm + '-' + dd + 'T00:00:00';
}

export function stringToDateTime(date: string){
  if(!date) return null
  return new Date(date);
}

export function stringToDateTime2(stringDate: string){
  try {
    if(!stringDate) return null
    let arr = stringDate.split("/");
    if(arr.length == 3)
    {
      if(parseInt(arr[0]) > 31 || parseInt(arr[1]) > 12)
        return null;
      
      const [day, month, year] = stringDate.split("/");
      return new Date(parseInt(year), parseInt(month), parseInt(day), 0, 0, 0, 0);
    }
    else
      return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}