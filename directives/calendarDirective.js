angular.module('cn.calendar')
    .directive('calendarCard', ['COMPONENTS_BASE_URL', function(COMPONENTS_BASE_URL) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          calendar: '='
        },
        templateUrl: COMPONENTS_BASE_URL + 'cn-calendar/partials/calendar.html',
        controller: 'CalendarController'
      };
    }]);