import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import {
  isBeforeDateTime,
  isDateTimeInRangesExclusive,
  isEqualDateTime,
} from './dateUtils';

class RangeCalendarActionButton extends Component {
  static propTypes = {
    autoOk: PropTypes.bool,
    blockedDateTimeRanges: PropTypes.array,
    cancelLabel: PropTypes.node,
    end: PropTypes.object.isRequired,
    okLabel: PropTypes.node,
    onTouchTapCancel: PropTypes.func,
    onTouchTapOk: PropTypes.func,
    start: PropTypes.object.isRequired,
  };

  shouldDisableOkay() {
    const {blockedDateTimeRanges, end, start} = this.props;
    return (isEqualDateTime(start.selectedDate, end.selectedDate) ||
            isBeforeDateTime(start.selectedDate, new Date()) ||
            isBeforeDateTime(end.selectedDate, start.selectedDate) ||
            isDateTimeInRangesExclusive(blockedDateTimeRanges, end.selectedDate) ||
            isDateTimeInRangesExclusive(blockedDateTimeRanges, start.selectedDate));
  }

  render() {
    const {cancelLabel, okLabel} = this.props;

    const styles = {
      root: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 0,
        maxHeight: 48,
        padding: 0,
      },
      flatButtons: {
        fontsize: 14,
        margin: '4px 8px 8px 0px',
        maxHeight: 36,
        minWidth: 64,
        padding: 0,
      },
    };

    return (
      <div style={styles.root} >
        <Button
          onClick={this.props.onTouchTapCancel}
          primary={true}
          style={styles.flatButtons}
        >
          {cancelLabel}
        </Button>
        <Button
          disabled={this.shouldDisableOkay()}
          onClick={this.props.onTouchTapOk}
          primary={true}
          style={styles.flatButtons}
        >
          {okLabel}
        </Button>
      </div>
    );
  }
}

export default RangeCalendarActionButton;
