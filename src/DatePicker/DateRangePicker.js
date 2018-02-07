import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {dateTimeFormat, formatIso, isEqualDate} from './dateUtils';
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
     * Used to change the first day of week. It varies from
     * Saturday to Monday between different locales.
     * The allowed range is 0 (Sunday) to 6 (Saturday).
     * The default is `1`, Monday, as per ISO 8601.
     */
    firstDayOfWeek: PropTypes.number,
    /**
     * This function is called to format the date displayed in the input field, and should return a string.
     * By default if no `locale` and `DateTimeFormat` is provided date objects are formatted to ISO 8601 YYYY-MM-DD.
     *
     * @param {object} date Date object to be formatted.
     * @returns {any} The formatted date.
     */
    formatDate: PropTypes.func,
    /**
     * Override the default display formatting.
     */
    formatDisplay: PropTypes.func,
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
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * Override the inline-styles of DatePicker's TextField element.
     */
    textFieldStyle: PropTypes.object,
    /**
     * Tells the component to hide or show the underline in the text field component
     */
    underlineShow: PropTypes.bool,
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
    firstDayOfWeek: 1,
    startLabel: 'Start',
    style: {},
    underlineShow: true,
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
        if (newDates.start && newDates.end && !isEqualDate(this.state.startDate, newDates.start) ||
            !isEqualDate(this.state.endDate, newDates.end)) {
          this.setState({
            startDate: newDates.start,
            endDate: newDates.end,
          });
        }
      } else if (this.props.value && this.props.value.start && this.props.value.end &&
          nextProps.value && !nextProps.value.start && !nextProps.value.end) {
        this.setState({
          dialogVisible: false,
          startDate: undefined,
          endDate: undefined,
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        });
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
  openDialog() {
    /**
     * if the date is not selected then set it to new date
     * (get the current system date while doing so)
     * else set it to the currently selected date
     */
    if (!this.state.dialogVisible) {
      if (this.state.startDate !== undefined && this.state.endDate !== undefined) {
        this.setState({
          dialogStartDate: this.getDates().startDate,
          dialogEndDate: this.getDates().endDate,
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        }, this.refs.dialogWindow.show);
      } else {
        this.setState({
          dialogStartDate: new Date(),
          dialogEndDate: new Date(),
          selectedStartDate: undefined,
          selectedEndDate: undefined,
        }, this.refs.dialogWindow.show);
      }
    }
  }

  /**
   * Alias for `openDialog()` for an api consistent with TextField.
   */
  focus() {
    this.openDialog();
  }

  handleAccept = (dates) => {
    if (!this.isControlled()) {
      this.setState({
        startDate: dates.start,
        endDate: dates.end,
        dialogVisible: false,
      });
      if (this.props.onChange) {
        this.props.onChange(null, dates);
      }
    } else {
      this.setState({
        dialogVisible: false,
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

  handleTouchTap = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }

    if (!this.props.disabled) {
      setTimeout(() => {
        this.openDialog();
      }, 0);
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

  formatDateForDisplay(date, dateFormatter, label) {
    if (date instanceof Date) {
      if (this.props.locale) {
        return new Intl.DateTimeFormat(this.props.locale, {
          day: '2-digit',
          month: '2-digit',
        }).format(date);
      } else {
        return new Intl.DateTimeFormat('en-US', {
          day: '2-digit',
          month: '2-digit',
        }).format(date);
      }
    } else {
      return label;
    }
  }

  formatTimeForDisplay(date) {
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
      return '';
    }
  }

  formatDateRange(startDate, endDate, dateFormatter) {
    return `${this.formatDateForDisplay(startDate, dateFormatter, 'Start Date')}
            ${this.formatDateForDisplay(endDate, dateFormatter, 'End Date')}`;
  }

  formatDateRangeDisplay(dateFormatter) {
    const {selectedStartDate, selectedEndDate, startDate, endDate} = this.state;
    const {endLabel, formatDisplay, startLabel} = this.props;

    const start = (selectedStartDate ? selectedStartDate : startDate);
    const end = (selectedEndDate ? selectedEndDate : endDate);
    const formattedStartDate = this.formatDateForDisplay(start, dateFormatter, startLabel);
    const formattedStartTime = this.formatTimeForDisplay(start, dateFormatter, startLabel);
    const formattedEndDate = this.formatDateForDisplay(end, dateFormatter, endLabel);
    const formattedEndTime = this.formatTimeForDisplay(end, dateFormatter, endLabel);
    const startComponent = (
      <span>
        <span>{formattedStartDate}</span>
        {formattedStartDate !== startLabel &&
          <span style={{marginRight: '5px'}}>,</span>}
        <span>{formattedStartTime}</span>
      </span>
    );

    const endComponent = (
      <span>
        <span>{formattedEndDate}</span>
        {formattedEndDate !== endLabel &&
          <span style={{marginRight: '5px'}}>,</span>}
        <span>{formattedEndTime}</span>
      </span>
    );

    if (formatDisplay) {
      return formatDisplay(startComponent, endComponent);
    } else {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', border: '1px solid #E5E5E5', padding: '10px'}}>
          {startComponent}
          <SvgIcon
            viewBox="15335.779 -15077.597 23.25 10"
            style={{fill: '#474747', fillRule: 'evenodd', height: '16px'}}
          >
            <path
              d="M5.25,4l-.875.875,3.5,3.5H-13v1.25H7.875l-3.5,3.5L5.25,14l5-5Z"
              transform="translate(15348.779 -15081.597)"
            />
          </SvgIcon>
          {endComponent}
        </div>
      );
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

  render() {
    const {
      DateTimeFormat,
      autoOk,
      blockedDateTimeRanges,
      cancelLabel,
      className,
      container,
      dialogContainerStyle,
      end,
      endLabel,
      firstDayOfWeek,
      formatDate: formatDateProp,
      formatDisplay, // eslint-disable-line no-unused-vars
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
      style,
      textFieldStyle,
      underlineShow, // eslint-disable-line no-unused-vars
      utils,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const formatDate = formatDateProp || this.formatDate;
    return (
      <div className={className} style={prepareStyles(Object.assign({}, style))}>
        <div
          {...other}
          onFocus={this.handleFocus}
          onClick={this.handleTouchTap}
          ref="inputdaterangepicker"
          style={textFieldStyle}
        >
          {this.formatDateRangeDisplay(formatDate)}
        </div>
        <DateRangePickerDialog
          DateTimeFormat={DateTimeFormat}
          autoOk={autoOk}
          blockedDateTimeRanges={blockedDateTimeRanges}
          cancelLabel={cancelLabel}
          container={container}
          containerStyle={dialogContainerStyle}
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
