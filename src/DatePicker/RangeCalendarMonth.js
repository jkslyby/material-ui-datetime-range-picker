import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {dateBordersRange, isBetweenDates, isEqualDate} from './dateUtils';
import DayButton from './DayButton';

import {
  closestRangeAfterStart,
  isAfterDate,
  isBeforeDate,
  isDateInRanges,
} from './dateUtils';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    fontWeight: 400,
    height: 228,
    lineHeight: 2,
    position: 'relative',
    textAlign: 'center',
    MozPaddingStart: 0,
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 34,
    marginBottom: 2,
  },
};

class RangeCalendarMonth extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    autoOk: PropTypes.bool,
    blockedDateTimeRanges: PropTypes.array,
    calendarDateWidth: PropTypes.string,
    dayButtonSize: PropTypes.string,
    displayDate: PropTypes.object.isRequired,
    edit: PropTypes.string.isRequired,
    end: PropTypes.object.isRequired,
    firstDayOfWeek: PropTypes.number,
    locale: PropTypes.string.isRequired,
    onTouchTapDay: PropTypes.func,
    start: PropTypes.object.isRequired,
    utils: PropTypes.object.isRequired,
  };

  isSelectedDateDisabled() {
    return this.selectedDateDisabled;
  }

  handleTouchTapDay = (event, date) => {
    if (this.props.onTouchTapDay) {
      this.props.onTouchTapDay(event, date);
    }
  };

  getMinDate() {
    return this.props[this.props.edit].minDate || this.props.utils.addYears(new Date(), -100);
  }

  getMaxDate() {
    return this.props[this.props.edit].maxDate || this.props.utils.addYears(new Date(), 100);
  }

  disableDaysForBlockedDateTimeRanges(day) {
    const ranges = this.props.blockedDateTimeRanges;
    if (this.props.edit === 'start') {
      return (isBeforeDate(day, new Date()) || isDateInRanges(ranges, day));
    } else {
      const selectedStartDate = this.props.start.selectedDate;
      const closestRange = closestRangeAfterStart(ranges, selectedStartDate);

      if (closestRange) {
        return isBeforeDate(day, selectedStartDate) || isAfterDate(day, closestRange.start);
      } else {
        return isBeforeDate(day, selectedStartDate);
      }
    }
  }

  shouldDisableDate(day) {
    if (day === null) return false;
    let disabled = !isBetweenDates(day, this.getMinDate(), this.getMaxDate());
    if (!disabled && this.props.start.selectedDate && this.props.edit === 'end' &&
      isBeforeDate(day, this.props.start.selectedDate)) disabled = true;
    if (!disabled) disabled = this.disableDaysForBlockedDateTimeRanges(day);
    if (!disabled && this.props[this.props.edit].shouldDisableDate)
      disabled = this.props[this.props.edit].shouldDisableDate(day, this.props.start.selectedDate);

    return disabled;
  }

  hasBlockedTime(day) {
    const ranges = this.props.blockedDateTimeRanges;
    if (day === null) return false;
    return dateBordersRange(ranges, day);
  }

  dateInRange(day) {
    const {
      end,
      start,
    } = this.props;
    if (day && start.selectedDate && end.selectedDate) {
      return isBetweenDates(day, start.selectedDate, end.selectedDate);
    }
    return false;
  }

  getWeekElements() {
    const {edit, start} = this.props;
    const weekArray = this.props.utils.getWeekArray((this.props[edit].displayDate ?
      this.props[edit].displayDate : start.displayDate), this.props.firstDayOfWeek);

    return weekArray.map((week, i) => {
      return (
        <div key={i} style={styles.week}>
          {this.getDayElements(week, i)}
        </div>
      );
    }, this);
  }

  getDayElements(week, i) {
    const {
      DateTimeFormat,
      blockedDateTimeRanges, // eslint-disable-line no-unused-vars
      calendarDateWidth,
      dayButtonSize,
      edit, // eslint-disable-line no-unused-vars
      end, // eslint-disable-line no-unused-vars
      locale,
      start, // eslint-disable-line no-unused-vars
    } = this.props;

    return week.map((day, j) => {
      const isStartDate = isEqualDate(this.props.start.selectedDate, day);
      const isEndDate = (isEqualDate(this.props.end.selectedDate, day) ||
        (isStartDate && !this.props.end.selectedDate));
      const isSameDate = (isStartDate || isEndDate);
      const disabled = this.shouldDisableDate(day);
      const selected = !disabled && isSameDate;
      const isBetweenDates = this.dateInRange(day);
      const containsBlockedTime = this.hasBlockedTime(day);

      if (isSameDate) {
        this.selectedDateDisabled = disabled;
      }
      return (
        <DayButton
          DateTimeFormat={DateTimeFormat}
          locale={locale}
          calendarDateWidth={calendarDateWidth}
          date={day}
          dayButtonSize={dayButtonSize}
          disabled={disabled}
          isBetweenDates={isBetweenDates}
          containsBlockedTime={containsBlockedTime}
          isEndDate={isEndDate}
          isStartDate={isStartDate}
          key={`db${(i + j)}`}
          onClick={this.handleTouchTapDay.bind(this)}
          selected={selected}
        />
      );
    }, this);
  }

  render() {
    return (
      <div style={styles.root}>
        {this.getWeekElements()}
      </div>
    );
  }
}

export default RangeCalendarMonth;
