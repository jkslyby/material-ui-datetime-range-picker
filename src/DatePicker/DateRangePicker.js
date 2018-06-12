import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {dateTimeFormat, formatIso, isEqualDateTime} from './dateUtils';
import DateRangePickerDialog from './DateRangePickerDialog';
import SvgIcon from 'material-ui/SvgIcon';

class DateRangePicker extends Component {
  static propTypes = {
    /**
     * Constructor for date formatting for the specified `locale`.
     * The constructor must follow this specification: ECMAScript Internationalization API 1.0 (ECMA-402).
     * `Intl.DateTimeFormat` is supported by most modern browsers, see http://caniuse.com/#search=intl,
     * otherwise https://github.com/andyearnshaw/Intl.js is a good polyfill.
     *
     * By default, a built-in `DateTimeFormat` is used which supports the 'en-US' `locale`.
     */
    DateTimeFormat: PropTypes.func,
    /**
     * If true, automatically accept and close the picker on select a date.
     */
    autoOk: PropTypes.bool,
    /**
     * If true, automatically open the next datetime element
     */
    autoOpenField: PropTypes.bool,
    /**
     * Used to block datetime ranges on the date range picker
     */
    blockedDateTimeRanges: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * The end datetime of a blocked range
         */
        end: PropTypes.object,
        /**
         * The start datetime of a blocked range
         */
        start: PropTypes.object,
      })
    ),
    /**
     * Override the default width of the calendar when displaying days.
     */
    calendarDateWidth: PropTypes.string,
    /**
     * Override the default width of the calendar when displaying times.
     */
    calendarTimeWidth: PropTypes.string,
    /**
     * Override the default text of the 'Cancel' button.
     */
    cancelLabel: PropTypes.node,
    /**
     * The css class name of the root element.
     */
    className: PropTypes.string,
    /**
     * Used to control how the Date Picker will be displayed when the input field is focused.
     * `dialog` (default) displays the DatePicker as a dialog with a modal.
     * `inline` displays the DatePicker below the input field (similar to auto complete).
     */
    container: PropTypes.oneOf(['dialog', 'inline']),
    /**
     * Override the default size of day buttons.
     */
    dayButtonSize: PropTypes.string,
    /**
     * Override the inline-styles of DatePickerDialog's Container element.
     */
    dialogContainerStyle: PropTypes.object,
    /**
     * Disables the DatePicker.
     */
    disabled: PropTypes.bool,
    /**
     * This is the container for attributes and methods specific to the 'end' calendar.
     */
    end: PropTypes.shape({
      /**
       * This is the initial date value of the component.
       * If either `value` or `valueLink` is provided they will override this
       * prop with `value` taking precedence.
       */
      defaultDate: PropTypes.object,
      /**
       * The ending of a range of valid dates. The range includes the endDate.
       * The default value is current date + 100 years.
       */
      maxDate: PropTypes.object,
      /**
       * The beginning of a range of valid dates. The range includes the startDate.
       * The default value is current date - 100 years.
       */
      minDate: PropTypes.object,
      /**
       * Callback function used to determine if a day's entry should be disabled on the calendar.
       *
       * @param {object} day Date object of a day.
       * @returns {boolean} Indicates whether the day should be disabled.
       */
      shouldDisableDate: PropTypes.func,
    }),
    /**
     * Override the default text of the 'End' label.
     */
    endLabel: PropTypes.string,
    /**
     * Override the default text of the 'End' label for dates.
     */
    endLabelDate: PropTypes.string,
    /**
     * Override the default text of the 'End' label for times.
     */
    endLabelTime: PropTypes.string,
    /**
     * Used to change the first day of week. It varies from
     * Saturday to Monday between different locales.
     * The allowed range is 0 (Sunday) to 6 (Saturday).
     * The default is `1`, Monday, as per ISO 8601.
     */
    firstDayOfWeek: PropTypes.number,
    /**
     * Override the default display formatting.
     */
    formatDisplay: PropTypes.func,
    /**
     * Determines if the component will show multiple boxes and the behavior
     * when a user interacts with it.
     */
    layout: PropTypes.string,
    /**
     * Locale used for formatting the `DatePicker` date strings. Other than for 'en-US', you
     * must provide a `DateTimeFormat` that supports the chosen `locale`.
     */
    locale: PropTypes.string,
    /**
     * Tells the component to display the picker in portrait or landscape mode.
     */
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    /**
     * Override the default text of the 'OK' button.
     */
    okLabel: PropTypes.node,
    /**
     * Callback function that is fired when the date value changes.
     *
     * @param {null} null Since there is no particular event associated with the change,
     * the first argument will always be null.
     * @param {object} date The new date.
     */
    onChange: PropTypes.func,
    /**
     * Callback function that is fired when a touch tap event occurs on the Date Picker's `TextField`.
     *
     * @param {object} event TouchTap event targeting the `TextField`.
     */
    onClick: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's dialog is dismissed.
     *
     * @param {null} null Since there is no particular event associated with the dismiss,
     * the first argument will always be null.
     * @param {object} date The new date or null dates.
     */
    onDismiss: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's `TextField` gains focus.
     */
    onFocus: PropTypes.func,
    /**
     * Callback function that is fired when the Date Picker's dialog is shown.
     */
    onShow: PropTypes.func,
    /**
     * Shows the calendar date/time display. Defaults to false.
     */
    showCalendarDate: PropTypes.bool,
    /**
     * Shows the current step in the date/time selection. Defaults to false.
     */
    showCalendarStatus: PropTypes.bool,
    /**
     * This is the container for attributes and methods specific to the 'start' calendar.
     */
    start: PropTypes.shape({
      /**
       * This is the initial date value of the component.
       * If either `value` or `valueLink` is provided they will override this
       * prop with `value` taking precedence.
       */
      defaultDate: PropTypes.object,
      /**
       * The ending of a range of valid dates. The range includes the endDate.
       * The default value is current date + 100 years.
       */
      maxDate: PropTypes.object,
      /**
       * The beginning of a range of valid dates. The range includes the startDate.
       * The default value is current date - 100 years.
       */
      minDate: PropTypes.object,
      /**
       * Callback function used to determine if a day's entry should be disabled on the calendar.
       *
       * @param {object} day Date object of a day.
       * @returns {boolean} Indicates whether the day should be disabled.
       */
      shouldDisableDate: PropTypes.func,
    }),
    /**
     * Override the default text of the 'Start' label.
     */
    startLabel: PropTypes.string,
    /**
     * Override the default text of the 'Start' label for dates.
     */
    startLabelDate: PropTypes.string,
    /**
     * Override the default text of the 'Start' label for times.
     */
    startLabelTime: PropTypes.string,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Override the inline-styles of DatePicker's TextField element.
     */
    textFieldStyle: PropTypes.object,
    /**
     * This object should contain methods needed to build the calendar system.
     *
     * Useful for building a custom calendar system. Refer to the
     * [source code](https://github.com/callemall/material-ui/blob/master/src/DatePicker/dateUtils.js)
     * and an [example implementation](https://github.com/alitaheri/material-ui-persian-date-picker-utils)
     * for more information.
     */
    utils: PropTypes.object,
    /**
     * Sets the date for the Date Picker programmatically.
     */
    value: PropTypes.shape({
      /**
       * The end date
       */
      end: PropTypes.object,
      /**
       * The start date
       */
      start: PropTypes.object,
    }),
  };

  static defaultProps = {
    autoOk: false,
    container: 'dialog',
    disabled: false,
    endLabel: 'End',
    endLabelDate: 'Date',
    endLabelTime: 'Time',
    firstDayOfWeek: 1,
    startLabel: 'Start',
    startLabelDate: 'Date',
    startLabelTime: 'Time',
    style: {},
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    dialogVisible: false,
    startDate: undefined,
    endDate: undefined,
    selectedStartDate: undefined,
    selectedEndDate: undefined,
  };

  componentWillMount() {
    const newDates = this.getControlledDate();
    if (this.isControlled() && newDates) {
      this.setState({
        startDate: newDates.start,
        endDate: newDates.end,
      });
    } else {
      this.setState({
        startDate: undefined,
        endDate: undefined,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isControlled()) {
      const newDates = this.getControlledDate(nextProps);
      if (newDates) {
        if (newDates.start && newDates.end && !isEqualDateTime(this.state.startDate, newDates.start) ||
            !isEqualDateTime(this.state.endDate, newDates.end) ||
            !isEqualDateTime(this.state.selectedStartDate, newDates.start) ||
            !isEqualDateTime(this.state.selectedEndDate, newDates.end)) {
          this.setState({
            startDate: newDates.start,
            endDate: newDates.end,
            selectedStartDate: newDates.start,
            selectedEndDate: newDates.end,
          });
        }
      } else if (this.props.value && this.props.value.start && this.props.value.end &&
          nextProps.value && !nextProps.value.start && !nextProps.value.end) {
        this.setState({
          dialogStartDate: new Date(),
          dialogEndDate: new Date(),
          dialogVisible: false,
          startDate: undefined,
          endDate: undefined,
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        }, this.refs.dialogWindow.reset.bind(this));
      }
    }
  }

  getDates() {
    return {
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };
  }

  /**
   * Open the date-picker dialog programmatically from a parent.
   */
  openDialog(showRef, startEnd, dateTime) {
    /**
     * if the date is not selected then set it to new date
     * (get the current system date while doing so)
     * else set it to the currently selected date
     */
    const allRefs = {
      startDate: this.refs.startdatefield,
      startTime: this.refs.starttimefield,
      endDate: this.refs.enddatefield,
      endTime: this.refs.endtimefield,
    };
    if (!this.state.dialogVisible) {
      if (this.state.startDate !== undefined && this.state.endDate !== undefined) {
        this.setState({
          dialogStartDate: this.getDates().startDate,
          dialogEndDate: this.getDates().endDate,
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        }, this.refs.dialogWindow.show.bind(this, showRef, startEnd, dateTime, allRefs));
      } else {
        this.setState({
          dialogStartDate: new Date(),
          dialogEndDate: new Date(),
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        }, this.refs.dialogWindow.show.bind(this, showRef, startEnd, dateTime, allRefs));
      }
    }
  }

  /**
   * Alias for `openDialog()` for an api consistent with TextField.
   */
  // focus() {
  //   this.openDialog();
  // }

  handleAccept = (dates, keepOpen) => {
    if (!this.isControlled()) {
      this.setState({
        startDate: dates.start,
        endDate: dates.end,
        dialogVisible: (keepOpen || false),
        selectedStartDate: dates.start,
        selectedEndDate: dates.end,
      });
      if (this.props.onChange) {
        this.props.onChange(null, dates);
      }
    } else {
      this.setState({
        dialogVisible: (keepOpen || false),
      });
      if (this.props.onChange) {
        this.props.onChange(null, dates);
      }
    }
  };

  handleUpdate = (dates) => {
    this.setState({
      selectedStartDate: dates.start,
      selectedEndDate: dates.end,
    });
  };

  handleShow = () => {
    this.setState({
      dialogVisible: true,
    });
    if (this.props.onShow)
      this.props.onShow();
  };

  handleDismiss = (dates) => {
    this.setState({
      selectedStartDate: undefined,
      selectedEndDate: undefined,
      dialogVisible: false,
    });
    if (this.props.onDismiss)
      this.props.onDismiss(null, dates);
  };

  handleFocus = (event) => {
    event.target.blur();
    if (this.props.onFocus) {
      this.props.onFocus(event);
    }
  };

  handleTouchTap = (showRef, startEnd, dateTime, disabled, event) => {
    if (!disabled) {
      if (this.props.onClick) {
        this.props.onClick(event);
      }

      if (!this.props.disabled) {
        setTimeout(() => {
          this.openDialog(showRef, startEnd, dateTime);
        }, 0);
      }
    }
  };

  isControlled() {
    return this.props.hasOwnProperty('value');
  }

  getControlledDate(props = this.props) {
    if (props.value && (props.value.start instanceof Date || props.value.end instanceof Date)) {
      return props.value;
    }
  }

  formatDateForDisplay(date, label) {
    if (date instanceof Date) {
      if (this.props.locale) {
        return new Intl.DateTimeFormat(this.props.locale, {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(date);
      } else {
        return new Intl.DateTimeFormat('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).format(date);
      }
    } else {
      return label;
    }
  }

  formatTimeForDisplay(date, label) {
    if (date instanceof Date) {
      if (this.props.locale) {
        return new Intl.DateTimeFormat(this.props.locale, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(date);
      } else {
        return new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }).format(date);
      }
    } else {
      return label;
    }
  }

  formatDate = (date) => {
    if (this.props.locale) {
      const DateTimeFormat = this.props.DateTimeFormat || dateTimeFormat;
      return new DateTimeFormat(this.props.locale, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(date);
    } else {
      return formatIso(date);
    }
  };

  dropdownArrow = (disabled) => {
    const {layout} = this.props;
    const style = {
      fill: (disabled ? '#a2a2a2' : '#474747'),
      width: '10px', height: '6px',
      marginRight: '10px',
    };
    return (layout !== 'single' &&
      <SvgIcon viewBox="3064 -23442 10 6" style={style}>
        <path
          d="M23.07,10a.707.707,0,0,1-.479-.19.684.684,0,0,1,0-.949L26.485,5,22.591,1.139a.684.684,0,0,1,0-.949.7.7,0,0,1,.957,0L28.4,5,23.549,9.81A.652.652,0,0,1,23.07,10Z"  // eslint-disable-line max-len
          transform="translate(3074 -23464.4) rotate(90)"
        />
      </SvgIcon>
    );
  };

  divider() {
    const {layout} = this.props;
    return (layout === 'single' &&
      <span style={{margin: 'auto 10px'}}>-</span>
    );
  }

  timeStyle(disabled) {
    const {layout} = this.props;
    return {
      height: '38px',
      lineHeight: '38px',
      paddingLeft: (layout !== 'single' ? '10px' : '5px'),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: (disabled ? 'not-allowed' : 'pointer'),
      color: (disabled ? '#a2a2a2' : '#474747'),
      ...(layout !== 'single' ?
      {
        width: '99px',
        border: '1px solid #e5e5e5',
      } : {}),
    };
  }

  dateStyle(disabled) {
    const {layout} = this.props;
    return {
      height: '38px',
      lineHeight: '38px',
      paddingLeft: (layout === 'single' ? '0px' : '10px'),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: (disabled ? 'not-allowed' : 'pointer'),
      color: (disabled ? '#a2a2a2' : '#474747'),
      ...(layout !== 'single' ?
      {
        width: '117px',
        border: '1px solid #e5e5e5',
      } : {}),
    };
  }

  getStyles() {
    const {layout} = this.props;
    return {
      textField: {
        display: 'flex',
        justifyContent: (layout !== 'single' ? 'space-between' : 'flex-start'),
        alignItems: 'center',
        flexWrap: (layout === 'single' ? 'nowrap' : 'wrap'),
      },
      endContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        ...(layout !== 'single' ?
        {
          width: '100%',
        } : {}),
      },
      startContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        ...(layout !== 'single' ?
        {
          width: '100%',
          marginBottom: '16px',
        } : {}),
      },
    };
  }

  render() {
    const {
      DateTimeFormat,
      autoOk,
      autoOpenField,
      blockedDateTimeRanges,
      calendarDateWidth,
      calendarTimeWidth,
      cancelLabel,
      className,
      container,
      dayButtonSize,
      dialogContainerStyle,
      end,
      endLabel,
      endLabelDate,
      endLabelTime,
      firstDayOfWeek,
      formatDisplay, // eslint-disable-line no-unused-vars
      layout,
      locale,
      mode,
      okLabel,
      onDismiss, // eslint-disable-line no-unused-vars
      onFocus, // eslint-disable-line no-unused-vars
      onShow, // eslint-disable-line no-unused-vars
      onClick, // eslint-disable-line no-unused-vars
      showCalendarDate,
      showCalendarStatus,
      start,
      startLabel,
      startLabelDate,
      startLabelTime,
      style,
      textFieldStyle,
      utils,
      ...other // eslint-disable-line no-unused-vars
    } = this.props;


    const {prepareStyles} = this.context.muiTheme;
    const styles = this.getStyles();

    const {selectedStartDate, selectedEndDate, startDate, endDate} = this.state;

    const starting = (selectedStartDate ? selectedStartDate : startDate);
    const ending = (selectedEndDate ? selectedEndDate : endDate);
    const formattedStartDate = this.formatDateForDisplay(starting, startLabelDate);
    const formattedStartTime = this.formatTimeForDisplay(starting, startLabelTime);
    const formattedEndDate = this.formatDateForDisplay(ending, endLabelDate);
    const formattedEndTime = this.formatTimeForDisplay(ending, endLabelTime);

    return (
      <div className={className} style={prepareStyles(Object.assign({}, style))}>
        <div style={Object.assign({}, styles.textField, textFieldStyle)}>
          {layout !== 'single' &&
            <div style={{width: '100%', fontWeight: 'semibold', marginBottom: '5px', fontSize: '15px'}}>Pick Up</div>
          }
          <div style={styles.startContainer}>
            <div
              style={this.dateStyle()}
              ref="startdatefield"
              onFocus={this.handleFocus}
              onClick={this.handleTouchTap.bind(this, this.refs.startdatefield, 'start', 'date', false)}
            >
              <span>{formattedStartDate}</span>
              {layout === 'single' && formattedStartDate !== startLabelDate &&
                <span>,</span>
              }
              {this.dropdownArrow()}
            </div>
            <div
              style={this.timeStyle(formattedStartDate === startLabelDate)}
              ref="starttimefield"
              onFocus={this.handleFocus}
              onClick={this.handleTouchTap.bind(this,
                this.refs.starttimefield, 'start', 'time', (formattedStartDate === startLabelDate))}
            >
              <span>{formattedStartTime}</span>
              {this.dropdownArrow()}
            </div>
          </div>
          {this.divider()}
          {layout !== 'single' &&
            <div style={{width: '100%', fontWeight: 'semibold', marginBottom: '5px', fontSize: '15px'}}>Drop Off</div>
          }
          <div style={styles.endContainer}>
            <div
              style={this.dateStyle(formattedStartDate === startLabelDate)}
              ref="enddatefield"
              onFocus={this.handleFocus}
              onClick={this.handleTouchTap.bind(this,
                this.refs.enddatefield, 'end', 'date', (formattedStartDate === startLabelDate))}
            >
              <span>{formattedEndDate}</span>
              {layout === 'single' && formattedEndDate !== endLabelDate &&
                <span>,</span>
              }
              {this.dropdownArrow()}
            </div>
            <div
              style={this.timeStyle(formattedEndDate === endLabelDate)}
              ref="endtimefield"
              onFocus={this.handleFocus}
              onClick={this.handleTouchTap.bind(this,
                this.refs.endtimefield, 'end', 'time', (formattedEndDate === endLabelDate))}
            >
              <span>{formattedEndTime}</span>
              {this.dropdownArrow()}
            </div>
          </div>
        </div>
        <DateRangePickerDialog
          DateTimeFormat={DateTimeFormat}
          autoOk={autoOk}
          autoOpenField={autoOpenField}
          blockedDateTimeRanges={blockedDateTimeRanges}
          calendarDateWidth={calendarDateWidth}
          calendarTimeWidth={calendarTimeWidth}
          cancelLabel={cancelLabel}
          container={container}
          containerStyle={dialogContainerStyle}
          dayButtonSize={dayButtonSize}
          end={end}
          endLabel={endLabel}
          firstDayOfWeek={firstDayOfWeek}
          initialStartDate={this.state.dialogStartDate}
          initialEndDate={this.state.dialogEndDate}
          locale={locale}
          showCalendarDate={showCalendarDate}
          showCalendarStatus={showCalendarStatus}
          mode={mode}
          okLabel={okLabel}
          onAccept={this.handleAccept}
          onUpdate={this.handleUpdate}
          onShow={this.handleShow}
          onDismiss={this.handleDismiss}
          ref="dialogWindow"
          start={start}
          startLabel={startLabel}
          utils={utils}
        />
      </div>
    );
  }
}

export default DateRangePicker;
