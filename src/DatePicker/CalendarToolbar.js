import React, {Component} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import SlideInTransitionGroup from '../internal/SlideIn';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'inherit',
    height: 48,
  },
  titleDiv: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    width: 'calc(100% - 96px)',
  },
  titleText: {
    height: 'inherit',
    paddingTop: 12,
  },
};

class CalendarToolbar extends Component {
  static propTypes = {
    DateTimeFormat: PropTypes.func.isRequired,
    displayDate: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    nextMonth: PropTypes.bool,
    onMonthChange: PropTypes.func,
    prevMonth: PropTypes.bool,
  };

  static defaultProps = {
    nextMonth: true,
    prevMonth: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      transitionDirection: 'up',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.displayDate !== this.props.displayDate) {
      const direction = nextProps.displayDate > this.props.displayDate ? 'left' : 'right';
      this.setState({
        transitionDirection: direction,
      });
    }
  }

  handleTouchTapPrevMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(-1);
    }
  };

  handleTouchTapNextMonth = () => {
    if (this.props.onMonthChange) {
      this.props.onMonthChange(1);
    }
  };

  render() {
    const {DateTimeFormat, locale, displayDate} = this.props;

    const dateTimeFormatted = new DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format(displayDate);


    return (
      <div style={styles.root}>
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevMonth}
        >
          <ChevronLeft />
        </IconButton>
        <SlideInTransitionGroup
          direction={this.state.transitionDirection}
          style={styles.titleDiv}
        >
          <div key={dateTimeFormatted} style={styles.titleText}>
            {dateTimeFormatted}
          </div>
        </SlideInTransitionGroup>
        <IconButton
          disabled={!this.props.nextMonth}
          onClick={this.handleTouchTapNextMonth}
        >
          <ChevronRight />
        </IconButton>
      </div>
    );
  }
}

export default CalendarToolbar;
