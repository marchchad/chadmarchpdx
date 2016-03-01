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
module.exports = {
  formatDate: function (value) {
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
    var diff = Math.abs(new Date(+d1).setHours(12) - new Date(+d0).setHours(12));

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