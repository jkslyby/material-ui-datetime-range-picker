import React, {Component} from 'react';
import PropTypes from 'prop-types';
import transitions from '../styles/transitions';
import SlideInTransitionGroup from '../internal/SlideIn';

function getStyles(props, context, state) {
  const {datePicker} = context.muiTheme;
  const {selectedYear} = state;
  const isLandscape = props.mode === 'landscape';

  const styles = {
    root: {
      width: isLandscape ? 165 : '100%',
      height: isLandscape ? 330 : 'auto',
      float: isLandscape ? 'left' : 'none',
      fontWeight: 700,
      display: 'inline-block',
      backgroundColor: datePicker.headerColor,
      borderTopLeftRadius: 2,
      borderTopRightRadius: isLandscape ? 0 : 2,
      borderBottomLeftRadius: isLandscape ? 2 : 0,
      color: datePicker.textColor,
      padding: 20,
      boxSizing: 'border-box',
    },
    monthDay: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 20,
      lineHeight: '22px',
      height: props.mode === 'landscape' ? '100%' : 44,
      marginTop: '6px',
      opacity: selectedYear ? 0.7 : 1,
      width: '100%',
      fontWeight: '500',
    },

    trans: {
      transition: transitions.easeOut(),
      height: '50%',
    },

    endTitle: {
      opacity: props.edit === 'end' ? 1 : 0.7,
      textAlign: 'right',
      cursor: 'pointer',
    },
    startTitle: {
      opacity: props.edit === 'start' ? 1 : 0.7,
      textAlign: 'left',
      cursor: 'pointer',
    },

    endDateTitle: {
      opacity: props.edit === 'end' && !props.displayTime ? 1 : 0.7,
      textAlign: 'right',
      cursor: 'pointer',
      width: '100%',
    },
    startDateTitle: {
      opacity: props.edit === 'start' && !props.displayTime ? 1 : 0.7,
      textAlign: 'left',
      cursor: 'pointer',
      width: '100%',
    },

    endTimeTitle: {
      opacity: props.edit === 'end' && props.displayTime ? 1 : 0.7,
      textAlign: 'right',
      cursor: 'pointer',
      width: '100%',
    },
    startTimeTitle: {
      opacity: props.edit === 'start' && props.displayTime ? 1 : 0.7,
      textAlign: 'left',
      cursor: 'pointer',
      width: '100%',
    },

    month: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 22,
      lineHeight: '24px',
      height: props.mode === 'landscape' ? '100%' : 26,
      transition: transitions.easeOut(),
      width: '100%',
      fontWeight: '500',
    },


    year: {
      margin: 0,
      fontSize: 16,
      fontWeight: '500',
      lineHeight: '16px',
      height: 16,
      opacity: selectedYear ? 1 : 0.7,
      transition: transitions.easeOut(),
      marginBottom: 10,
    },
    yearTitle: {
      cursor: props.disableYearSelection || selectedYear ? 'default' : 'pointer',
    },
  };

  return styles;
}

class DateRangeDisplay extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    disableYearSelection: PropTypes.bool,
    displayTime: PropTypes.bool,
    edit: PropTypes.string,
    end: PropTypes.object,
    locale: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    monthDaySelected: PropTypes.bool,
    onTouchTapMenu: PropTypes.func,
    onTouchTapMonthDay: PropTypes.func,
    onTouchTapYear: PropTypes.func,
    start: PropTypes.object,
    style: PropTypes.object,
  };

  static defaultProps = {
    monthDaySelected: true,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    selectedYear: false,
    transitionDirection: 'up',
  };

  componentWillMount() {
    if (!this.props.monthDaySelected) {
      this.setState({selectedYear: true});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.start.selectedDate !== this.props.start.selectedDate) {
      const direction = nextProps.start.selectedDate > this.props.start.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction,
      });
    }

    if (nextProps.end.selectedDate !== this.props.end.selectedDate) {
      const direction = nextProps.end.selectedDate > this.props.end.selectedDate ? 'up' : 'down';
      this.setState({
        transitionDirection: direction,
      });
    }
  }

  render() {
    const {
      DateTimeFormat,
      disableYearSelection, // eslint-disable-line no-unused-vars
      displayTime, // eslint-disable-line no-unused-vars
      locale,
      mode, // eslint-disable-line no-unused-vars
      monthDaySelected, // eslint-disable-line no-unused-vars
      onTouchTapMonthDay, // eslint-disable-line no-unused-vars
      onTouchTapYear, // eslint-disable-line no-unused-vars
      onTouchTapMenu,
      end, // eslint-disable-line no-unused-vars
      edit, // eslint-disable-line no-unused-vars
      start, // eslint-disable-line no-unused-vars
      style,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context, this.state);

    const selectedStartDate = this.props.start.selectedDate;
    const selectedEndDate = this.props.end.selectedDate;

    const startDate = new DateTimeFormat(locale, {
      month: 'short',
      weekday: 'short',
      day: '2-digit',
    }).format(selectedStartDate);

    const startTime = selectedStartDate.toLocaleString(locale, {hour: 'numeric', hour12: true});

    const endDate = new DateTimeFormat(locale, {
      month: 'short',
      weekday: 'short',
      day: '2-digit',
    }).format(selectedEndDate);

    const endTime = selectedEndDate.toLocaleString(locale, {hour: 'numeric', hour12: true});

    return (
      <div {...other} style={prepareStyles(styles.root, style)}>

        <div style={styles.month}>
          <div style={styles.startTitle}>Pick Up</div>
          <div style={styles.endTitle}>Drop Off</div>
        </div>

        <div style={styles.monthDay}>
          <div key={`start-${startDate}`} style={{position: 'unset', width: '50%', top: 'unset', left: 'unset'}}>
            <SlideInTransitionGroup style={styles.trans} direction={this.state.transitionDirection}>
              <div onClick={onTouchTapMenu.bind(this, 'start', false)} style={styles.startDateTitle}>
                {startDate}
              </div>
            </SlideInTransitionGroup>
            <div onClick={onTouchTapMenu.bind(this, 'start', true)} style={styles.startTimeTitle}>
              {startTime}
            </div>
          </div>

          <div key={`end-${endDate}`} style={{position: 'unset', width: '50%', top: 'unset', left: 'unset'}}>
            <div onClick={onTouchTapMenu.bind(this, 'end', false)} style={styles.endDateTitle}>
              {endDate}
            </div>
            <div onClick={onTouchTapMenu.bind(this, 'end', true)} style={styles.endTimeTitle}>
              {endTime}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DateRangeDisplay;
