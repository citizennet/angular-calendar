/**
 * User: Lee Leathers
 * Date: 12/12/13
 * Time: 11:50 AM
 */

angular.module('cn.calendar')
    .controller('CalendarController', ['$scope', function($scope) {
      var lifetimeDates;
      MetricService.getDataSourcesDateRange().done(function(dates) {
        lifetimeDates = {
          start_date: moment(dates.start_date).startOf('day').unix() * 1000,
          stop_date: moment(dates.stop_date).endOf('day').unix() * 1000
        };
        $scope.disabledPresets = CalendarDateBuilder.getDisabledPresets(lifetimeDates);
      });

      $scope.calendarDirty = false;
      $scope.dateRange = {};
      $scope.disabledPresets = [];

      $scope.dateOptions = {
        changeMonth: true,
        changeYear: true,
        dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        monthNamesShort: ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"],
        beforeShowDay: function(date) {
          var unixDate = moment(date).unix() * 1000;
          if(unixDate > lifetimeDates.stop_date || unixDate < lifetimeDates.start_date) {
            return [false, '', ''];
          }
          else if(moment(date).unix() === moment($scope.dateRange.stop).startOf('day').unix() ||
              isLastDay(date)) {
            return [true, 'ui-state-range last-in-range', ''];
          }
          else if(date >= $scope.dateRange.start && date <= $scope.dateRange.stop) {
            return [true, 'ui-state-range', ''];
          } else {
            return [true, '', ''];
          }
        }
      };

      $scope.changeDate = function() {
        $scope.preset = null;
        $scope.calendarDirty = true;
        $('#start-date').datepicker('refresh');
        $('#stop-date').datepicker('refresh');
      };

      $scope.setPreset = function(preset) {
        $scope.preset = preset;
        setDateRange({preset: preset});
        $scope.calendarDirty = true;
        if($scope.dateRange.start > lifetimeDates.stop_date || $scope.dateRange.stop < lifetimeDates.start_date) {
          $scope.calendarDirty = false;
        }
      };

      $scope.save = function(applyNewDataDataSources) {
        var start_date = +$scope.dateRange.start,
            stop_date = moment(+$scope.dateRange.stop).endOf('day').unix() * 1000,
            preset = $scope.preset,
            dates = {};

        // if the user selected today as the stop,
        // assume they always want today as the stop date
        if(stop_date > +(new Date())) {
          stop_date = undefined;
        }

        if(stop_date && start_date > stop_date) {
          alert('Start Date cannot be after End Date', 'error');
          return;
        }

        if(preset) {
          dates.preset = preset;
        }
        else {
          dates = {
            start: start_date,
            stop: stop_date
          }
        }
        $scope.calendarDirty = false;

        $scope.close();

        canvasContainerController.dates(dates);

        CalendarDateBuilder.applyToDom();

        if(applyNewDataDataSources !== false) {
          canvasContainerController.applyNewDataSources();
        }
      };

      $scope.close = function() {
        $scope.$parent.calendarHide();
        $scope.calendarDirty = false;
      };

      $scope.reset = function() {
        var dates = canvasContainerController.dates();
        $scope.preset = dates.preset;
        $scope.calendarDirty = false;
        setDateRange(dates);
      };

      $scope.$on('calendarOpen', function() {
        var dates = window.canvasContainerController.dates();
        if(!dates.preset && !dates.start && !dates.stop) {
          dates.preset = 'lifetime';
          window.canvasContainerController.dates({preset: 'lifetime'});
        }
        $scope.preset = dates.preset;
        setDateRange(dates);
      });

      $scope.$on('calendarClose', function() {
        $scope.calendarDirty = false;
      })

      $scope.$on('newReport', function() {
        $scope.setPreset('lifetime');
        $scope.save(false);
      });

      /**
       * Sets the calendar range. If a preset is provided, get date range from that
       *
       */
      function setDateRange(dates) {
        if(dates.preset) {
          dates = CalendarDateBuilder.fromPreset(dates.preset, lifetimeDates);
        }

        $scope.dateRange = {
          start: dates.start ? new Date(dates.start) : null,
          stop: dates.stop ? new Date(dates.stop) : new Date()
        };
      }

      // helper method to check if a day is the last of the month and in the date range
      // needed to properly style the date range selection
      function isLastDay(dt) {
        var isLastDay = new Date(dt.getTime() + 86400000).getDate() === 1;
        var isInRange = dt >= $scope.dateRange.start && dt <= $scope.dateRange.stop;

        return isLastDay && isInRange;
      }

    }]);