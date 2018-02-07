import React, {Component} from 'react';
import PropTypes from 'prop-types';

function getStyles(props) {
  const isLandscape = props.mode === 'landscape';

  const styles = {
    root: {
      width: isLandscape ? 165 : '100%',
      height: isLandscape ? 330 : 'auto',
      float: isLandscape ? 'left' : 'none',
      fontWeight: 700,
      display: 'inline-block',
      borderTopLeftRadius: 2,
      borderTopRightRadius: isLandscape ? 0 : 2,
      borderBottomLeftRadius: isLandscape ? 2 : 0,
      color: '#474747',
      padding: 10,
      borderBottom: '1px solid #e0e0e0',
      boxSizing: 'border-box',
      textAlign: 'center',
    },
    text: {
      fontSize: 16,
      height: props.mode === 'landscape' ? '100%' : 16,
      width: '100%',
      fontWeight: '500',
    },
  };

  return styles;
}

class DateRangeStatusDisplay extends Component {
  static propTypes = {
    displayTime: PropTypes.bool,
    edit: PropTypes.string,
    endLabel: PropTypes.string,
    mode: PropTypes.oneOf(['portrait', 'landscape']),
    startLabel: PropTypes.string,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const {
      displayTime,
      edit,
      endLabel,
      mode, // eslint-disable-line no-unused-vars
      startLabel,
      style,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);

    return (
      <div {...other} style={prepareStyles(styles.root, style)}>

        <div style={styles.text}>
          {edit === 'start' &&
            <span style={{marginRight: '5px', textTransform: 'capitalize'}}>
              {(startLabel ? startLabel : 'pick up')}
            </span>
          }
          {edit === 'end' &&
            <span style={{marginRight: '5px', textTransform: 'capitalize'}}>
              {(endLabel ? endLabel : 'drop off')}
            </span>
          }
          {!displayTime &&
            <span>Date</span>
          }
          {displayTime &&
            <span>Time</span>
          }
        </div>

      </div>
    );
  }
}

export default DateRangeStatusDisplay;
