(function($) {

  $.fn.formatDate = function(options) {
    var settings = $.extend({
      timeDataAttr : 'time',
      dateSelector : '.date',
      timeSelector : '.time'
    }, options);

    return this.each(function() {
      var date = new Date($(this).data(settings.timeDataAttr));
      $(this).find(settings.dateSelector).text(dateToShortMonth(date));
      $(this).find(settings.timeSelector).text(dateTo12HourTime(date));
    });
  };

  function dateToShortMonth(date) {
    var months = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"
    ];

    return months[date.getMonth()] + " " + date.getDate().toString();
  };

  function dateTo12HourTime(date) {
    var hours, minutes, suffix;

    hours   = date.getHours();
    minutes = date.getMinutes();

    if (hours < 12) {
      suffix = "AM";
    } else {
      hours = hours - 12;
      suffix = "PM";
    }

    if (hours === 0) {
      hours = 12;
    }

    // prepend a 0 and get last two to ensure two digits
    minutes = ("0" + minutes.toString()).slice(-2);

    return hours + ":" + minutes + " " + suffix;
  };

})(jQuery);
