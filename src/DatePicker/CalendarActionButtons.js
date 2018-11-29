import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  flatButton: {
    fontsize: 14,
    margin: '4px 8px 8px 0px',
    maxHeight: 36,
    minWidth: 64,
    padding: 0,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 0,
    maxHeight: 48,
    padding: 0,
  },
});


class CalendarActionButton extends Component {
  static propTypes = {
    autoOk: PropTypes.bool,
    cancelLabel: PropTypes.node,
    okLabel: PropTypes.node,
    onTouchTapCancel: PropTypes.func,
    onTouchTapOk: PropTypes.func,
  };

  render() {
    const {cancelLabel, classes, okLabel} = this.props;

    return (
      <div className={classes.root}>
        <Button
          onClick={this.props.onTouchTapCancel}
          color="primary"
          className={classes.flatButton}
        >
          {cancelLabel}
        </Button>
        {!this.props.autoOk &&
          <Button
            disabled={this.refs.calendar !== undefined && this.refs.calendar.isSelectedDateDisabled()}
            onClick={this.props.onTouchTapOk}
            color="primary"
            className={classes.flatButton}
          >
            {okLabel}
          </Button>
        }
      </div>
    );
  }
}

export default withStyles(styles)(CalendarActionButton);
