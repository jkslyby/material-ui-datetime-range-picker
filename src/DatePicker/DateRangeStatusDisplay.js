import React, {Component} from 'react';
import PropTypes from 'prop-types';

function getStyles(props) {
  const isLandscape = props.mode === 'landscape';

  const styles = {
    label: {
      marginRight: '5px',
      textTransform: 'capitalize',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
    },
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
    const status = (!displayTime ? 'Date' : 'Time');
    const label = (edit === 'start' ? startLabel : endLabel);
    const defaultLabel = (edit === 'start' ? 'pick up' : 'drop off');
    return (
      <div {...other} style={prepareStyles(styles.root, style)}>

        <div style={styles.text}>
          <div style={styles.label}>
            {(label ? `${label} ${status}` : `${defaultLabel} ${status}`)}
          </div>
        </div>

      </div>
    );
  }
}

export default DateRangeStatusDisplay;
