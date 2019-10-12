import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import DateRangeDisplay from './DateRangeDisplay';
import DateRangeStatusDisplay from './DateRangeStatusDisplay';
import RangeCalendar from './RangeCalendar';
import Dialog from '@material-ui/core/Dialog';
import Popover from '@material-ui/core/Popover';
import update from 'react-addons-update';

import {
  cloneDate,
  defaultUtils,
  dateTimeFormat,
  isAfterDateTime,
  isBeforeDateTime,
  isDateTimeInRanges,
  isEqualDateTime,
  closestRangeAfterStart,
} from './dateUtils';

class DateRangePickerDialog extends Component {

  static propTypes = {
    DateTimeFormat: PropTypes.func,
    autoOk: PropTypes.bool,
    autoOpenField: PropTypes.bool,
    blockedDateTimeRanges: PropTypes.array,
    calendarDateWidth: PropTypes.string,
    calendarTimeWidth: PropTypes.string,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    dayButtonSize: PropTypes.string,
    displayTime: PropTypes.bool,
    edit: PropTypes.string,
    end: PropTypes.object,
    endLabel: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    initialEndDate: PropTypes.object,
    initialStartDate: PropTypes.object,
    locale: PropTypes.string,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    okLabel: PropTypes.node,
    onAccept: PropTypes.func,
    onDismiss: PropTypes.func,
    onShow: PropTypes.func,
    onUpdate: PropTypes.func,
    open: PropTypes.bool,
    showCalendarDate: PropTypes.bool,
    showCalendarStatus: PropTypes.bool,
    start: PropTypes.object,
    startLabel: PropTypes.string,
    style: PropTypes.object,
    utils: PropTypes.object,
  };

  static defaultProps = {
    DateTimeFormat: dateTimeFormat,
    cancelLabel: 'Cancel',
    container: 'dialog',
    initialEndDate: new Date(),
    initialStartDate: new Date(),
    locale: 'en-US',
    okLabel: 'OK',
    utils: defaultUtils,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.popover = React.createRef();
  }

  state = {
    allRefs: {
      endDate: null,
      endTime: null,
      startDate: null,
      startTime: null,
    },
    anchorEl: null,
    edit: 'start',
    displayTime: false,
    end: {
      displayDate: undefined,
      displayMonthDay: undefined,
      maxDate: undefined,
      minDate: undefined,
      selectedDate: undefined,
      shouldDisableDate: undefined,
    },
    open: false,
    start: {
      displayDate: undefined,
      displayMonthDay: undefined,
      maxDate: undefined,
      minDate: undefined,
      selectedDate: undefined,
      shouldDisableDate: undefined,
    },
  };

  UNSAFE_componentWillMount() {
    this.setState({
      end: {
        displayDate: this.props.utils.getFirstDayOfMonth(this.props.initialEndDate),
        maxDate: (this.props.end ? this.props.end.maxDate : undefined),
        minDate: (this.props.end ? this.props.end.minDate : undefined),
        selectedDate: this.props.initialEndDate,
        shouldDisableDate: (this.props.end ? this.props.end.shouldDisableDate : undefined),
      },
      start: {
        displayDate: this.props.utils.getFirstDayOfMonth(this.props.initialStartDate),
        maxDate: (this.props.start ? this.props.start.maxDate : undefined),
        minDate: (this.props.start ? this.props.start.minDate : undefined),
        selectedDate: this.props.initialStartDate,
        shouldDisableDate: (this.props.start ? this.props.start.shouldDisableDate : undefined),
      },
    });
  }

  getMinDate() {
    return this.state[this.state.edit].minDate || this.props.utils.addYears(new Date(), -100);
  }

  getMaxDate() {
    return this.state[this.state.edit].maxDate || this.props.utils.addYears(new Date(), 100);
  }

  setDisplayDate(date, newSelectedDate) {
    const newDisplayDate = this.props.utils.getFirstDayOfMonth(date);
    const newSelectedEndDate = cloneDate(newSelectedDate);
    newSelectedEndDate.setTime(newSelectedEndDate.getTime() + 1 * 60 * 60 * 1000);
    if (newDisplayDate !== this.state[this.state.edit].displayDate) {
      const direction = newDisplayDate > this.state[this.state.edit].displayDate ? 'left' : 'right';
      let newState = update(this.state, {
        [this.state.edit]: {
          displayDate: {$set: newDisplayDate},
          transitionDirection: {$set: direction},
          selectedDate: {$set: newSelectedDate || this.state[this.state.edit].selectedDate},
        },
      });
      if (this.state.edit === 'start' && this.state.end.selectedDate &&
        (isAfterDateTime(newSelectedDate, this.state.end.selectedDate) ||
        isEqualDateTime(newSelectedDate, this.state.end.selectedDate) ||
        this.blockedRangeOverlaps(newSelectedDate))) {
        newState = update(newState, {
          end: {
            displayDate: {$set: undefined},
            // displayDate: {$set: newDisplayDate},
            transitionDirection: {$set: direction},
            selectedDate: {$set: undefined},
            // selectedDate: {$set: newSelectedEndDate || this.state[this.state.edit].selectedDate},
          },
        });
      }
      // if (this.props.autoOpenField) {
      //   newState = update(newState, {
      //     displayTime: {$set: true},
      //   })
      // }
      return newState;
    }
    return this.state;
  }

  blockedRangeOverlaps(adjustedDate) {
    const closestRange = closestRangeAfterStart(this.props.blockedDateTimeRanges, adjustedDate);
    const endDate = this.state.end.selectedDate;
    return (endDate && closestRange && isAfterDateTime(endDate, closestRange.start));
  }

  setSelectedDate(date) {
    let adjustedDate = date;
    let newState;
    const minDate = this.getMinDate();
    const maxDate = this.getMaxDate();
    const {edit, start} = this.state;
    if (isBeforeDateTime(date, minDate)) {
      adjustedDate = minDate;
    } else if (isAfterDateTime(date, maxDate)) {
      adjustedDate = maxDate;
    }

    adjustedDate = this.firstAvailableTime(adjustedDate);

    if (edit === 'end' && isBeforeDateTime(adjustedDate, start.selectedDate)) {
      adjustedDate = new Date(start.selectedDate.getTime());
    }
    const adjustedEndDate = cloneDate(adjustedDate);
    adjustedEndDate.setTime(adjustedEndDate.getTime() + 1 * 60 * 60 * 1000);

    const newDisplayDate = this.props.utils.getFirstDayOfMonth(adjustedDate);
    if (newDisplayDate !== this.state[this.state.edit].displayDate) {
      newState = this.setDisplayDate(newDisplayDate, adjustedDate);
    } else {
      newState = update(this.state, {
        [this.state.edit]: {
          selectedDate: {$set: adjustedDate},
        },
      });
      if (this.state.edit === 'start' && this.state.end.selectedDate &&
        (isAfterDateTime(adjustedDate, this.state.end.selectedDate) ||
        isEqualDateTime(adjustedDate, this.state.end.selectedDate) ||
        this.blockedRangeOverlaps(adjustedDate))) {
        newState = update(newState, {
          end: {
            selectedDate: {$set: undefined},
            // selectedDate: {$set: adjustedEndDate},
          },
        });
      }
    }
    if (this.props.autoOpenField) {
      newState = update(newState, {
        displayTime: {$set: true},
      });
    }
    // newState = update(newState, {
    //   displayTime: {$set: true},
    // });
    return newState;
  }

  firstAvailableTime(dateToCheck) {
    const hoursInDay = 24;
    const {blockedDateTimeRanges} = this.props;
    const {edit, start} = this.state;
    const adjustedDate = cloneDate(dateToCheck);

    for (let hour = 0; hour < hoursInDay; hour++) {
      adjustedDate.setHours(hour, 0, 0, 0);
      if (edit === 'start') {
        if (!isBeforeDateTime(adjustedDate, new Date()) && !isDateTimeInRanges(blockedDateTimeRanges, adjustedDate)) {
          return adjustedDate;
        }
      } else {
        const selectedStartDate = start.selectedDate;
        const closestRange = closestRangeAfterStart(blockedDateTimeRanges, selectedStartDate);

        if (closestRange) {
          if (!isEqualDateTime(start.selectedDate, adjustedDate) &&
                 !isBeforeDateTime(adjustedDate, selectedStartDate) &&
                 !isAfterDateTime(adjustedDate, closestRange.start)) {
            return adjustedDate;
          }
        } else {
          if (!isEqualDateTime(start.selectedDate, adjustedDate) &&
                 !isBeforeDateTime(adjustedDate, selectedStartDate)) {
            return adjustedDate;
          }
        }
      }
    }
    return adjustedDate;
  }

  getTimeElements(styles) {
    const hourArray = [];
    const hoursInDay = 24;
    for (let i = 0; i < hoursInDay; i++) {
      hourArray.push(i);
    }

    return hourArray.map((hour, i) => {
      return (
        <div key={i} style={styles.hour}>
          {this.getHourElement(hour)}
        </div>
      );
    }, this);
  }

  setSelectedTime(hour) {
    const mode = (this.state.edit === 'start' ? 'end' : 'start');
    const adjustedDate = cloneDate(this.state[this.state.edit].selectedDate);
    adjustedDate.setHours(hour, 0, 0, 0);
    const adjustedEndDate = cloneDate(adjustedDate);
    adjustedEndDate.setTime(adjustedEndDate.getTime() + 1 * 60 * 60 * 1000);

    let newState = update(this.state, {
      // displayTime: {$set: false},
      // edit: {$set: mode},
      [this.state.edit]: {
        selectedDate: {$set: adjustedDate},
      },
    });


    if (this.state.edit === 'start' && this.state.end.selectedDate && adjustedDate > this.state.end.selectedDate) {
      newState = update(newState, {
        end: {
          selectedDate: {$set: undefined},
          // selectedDate: {$set: adjustedEndDate},
        },
      });
    }

    if (this.props.autoOpenField) {
      newState = update(newState, {
        displayTime: {
          $set: false,
        },
        edit: {
          $set: mode,
        },
      });
    }
    return newState;
  }

  setEditMode(mode) {
    if (!mode) {
      mode = (this.state.edit === 'start' ? 'end' : 'start');
    }
    const newState = update(this.state, {
      edit: {$set: mode},
    });
    this.setState(newState);
  }

  show = (showRef, startEnd, dateTime, allRefs) => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }
    this.setState({
      allRefs: allRefs,
      anchorEl: showRef,
      edit: startEnd,
      displayTime: (dateTime === 'time'),
    }, () => {
      this.setState({
        open: true,
      });
    });
  };

  reset = () => {
    this.setState({
      allRefs: {
        endDate: null,
        endTime: null,
        startDate: null,
        startTime: null,
      },
      anchorEl: null,
      edit: 'start',
      displayTime: false,
      end: {
        displayDate: this.props.utils.getFirstDayOfMonth(this.props.initialEndDate),
        maxDate: (this.props.end ? this.props.end.maxDate : undefined),
        minDate: (this.props.end ? this.props.end.minDate : undefined),
        selectedDate: this.props.initialEndDate,
        shouldDisableDate: (this.props.end ? this.props.end.shouldDisableDate : undefined),
      },
      open: false,
      start: {
        displayDate: this.props.utils.getFirstDayOfMonth(this.props.initialStartDate),
        maxDate: (this.props.start ? this.props.start.maxDate : undefined),
        minDate: (this.props.start ? this.props.start.minDate : undefined),
        selectedDate: this.props.initialStartDate,
        shouldDisableDate: (this.props.start ? this.props.start.shouldDisableDate : undefined),
      },
    });
  }

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      if (this.state.start.selectedDate && this.state.end.selectedDate &&
          !isEqualDateTime(this.state.start.selectedDate, this.state.end.selectedDate)) {
        this.props.onDismiss({
          start: this.state.start.selectedDate,
          end: this.state.end.selectedDate,
        });
      } else {
        this.props.onDismiss({
          start: null,
          end: null,
        });
      }
    }
    this.setState({
      // edit: 'start',
      // displayTime: false,
      open: false,
    });
  };

  handleTouchTapDay = (event, date) => {
    let newState = this.setSelectedDate(date);
    const {allRefs, edit} = this.state;
    let keepOpen = false;
    if (!this.props.autoOpenField) {
      newState = update(newState, {
        open: {$set: false},
      });
    } else {
      newState = update(newState, {
        displayTime: {$set: true},
        anchorEl: {$set: (edit === 'start' ? allRefs.startTime : allRefs.endTime)},
      });
      keepOpen = true;
    }
    this.setState(newState, () => {
      this.props.onAccept({
        start: newState.start.selectedDate,
        end: newState.end.selectedDate,
      }, keepOpen);
      this.popover.current.updatePosition();
    });
  };

  handleTouchTapHour = (hour) => {
    const {edit} = this.state;
    let newState = this.setSelectedTime(hour);
    let keepOpen = false;

    if (!this.props.autoOpenField) {
      newState = update(newState, {
        open: {$set: false},
      });
    } else {
      if (edit === 'start') {
        newState = update(newState, {
          displayTime: {$set: false},
          edit: {$set: 'end'},
        });
        keepOpen = true;
      } else {
        newState = update(newState, {
          open: {$set: false},
        });
      }
    }

    this.setState(newState);
    this.props.onAccept({
      start: newState.start.selectedDate,
      end: newState.end.selectedDate,
    }, keepOpen);
  };

  handleTouchTapCancel = () => {
    this.dismiss();
  };

  handleRequestClose = () => {
    this.dismiss();
  };

  handleTouchTapOk = () => {
    // should return an object with start and end dates
    if (this.props.onAccept) {
      this.props.onAccept({
        start: this.state.start.selectedDate,
        end: this.state.end.selectedDate,
      });
    }
    this.setState({
      open: false,
    });
  };

  handleWindowKeyUp = (event) => {
    switch (keycode(event)) {
      case 'enter':
        this.handleTouchTapOk();
        break;
    }
  };

  handleMonthChange = (months) => {
    const {edit, start} = this.state;
    const direction = months >= 0 ? 'left' : 'right';
    this.setState({
      [this.state.edit]: {
        transitionDirection: direction,
        displayDate: this.props.utils.addMonths(
          (this.state[edit].displayDate ? this.state[edit].displayDate : start.displayDate), months),
        selectedDate: (this.state[edit].selectedDate ? this.state[edit].selectedDate : start.selectedDate),
        shouldDisableDate: (this.state[edit].shouldDisableDate ?
          this.state[edit].shouldDisableDate : start.shouldDisableDate),
      },
    });
  };

  handleTouchTapMenu = (edit, displayTime) => {
    this.setState({
      edit: (edit ? edit : this.props.edit),
      displayTime: (displayTime ? displayTime : this.props.displayTime),
    });
  }

  handleTouchTapYear = (event, year) => {
    this.setSelectedDate(this.props.utils.setYear(this.state.selectedDate, year), event);
    this.handleTouchTapDateDisplayMonthDay();
  };

  handleTouchTapDateDisplayMonthDay = () => {
    const newState = update(this.state, {
      [this.state.edit]: {
        displayMonthDay: {$set: true},
      },
    });
    this.setState(newState);
  };

  render() {
    const {
      DateTimeFormat,
      autoOk,
      autoOpenField, // eslint-disable-line no-unused-vars
      blockedDateTimeRanges,
      calendarDateWidth,
      calendarTimeWidth,
      cancelLabel,
      container,
      dayButtonSize, // eslint-disable-line no-unused-vars
      displayTime, // eslint-disable-line no-unused-vars
      edit, // eslint-disable-line no-unused-vars
      endLabel,
      showCalendarDate,
      showCalendarStatus,
      initialStartDate, // eslint-disable-line no-unused-vars
      initialEndDate, // eslint-disable-line no-unused-vars
      firstDayOfWeek,
      locale,
      mode,
      okLabel,
      onAccept, // eslint-disable-line no-unused-vars
      onUpdate, // eslint-disable-line no-unused-vars
      onDismiss, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      startLabel,
      style, // eslint-disable-line no-unused-vars
      utils,
      ...other
    } = this.props;

    const {allRefs, open} = this.state;

    let newAnchorEl = this.state.anchorEl;
    if (this.state.edit === 'start') {
      newAnchorEl = (this.state.displayTime ? allRefs.startTime : allRefs.startDate);
    } else {
      newAnchorEl = (this.state.displayTime ? allRefs.endTime : allRefs.endDate);
    }

    const content = (
      <span>
        <EventListener
          target="window"
          onKeyUp={this.handleWindowKeyUp}
        />

        {showCalendarDate &&
          <DateRangeDisplay
            DateTimeFormat={DateTimeFormat}
            disableYearSelection={true}
            displayTime={this.state.displayTime}
            onTouchTapMonthDay={this.handleTouchTapDateDisplayMonthDay}
            onTouchTapYear={this.handleTouchTapDateDisplayYear}
            onTouchTapMenu={this.handleTouchTapMenu.bind(this)}
            locale={locale}
            monthDaySelected={true}
            mode={this.props.mode}
            end={this.state.end}
            edit={this.state.edit}
            start={this.state.start}
          />
        }

        {showCalendarStatus &&
          <DateRangeStatusDisplay
            displayTime={this.state.displayTime}
            edit={this.state.edit}
            endLabel={endLabel}
            mode={this.props.mode}
            startLabel={startLabel}
          />
        }

        <RangeCalendar
          autoOk={autoOk}
          blockedDateTimeRanges={blockedDateTimeRanges}
          DateTimeFormat={DateTimeFormat}
          calendarDateWidth={calendarDateWidth}
          calendarTimeWidth={calendarTimeWidth}
          cancelLabel={cancelLabel}
          disableYearSelection={true}
          displayTime={this.state.displayTime}
          dayButtonSize={dayButtonSize}
          firstDayOfWeek={firstDayOfWeek}
          locale={locale}
          onTouchTapDay={this.handleTouchTapDay.bind(this)}
          onTouchTapHour={this.handleTouchTapHour.bind(this)}
          mode={mode}
          open={open}
          ref="startCalendar"
          onTouchTapCancel={this.handleTouchTapCancel}
          onTouchTapOk={this.handleTouchTapOk}
          okLabel={okLabel}
          openToYearSelection={false}
          edit={this.state.edit}
          end={this.state.end}
          start={this.state.start}
          setSelectedDate={this.setSelectedDate.bind(this)}
          onMonthChange={this.handleMonthChange}
          utils={utils}
        />
      </span>
    );

    return (
      <div {...other} ref="root">
        {container === 'inline' ?
          <Popover
            action={this.popover}
            anchorEl={newAnchorEl || this.refs.root}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            transformOrigin={{horizontal: 'left', vertical: 'top'}}
            ref="dialog"
            open={open}
            onClose={this.handleRequestClose}
          >
            {content}
          </Popover> :
          <Dialog
            ref="dialog"
            open={open}
            onClose={this.handleRequestClose}
          >
            {content}
          </Dialog>
        }
      </div>
    );
  }
}

export default DateRangePickerDialog;
