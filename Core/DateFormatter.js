function GetDayOfWeek(date) {
  var isodate = date.toISOString();
  var newDate = new Date(isodate);
  var isodateOnly =
    newDate.getFullYear() +
    "-" +
    (newDate.getMonth() + 1) +
    "-" +
    newDate.getDate();
  var d = new Date(isodateOnly);
  var n = d.getDay();
  var dates = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dates[n];
}

function GetDateOnly(date) {
  var isodate = date.toISOString();
  var newDate = new Date(isodate);
  var isodateOnly =
    newDate.getFullYear() +
    "-" +
    (newDate.getMonth() + 1) +
    "-" +
    newDate.getDate();
  return isodateOnly;
}

module.exports = {
  GetDayOfWeek: GetDayOfWeek,
  GetDateOnly: GetDateOnly,
};
