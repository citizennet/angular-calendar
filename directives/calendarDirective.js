angular.module('cn.calendar')
    .directive('calendarCard', ['VENDOR_BASE_URL', function(VENDOR_BASE_URL) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          calendar: '='
        },
        templateUrl: VENDOR_BASE_URL + 'angular-calendar/partials/calendar.html',
        controller: 'CalendarController'
      };
    }]);