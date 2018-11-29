import React, {Component} from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import SlideInTransitionGroup from '../internal/SlideIn';

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

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  state = {
    transitionDirection: 'up',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayDate !== this.props.displayDate) {
      const nextDirection = this.context.muiTheme.isRtl ? 'right' : 'left';
      const prevDirection = this.context.muiTheme.isRtl ? 'left' : 'right';
      const direction = nextProps.displayDate > this.props.displayDate ? nextDirection : prevDirection;
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

    const nextButtonIcon = this.context.muiTheme.isRtl ? <ChevronLeft /> : <ChevronRight />;
    const prevButtonIcon = this.context.muiTheme.isRtl ? <ChevronRight /> : <ChevronLeft />;


    return (
      <div style={styles.root}>
        <IconButton
          disabled={!this.props.prevMonth}
          onClick={this.handleTouchTapPrevMonth}
        >
          {prevButtonIcon}
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
          {nextButtonIcon}
        </IconButton>
      </div>
    );
  }
}

export default CalendarToolbar;
