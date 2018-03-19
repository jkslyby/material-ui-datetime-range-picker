import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import transitions from '../styles/transitions';
import RangeCalendarMonth from './RangeCalendarMonth';
import CalendarToolbar from './CalendarToolbar';
import RangeTimePicker from './RangeTimePicker';
import SlideInTransitionGroup from '../internal/SlideIn';

import {
  defaultUtils,
  dateTimeFormat,
  localizedWeekday,
} from './dateUtils';

const daysArray = [...Array(7)];

class RangeCalendar extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    autoOk: PropTypes.bool,
    blockedDateTimeRanges: PropTypes.array,
    cancelLabel: PropTypes.node,
    disableYearSelection: PropTypes.bool,
    displayTime: PropTypes.bool,
    edit: PropTypes.string.isRequired,
    end: PropTypes.object.isRequired,
    firstDayOfWeek: PropTypes.number,
    initialDate: PropTypes.object,
    locale: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onMonthChange: PropTypes.func,
    onTouchTapCancel: PropTypes.func,
    onTouchTapDay: PropTypes.func,
    onTouchTapHour: PropTypes.func,
    onTouchTapOk: PropTypes.func,
    open: PropTypes.bool,
    openToYearSelection: PropTypes.bool,
    setSelectedDate: PropTypes.func.isRequired,
    start: PropTypes.object.isRequired,
    utils: PropTypes.object,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    disableYearSelection: false,
    displayTime: false,
    locale: 'en-US',
    utils: defaultUtils,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  calendarRefs = {};

  getMinDate() {
    return this.props[this.props.edit].minDate || this.props.utils.addYears(new Date(), -100);
  }

  getMaxDate() {
    return this.props[this.props.edit].maxDate || this.props.utils.addYears(new Date(), 100);
  }

  getSelectedDate() {
    return this.props[this.props.edit].selectedDate;
  }

  isSelectedDateDisabled() {
    if (this.calendarRefs.calendar) {
      return this.calendarRefs.calendar.isSelectedDateDisabled();
    } else {
      return false;
    }
  }

  addSelectedDays(days) {
    this.props.setSelectedDate(this.props.utils.addDays(this.props[this.props.edit].selectedDate, days));
  }

  addSelectedMonths(months) {
    this.props.setSelectedDate(this.props.utils.addMonths(this.props[this.props.edit].selectedDate, months));
  }

  addSelectedYears(years) {
    this.props.setSelectedDate(this.props.utils.addYears(this.props[this.props.edit].selectedDate, years));
  }

  getToolbarInteractions() {
    const {edit, end, start} = this.props;
    if (edit === 'end' && !end.displayDate) {
      return {
        prevMonth: this.props.utils.monthDiff(start.displayDate, this.getMinDate()) > 0,
        nextMonth: this.props.utils.monthDiff(start.displayDate, this.getMaxDate()) < 0,
      };
    } else {
      return {
        prevMonth: this.props.utils.monthDiff(this.props[this.props.edit].displayDate, this.getMinDate()) > 0,
        nextMonth: this.props.utils.monthDiff(this.props[this.props.edit].displayDate, this.getMaxDate()) < 0,
      };
    }
  }

  handleWindowKeyDown = (event) => {
    if (this.props.open) {
      const nextArrow = this.context.muiTheme.isRtl ? 'left' : 'right';
      const prevArrow = this.context.muiTheme.isRtl ? 'right' : 'left';
      switch (keycode(event)) {
        case 'up':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
          } else {
            this.addSelectedDays(-7);
          }
          break;

        case 'down':
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
          } else {
            this.addSelectedDays(7);
          }
          break;

        case nextArrow:
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(1);
          } else {
            this.addSelectedDays(1);
          }
          break;

        case prevArrow:
          if (event.altKey && event.shiftKey) {
            this.addSelectedYears(-1);
          } else if (event.shiftKey) {
            this.addSelectedMonths(-1);
          } else {
            this.addSelectedDays(-1);
          }
          break;
      }
    }
  };

  render() {
    const {prepareStyles} = this.context.muiTheme;
    const toolbarInteractions = this.getToolbarInteractions();
    const {calendarTextColor} = this.context.muiTheme.datePicker;

    const styles = {
      root: {
        color: calendarTextColor,
        userSelect: 'none',
        width: (this.props.displayTime ? 125 : 310),
      },
      calendar: {
        display: 'flex',
        flexDirection: 'column',
      },
      calendarContainer: {
        display: 'flex',
        alignContent: 'space-between',
        justifyContent: 'space-between',
        flexDirection: 'column',
        fontSize: 12,
        fontWeight: 400,
        padding: '0px 8px',
        transition: transitions.easeOut(),
      },
      yearContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        height: 272,
        marginTop: 10,
        overflow: 'hidden',
        width: 310,
      },
      weekTitle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontWeight: '500',
        height: 20,
        lineHeight: '15px',
        opacity: '0.5',
        textAlign: 'center',
      },
      weekTitleDay: {
        width: 42,
      },
      transitionSlide: {
        height: 214,
      },
    };

    const weekTitleDayStyle = prepareStyles(styles.weekTitleDay);

    const {
      blockedDateTimeRanges,
      cancelLabel, // eslint-disable-line no-unused-vars
      DateTimeFormat,
      displayTime,
      edit,
      end,
      firstDayOfWeek,
      locale,
      okLabel, // eslint-disable-line no-unused-vars
      onTouchTapCancel, // eslint-disable-line no-unused-vars
      onTouchTapOk, // eslint-disable-line no-unused-vars
      start,
      utils,
    } = this.props;

    return (
      <div style={prepareStyles(styles.root)}>
        <EventListener
          target="window"
          onKeyDown={this.handleWindowKeyDown}
        />
        <div style={prepareStyles(styles.calendar)}>
          {!displayTime &&
            <div style={prepareStyles(styles.calendarContainer)}>
              <CalendarToolbar
                DateTimeFormat={DateTimeFormat}
                locale={locale}
                displayDate={(this.props[edit].displayDate ? this.props[edit].displayDate : start.displayDate)}
                onMonthChange={this.props.onMonthChange}
                prevMonth={toolbarInteractions.prevMonth}
                nextMonth={toolbarInteractions.nextMonth}
              />
              <div style={prepareStyles(styles.weekTitle)}>
                {daysArray.map((event, i) => (
                  <span key={i} style={weekTitleDayStyle}>
                    {localizedWeekday(DateTimeFormat, locale, i, firstDayOfWeek)}
                  </span>
                ))}
              </div>
              <SlideInTransitionGroup direction={this.props[edit].transitionDirection} style={styles.transitionSlide}>
                <RangeCalendarMonth
                  blockedDateTimeRanges={blockedDateTimeRanges}
                  DateTimeFormat={DateTimeFormat}
                  edit={edit}
                  end={end}
                  displayDate={(this.props[edit].displayDate ? this.props[edit].displayDate : start.displayDate)}
                  firstDayOfWeek={this.props.firstDayOfWeek}
                  key={(this.props[edit].displayDate ?
                    this.props[edit].displayDate.toDateString() : start.displayDate.toDateString())}
                  locale={locale}
                  onTouchTapDay={this.props.onTouchTapDay.bind(this)}
                  ref={(ref) => this.calendarRefs.calendar = ref}
                  start={start}
                  utils={utils}
                />
              </SlideInTransitionGroup>
            </div>
          }
          {displayTime &&
            <RangeTimePicker
              blockedDateTimeRanges={blockedDateTimeRanges}
              edit={edit}
              end={end}
              locale={locale}
              onTouchTapHour={this.props.onTouchTapHour.bind(this)}
              start={start}
              utils={utils}
            />
          }
        </div>
      </div>
    );
  }
}

export default RangeCalendar;
