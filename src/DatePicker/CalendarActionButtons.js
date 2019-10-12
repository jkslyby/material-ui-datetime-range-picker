import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
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
    const classes = useStyles();
    const {cancelLabel, okLabel} = this.props;

    return (
      <div style={classes.root} >
        <Button
          onClick={this.props.onTouchTapCancel}
          primary={true}
          style={classes.flatButtons}
        >
          {cancelLabel}
        </Button>
        {!this.props.autoOk &&
          <Button
            disabled={this.refs.calendar !== undefined && this.refs.calendar.isSelectedDateDisabled()}

            onClick={this.props.onTouchTapOk}
            primary={true}
            style={classes.flatButtons}
          >
            {okLabel}
          </Button>
        }
      </div>
    );
  }
}

export default CalendarActionButton;
