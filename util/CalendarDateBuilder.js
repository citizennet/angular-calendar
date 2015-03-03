/**
 * User: Lee Leathers
 * Date: 12/12/13
 * Time: 3:38 PM
 */

var CalendarDateBuilder = {
  toString: function() {
    if(!window.canvasContainerController) {
      return 'Lifetime';
    }

    var dates = window.canvasContainerController.dates();

    if (dates.preset) {
      switch (dates.preset) {
        case 'lifetime':
          return 'Lifetime';
        case 'ytd':
          return 'Year to Date';
        case 'quarter':
          return 'This Quarter';
        case 'month':
          return 'This Month';
        case '28d':
          return 'Last 28 Days';
        case '14d':
          return 'Last 14 Days';
        case '7d':
          return 'Last 7 Days';
        case 'today':
          return 'Today';
      }
    }
    else if(dates.start && dates.stop)
      return moment(dates.start).format("MMM Do") + ' - ' + moment(dates.stop).format("MMM Do");
    else if(dates.start)
      return  moment(dates.start).format("MMM Do") + ' - ' + moment().format("MMM Do");
    else if(dates.stop)
      return  'Up until ' + moment(dates.stop).format("MMM Do");

    return 'Lifetime';
  },

  fromPreset: function(preset, lifetimeDates) {
    var start,
        stop = moment(new Date()).endOf('day').toDate(),
        year = new Date().getFullYear(),
        month = new Date().getMonth(),
        lifetimeStart = new Date(lifetimeDates.start_date),
        lifetimeStop = new Date(lifetimeDates.stop_date);

    switch (preset) {
      case 'lifetime':
        start = lifetimeStart;
        stop = lifetimeStop;
        break;
      case 'ytd':
        start = new Date(year, 0, 1);
        break;
      case 'quarter':
        var quarter = (new Date().getMonth() + 1) / 12;
        if (quarter <= 0.25) start = new Date(year, 0, 1);
        else if (quarter <= 0.5) start = new Date(year, 3, 1);
        else if (quarter <= 0.75) start = new Date(year, 6, 1);
        else start = new Date(year, 9, 1);
        break;
      case 'month':
        start = new Date(year, month, 1);
        break;
      case '28d':
        start = moment(new Date().setDate(new Date().getDate() - 28)).startOf('day').toDate();
        break;
      case '14d':
        start = moment(new Date().setDate(new Date().getDate() - 14)).startOf('day').toDate();
        break;
      case '7d':
        start = moment(new Date().setDate(new Date().getDate() - 7)).startOf('day').toDate();
        break;
      case 'today':
        start = moment(new Date()).startOf('day').toDate();
        break;
    }

    /** if start/stop dates fall outside of lifetime, set them accordingly **/
    if (start < lifetimeStop && stop > lifetimeStop) {
      stop = lifetimeStop;
    }
    if (start < lifetimeStart) {
      start = lifetimeStart;
    }

    return { start: start, stop: stop };
  },

  applyToDom: function() {
    $("#calendar-controls a span").html(this.toString());
  },

  getDisabledPresets: function(lifetimeDates) {
    var presets = ['ytd', 'quarter', 'month', '28d', '14d', '7d', 'today'];
    var disabledPresets = [];

    presets.forEach(function(preset) {
      var dates = this.fromPreset(preset, lifetimeDates);
      if (dates.start > lifetimeDates.stop_date || dates.stop < lifetimeDates.start_date) {
        disabledPresets.push(preset);
      }
    });

    return disabledPresets;
  }
}