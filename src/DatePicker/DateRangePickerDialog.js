import React, {Component} from 'react';
import PropTypes from 'prop-types';
import EventListener from 'react-event-listener';
import keycode from 'keycode';
import DateRangeDisplay from './DateRangeDisplay';
import RangeCalendar from './RangeCalendar';
import {Dialog} from 'material-ui';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import update from 'react-addons-update';

import {
  cloneDate,
  defaultUtils,
  dateTimeFormat,
  isAfterDate,
  isBeforeDate,
  isBeforeDateTime,
  closestRangeAfterStart,
} from './dateUtils';

class DateRangePickerDialog extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func,
    animation: PropTypes.func,
    autoOk: PropTypes.bool,
    blockedDateTimeRanges: PropTypes.array,
    cancelLabel: PropTypes.node,
    container: PropTypes.oneOf(['dialog', 'inline']),
    containerStyle: PropTypes.object,
    end: PropTypes.object,
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
    start: PropTypes.object,
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

  // state = {
  //   open: false,
  // };

  state = {
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

  componentWillMount() {
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

  componentWillReceiveProps(nextProps) {
    let newState = update(this.state, {});
    if (nextProps.initialEndDate !== this.props.initialEndDate ||
        nextProps.initialStartDate !== this.props.initialStartDate) {
      if (nextProps.initialEndDate !== this.props.initialEndDate) {
        const date = nextProps.initialEndDate || new Date();
        newState = update(newState, {
          end: {
            displayDate: {$set: this.props.utils.getFirstDayOfMonth(date)},
            selectedDate: {$set: date},
          },
        });
      }
      if (nextProps.initialStartDate !== this.props.initialStartDate) {
        const date = nextProps.initialStartDate || new Date();
        newState = update(newState, {
          start: {
            displayDate: {$set: this.props.utils.getFirstDayOfMonth(date)},
            selectedDate: {$set: date},
          },
        });
      }
      this.setState(newState);
    }
  }

  getMinDate() {
    return this.state[this.state.edit].minDate || this.props.utils.addYears(new Date(), -100);
  }

  getMaxDate() {
    return this.state[this.state.edit].maxDate || this.props.utils.addYears(new Date(), 100);
  }

  setDisplayDate(date, newSelectedDate) {
    const newDisplayDate = this.props.utils.getFirstDayOfMonth(date);

    if (newDisplayDate !== this.state[this.state.edit].displayDate) {
      const nextDirection = this.context.muiTheme.isRtl ? 'right' : 'left';
      const prevDirection = this.context.muiTheme.isRtl ? 'left' : 'right';
      const direction = newDisplayDate > this.state[this.state.edit].displayDate ? nextDirection : prevDirection;
      let newState = update(this.state, {
        [this.state.edit]: {
          displayDate: {$set: newDisplayDate},
          transitionDirection: {$set: direction},
          selectedDate: {$set: newSelectedDate || this.state[this.state.edit].selectedDate},
        },
      });
      if (this.state.edit === 'start' && (isAfterDate(newSelectedDate, this.state.end.selectedDate) ||
                this.blockedRangeOverlaps(newSelectedDate))) {
        newState = update(newState, {
          end: {
            displayDate: {$set: newDisplayDate},
            transitionDirection: {$set: direction},
            selectedDate: {$set: newSelectedDate || this.state[this.state.edit].selectedDate},
          },
        });
      }
      return newState;
    }
    return this.state;
  }

  blockedRangeOverlaps(adjustedDate) {
    const closestRange = closestRangeAfterStart(this.props.blockedDateTimeRanges, adjustedDate);
    const endDate = this.state.end.selectedDate;
    return (endDate && closestRange && isAfterDate(endDate, closestRange.start));
  }

  setSelectedDate(date) {
    let adjustedDate = date;
    let newState;
    const minDate = this.getMinDate();
    const maxDate = this.getMaxDate();
    const {edit, start} = this.state;
    if (isBeforeDate(date, minDate)) {
      adjustedDate = minDate;
    } else if (isAfterDate(date, maxDate)) {
      adjustedDate = maxDate;
    }

    if (edit === 'end' && isBeforeDateTime(adjustedDate, start.selectedDate)) {
      adjustedDate = new Date(start.selectedDate.getTime());
    }

    const newDisplayDate = this.props.utils.getFirstDayOfMonth(adjustedDate);
    if (newDisplayDate !== this.state[this.state.edit].displayDate) {
      newState = this.setDisplayDate(newDisplayDate, adjustedDate);
    } else {
      newState = update(this.state, {
        [this.state.edit]: {
          selectedDate: {$set: adjustedDate},
        },
      });
      if (this.state.edit === 'start' && (isAfterDate(adjustedDate, this.state.end.selectedDate) ||
        this.blockedRangeOverlaps(adjustedDate))) {
        newState = update(newState, {
          end: {
            selectedDate: {$set: adjustedDate},
          },
        });
      }
    }
    newState = update(newState, {
      displayTime: {$set: true},
    });
    return newState;
  }

  setSelectedTime(hour) {
    const mode = (this.state.edit === 'start' ? 'end' : 'start');
    const adjustedDate = cloneDate(this.state[this.state.edit].selectedDate);
    adjustedDate.setHours(hour, 0, 0, 0);
    let newState = update(this.state, {
      displayTime: {$set: false},
      edit: {$set: mode},
      [this.state.edit]: {
        selectedDate: {$set: adjustedDate},
      },
    });

    if (this.state.edit === 'start' && adjustedDate > this.state.end.selectedDate) {
      newState = update(newState, {
        end: {
          selectedDate: {$set: adjustedDate},
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

  show = () => {
    if (this.props.onShow && !this.state.open) {
      this.props.onShow();
    }
    this.setState({
      open: true,
    });
  };

  dismiss = () => {
    if (this.props.onDismiss && this.state.open) {
      this.props.onDismiss();
    }
    this.setState({
      edit: 'start',
      displayTime: false,
      open: false,
    });
  };

  handleTouchTapDay = (event, date) => {
    if (this.props.onUpdate) {
      this.setState(this.setSelectedDate(date), this.meh.bind(this));
    } else {
      this.setState(this.setSelectedDate(date));
    }
  };
  meh() {
    this.props.onUpdate({
      start: this.state.start.selectedDate,
      end: this.state.end.selectedDate,
    });
  }

  handleTouchTapHour = (hour) => {
    if (this.props.onUpdate) {
      this.setState(this.setSelectedTime(hour), this.meh.bind(this));
    } else {
      this.setState(this.setSelectedTime(hour));
    }
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
    const nextDirection = this.context.muiTheme.isRtl ? 'right' : 'left';
    const prevDirection = this.context.muiTheme.isRtl ? 'left' : 'right';
    const direction = months >= 0 ? nextDirection : prevDirection;
    this.setState({
      [this.state.edit]: {
        transitionDirection: direction,
        displayDate: this.props.utils.addMonths(this.state[this.state.edit].displayDate, months),
        selectedDate: this.state[this.state.edit].selectedDate,
        shouldDisableDate: this.state[this.state.edit].shouldDisableDate,
      },
    });
  };

  handleTouchTapMenu = (edit, displayTime) => {
    this.setState({
      edit: edit,
      displayTime: displayTime,
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
      blockedDateTimeRanges,
      cancelLabel,
      container,
      containerStyle,
      showCalendarDate,
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
      style, // eslint-disable-line no-unused-vars
      animation,
      utils,
      ...other
    } = this.props;

    const {open} = this.state;

    const styles = {
      dialogContent: {
        width: 310,
      },
      dialogBodyContent: {
        padding: 0,
        minHeight: 280,
        minWidth: 310,
      },
    };

    const Container = (container === 'inline' ? Popover : Dialog);

    return (
      <div {...other} ref="root">
        <Container
          anchorEl={this.refs.root} // For Popover
          animation={animation || PopoverAnimationVertical} // For Popover
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}} // For Popover
          targetOrigin={{horizontal: 'left', vertical: 'top'}} // For Popover
          canAutoPosition={false} // For Popover
          bodyStyle={styles.dialogBodyContent}
          contentStyle={styles.dialogContent}
          ref="dialog"
          repositionOnUpdate={true}
          open={open}
          onRequestClose={this.handleRequestClose}
          style={Object.assign(styles.dialogBodyContent, containerStyle)}
        >
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

          <RangeCalendar
            autoOk={autoOk}
            blockedDateTimeRanges={blockedDateTimeRanges}
            DateTimeFormat={DateTimeFormat}
            cancelLabel={cancelLabel}
            disableYearSelection={true}
            displayTime={this.state.displayTime}
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


        </Container>
      </div>
    );
  }
}

export default DateRangePickerDialog;
