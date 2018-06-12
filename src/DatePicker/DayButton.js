import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Transition from '../styles/transitions';
import {isEqualDate} from './dateUtils';
import EnhancedButton from '../internal/EnhancedButton';
import parseNum from 'parse-num';

function getStyles(props, context, state) {
  const {
    dayButtonSize,
    calendarDateWidth,
    containsBlockedTime,
    date,
    disabled,
    isBetweenDates,
    isEndDate,
    isStartDate,
    selected,
  } = props;
  const {hover} = state;
  const {baseTheme, datePicker} = context.muiTheme;

  const buttonStateSize = parseNum(dayButtonSize || '34px');
  const calendarWidth = parseNum(calendarDateWidth || '310') - (buttonStateSize / 2); // -btn/2 for padding
  let margin = 'auto';

  let spacerRight = 0;
  let spacerLeft = 0;
  let spacerDisplay = 'none';

  let labelColor = baseTheme.palette.textColor;
  let buttonStateOpacity = 0;
  let buttonStateBorderRadius = '50%';
  let buttonStateTransform = 'scale(0)';
  let buttonStateWidth = buttonStateSize;
  const unit = (dayButtonSize || 'px').replace(/[0-9.]/g, '');

  let buttonStateLeft = 0;

  const diff = (calendarWidth - buttonStateSize * 7) / 14;

  if (hover || selected || isBetweenDates) {
    labelColor = datePicker.selectTextColor;
    buttonStateOpacity = (selected || isBetweenDates) ? 1 : 0.6;
    buttonStateTransform = 'scale(1)';
    if (isEndDate && !isStartDate) {
      buttonStateBorderRadius = '0% 50% 50% 0%';
      buttonStateWidth += diff;
      margin = 'auto auto auto 0';
      buttonStateLeft = diff;
      spacerRight = 'unset';
      spacerDisplay = 'block';
    } else if (isStartDate && !isEndDate) {
      buttonStateBorderRadius = '50% 0% 0% 50%';
      buttonStateWidth += diff;
      margin = 'auto 0 auto auto';
      buttonStateLeft = -diff;
      spacerLeft = 'unset';
      spacerDisplay = 'block';
    } else if (!isEndDate && !isStartDate && isBetweenDates) {
      buttonStateBorderRadius = '0%';
      buttonStateWidth += (diff * 2);
      margin = 'auto 0';
    }
  } else if (containsBlockedTime === true || isEqualDate(date, new Date())) {
    labelColor = datePicker.color;
  }
  return {
    root: {
      boxSizing: 'border-box',
      fontWeight: '400',
      opacity: disabled && '0.4',
      padding: '0',
      position: 'relative',
      WebkitTapHighlightColor: 'rgba(0,0,0,0)', // Remove mobile color flashing (deprecated)
      margin: margin,
      minWidth: `${buttonStateWidth}${unit}`,
    },
    label: {
      color: labelColor,
      fontWeight: '400',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: buttonStateLeft,
      right: 0,
      margin: 'auto',
      lineHeight: `${buttonStateSize}${unit}`,
      height: `${buttonStateSize}${unit}`,
    },
    buttonState: {
      backgroundColor: datePicker.selectColor,
      borderRadius: buttonStateBorderRadius,
      height: `${buttonStateSize}${unit}`,
      opacity: buttonStateOpacity,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: buttonStateLeft,
      right: 0,
      margin: 'auto',
      transform: buttonStateTransform,
      transition: Transition.easeOut(),
      width: `${buttonStateWidth}${unit}`,
    },
    spacer: {
      width: `${diff}${unit}`,
      position: 'absolute',
      right: spacerRight,
      left: spacerLeft,
      top: 0,
      bottom: 0,
      height: `${buttonStateSize}${unit}`,
      backgroundColor: datePicker.selectColor,
      display: spacerDisplay,
      margin: 'auto',
    },
  };
}

class DayButton extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    calendarDateWidth: PropTypes.string,
    containsBlockedTime: PropTypes.bool,
    date: PropTypes.object,
    dayButtonSize: PropTypes.string,
    disabled: PropTypes.bool,
    isBetweenDates: PropTypes.bool,
    isEndDate: PropTypes.bool,
    isStartDate: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onKeyboardFocus: PropTypes.func,
    selected: PropTypes.bool,

  };

  static defaultProps = {
    selected: false,
    disabled: false,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    hover: false,
  };

  handleMouseEnter = () => {
    if (!this.props.disabled) {
      this.setState({hover: true});
    }
  };

  handleMouseLeave = () => {
    if (!this.props.disabled) {
      this.setState({hover: false});
    }
  };

  handleTouchTap = (event) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(event, this.props.date);
    }
  };

  handleKeyboardFocus = (event, keyboardFocused) => {
    if (!this.props.disabled && this.props.onKeyboardFocus) {
      this.props.onKeyboardFocus(event, keyboardFocused, this.props.date);
    }
  };

  render() {
    const {
      containsBlockedTime, // eslint-disable-line no-unused-vars
      DateTimeFormat,
      calendarDateWidth, // eslint-disable-line no-unused-vars
      date,
      dayButtonSize, // eslint-disable-line no-unused-vars
      disabled,
      isBetweenDates, // eslint-disable-line no-unused-vars
      isEndDate, // eslint-disable-line no-unused-vars
      isStartDate, // eslint-disable-line no-unused-vars
      locale,
      onClick, // eslint-disable-line no-unused-vars
      selected, // eslint-disable-line no-unused-vars
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    return date ? (
      <EnhancedButton
        {...other}
        disabled={disabled}
        disableFocusRipple={true}
        disableTouchRipple={true}
        onKeyboardFocus={this.handleKeyboardFocus}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleTouchTap}
        style={styles.root}
      >
        <div style={prepareStyles(styles.buttonState)} />
        <span style={prepareStyles(styles.label)}>
          {new DateTimeFormat(locale, {
            day: 'numeric',
          }).format(date)}
        </span>
        <div style={prepareStyles(styles.spacer)} />
      </EnhancedButton>
    ) : (
      <span style={prepareStyles(styles.root)} />
    );
  }
}

export default DayButton;
