import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import ReactDOM from 'react-dom';

import {
  cloneDate,
  closestRangeAfterStart,
  dateBordersRange,
  isAfterDateTime,
  isBeforeDateTime,
  isDateTimeInRanges,
  isEqualDateTime,
} from './dateUtils';

class RangeTimePicker extends Component {
  static propTypes = {
    blockedDateTimeRanges: PropTypes.array,
    edit: PropTypes.string.isRequired,
    end: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    onTouchTapHour: PropTypes.func.isRequired,
    start: PropTypes.object.isRequired,
    utils: PropTypes.object.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  getStyles() {
    const {datePicker} = this.context.muiTheme;
    return {
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
        overflowY: 'scroll',
      },
      hour: {
        height: 34,
        marginBottom: 2,
      },
      blockedTimeMessage: {
        color: datePicker.color,
        fontWeight: 'bold',
        height: 48,
        lineHeight: 3,
      },
    };
  }

  shouldDisableTime(hour) {
    const {blockedDateTimeRanges, edit, start} = this.props;
    const selectedDate = this.props[edit].selectedDate;
    const adjustedDate = cloneDate(selectedDate);
    adjustedDate.setHours(hour, 0, 0, 0);

    if (edit === 'start') {
      return (isBeforeDateTime(adjustedDate, new Date()) || isDateTimeInRanges(blockedDateTimeRanges, adjustedDate));
    } else {
      const selectedStartDate = start.selectedDate;
      const closestRange = closestRangeAfterStart(blockedDateTimeRanges, selectedStartDate);

      if (closestRange) {
        return isEqualDateTime(start.selectedDate, adjustedDate) ||
               isBeforeDateTime(adjustedDate, selectedStartDate) ||
               isAfterDateTime(adjustedDate, closestRange.start);
      } else {
        return isEqualDateTime(start.selectedDate, adjustedDate) ||
               isBeforeDateTime(adjustedDate, selectedStartDate);
      }
    }
  }

  hasBlockedTime() {
    const {blockedDateTimeRanges, edit} = this.props;
    const selectedDate = this.props[edit].selectedDate;
    if (selectedDate === null) return false;
    return dateBordersRange(blockedDateTimeRanges, selectedDate);
  }

  getTimeElements(styles) {
    const hourArray = [];
    const hoursInDay = 24;
    for (let i = 0; i < hoursInDay; i++) {
      hourArray.push(i);
    }

    return hourArray.map((hour, i) => {
      return (
        <div ref={`hour${hour}`} key={i} style={styles.hour}>
          {this.getHourElement(hour)}
        </div>
      );
    }, this);
  }

  getHourElement(hour) {
    const {
      edit, // eslint-disable-line no-unused-vars
      end, // eslint-disable-line no-unused-vars
      locale,
      start, // eslint-disable-line no-unused-vars
    } = this.props;

    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    const formattedDate = date.toLocaleString(locale, {hour: 'numeric', hour12: true});

    return (
      <MenuItem
        primaryText={formattedDate}
        disabled={this.shouldDisableTime(hour)}
        onClick={this.props.onTouchTapHour.bind(this, hour)}
      />
    );
  }

  render() {
    const styles = this.getStyles();
    setTimeout(() => {
      const hour = ReactDOM.findDOMNode(this.refs.hour12);
      if (hour) {
        hour.scrollIntoView(true);
      }
    }, 0);
    return (
      <div style={styles.root}>
        {this.hasBlockedTime() &&
          <div style={styles.blockedTimeMessage}>This day contains other reservations</div>}
        {this.getTimeElements(styles)}
      </div>
    );
  }
}

export default RangeTimePicker;
