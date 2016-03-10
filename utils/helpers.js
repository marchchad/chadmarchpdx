"use strict"

var FullMonthMapAsString = {
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

var ShortMonthMapAsString = {
  '1': 'Jan',
  '2': 'Feb',
  '3': 'Mar',
  '4': 'Apr',
  '5': 'May',
  '6': 'Jun',
  '7': 'Jul',
  '8': 'Aug',
  '9': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
};

function twoDigits(d) {
  if (0 <= d && d < 10) {
    return "0" + d.toString();
  }
  else if (-10 < d && d < 0) {
    return "-0" + (-1 * d).toString();
  }
  return d.toString();
}

var mysqlDatePattern = new RegExp(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/);

module.exports = {
  CheckDateFormat: function (value) {
    return mysqlDatePattern.test(value);
  },
  
  formatDateForInsert: function (value) {
    if (typeof value === "string") {
      value = new Date(value);
    }
    return value.getUTCFullYear() + "-" + twoDigits(1 + value.getUTCMonth()) + "-" + twoDigits(value.getUTCDate()) + " " + twoDigits(value.getUTCHours()) + ":" + twoDigits(value.getUTCMinutes()) + ":" + twoDigits(value.getUTCSeconds());
  },
  
  formatDateForDisplay: function (value) {
    if (!value) {
      return;
    }
    var date = new Date(value);
    var day = date.getDate().toString();
    var month = (date.getMonth() + 1).toString();
    return [date.getFullYear(), (month.length === 1 ? "0" + month : month), (day.length === 1 ? "0" + day : day)].join("-");
  },

  dateDiff: function (d0, d1) {
    /**
     * Returns the difference between the two dates in a text form.
     * The order in which they're provided does not matter.
     * 
     * @param {Date} d0 - One of the date objects to diff
     * @param {Date} d1 - The other date objects to diff
     * 
     * @returns {string}
     */
    if (!d0 || !d1) {
      return;
    }
    
    d0 = typeof d0 === "string" || typeof d0 === "number " ? new Date(d0) : d0;
    d1 = typeof d1 === "string" || typeof d1 === "number " ? new Date(d1) : d1;
    
    // Technically the d0/ can be in any order since we're taking the absolute value
    var diff = Math.abs(d1 - d0);

    var seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return [seconds, "seconds", "ago"].join(" ");
    }

    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return [minutes, "minutes", "ago"].join(" ");
    }

    var hours = Math.floor(minutes / 60);
    if (hours < 24) {
      var text = hours === 1 ? "hour" : "hours";
      return [hours, text, "ago"].join(" ");
    }

    var days = Math.floor(hours / 24);
    var text = days === 1 ? "day" : "days";
    return [days, text, "ago"].join(" ");
  },
  getDateParts: function (dateString) {
    if (!dateString) {
      return;
    }
    var date = new Date(dateString);
    return {
      'month': ShortMonthMapAsString[date.getMonth() + 1],
      'day': date.getDay(),
      'year': date.getFullYear() 
    }
  }
};