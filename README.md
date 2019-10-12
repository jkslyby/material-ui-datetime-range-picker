

# [Material-UI Datetime Range Picker](http://www.material-ui.com/)

Material-UI Datetime Range Picker is a datetime range picker built off of [Material-UI](http://material-ui.com/) components.

Check out their [documentation site](http://www.material-ui.com/) for live examples.

## Installation

Material-UI Datetime Range Picker is available as an [npm package](https://www.npmjs.org/package/material-ui-datetime-range-picker).

```sh
npm install material-ui-datetime-range-picker
```

## Notes

This is still a work in progress so use it at your own risk. I've added some basic documentation. There are many attributes that need to be abstracted into a param and other work that needs to be done. Please note that this uses Material UI version 0.2 and requires some additional imports. Feel free to contribute!

## Usage

`import { DateRangePicker } from 'material-ui-datetime-range-picker';`

### Example:
```
<MuiThemeProvider muiTheme={getMuiTheme(theme)}>
  <DateRangePicker
      autoOk={true}
      autoOpenField={true}
      onChange={onChange}
      onDismiss={onDismiss}
      showCalendarStatus={true}
      className="my-date-picker"
      firstDayOfWeek={0}
      dayButtonSize="6.25vw"
      calendarDateWidth="80vw"
      calendarTimeWidth="40vw"
      local='en-US'
      mode='portrait'
      startLabel='Beginning'
      endLabel='Ending'
</MuiThemeProvider>
/>
```

### Options:


  **autoOk:**
<pre>
  Description:
    Boolean - If true, this closes the calendar automatically
    when a date/time is selected.
  Default:
      false
</pre>
  **autoOpenField:**
<pre>
  Description:
      Boolean - If true, immediately jumps to the next input field.
      For example, if you just selected the start date, the start time
      field would open immediately.
  Default:
      false
</pre>
  **blockedDateTimeRanges:**
  <pre>
  Description:
      Array of Objects with start and end attributes - Allows you to
      block specific datetime ranges so that datetimes in those ranges
      are not selectable.
  Default:
      []
  Example:
</pre>
```javascript
      let blockedDateTimeRanges = [
        {
          start: new Date('2018-11-06 08:00:00'),
          end: new Date('2018-11-06 20:00:00')
        },
        {
          start: new Date('2020-11-03 08:00:00'),
          end: new Date('2020-11-03 20:00:00')
        }
      ]
```
  **calendarDateWidth:**
<pre>
  Description:
      String - Allows you to adjust the width of the **day** picker. It is a string
      because it allows you to use different units from px to vw.
  Default:
      '310px'
</pre>
  **calendarTimeWidth:**
<pre>
  Description:
      String - Allows you to adjust the width of the **time** picker. It is a string
      because it allows you to use different units from px to vw.
  Default:
      '125px'
</pre>
  **className:**
<pre>
  Description:
      String - If provided, it will allow the class styling to overwrite some basic
      styling of the root element.
  Default:
      null
</pre>

**container:**
<pre>
  Description:
      String - Determines if the calendar/time picker should appear as a
      modal or inline when active.
  Default:
      'dialog'
  Options:
      'dialog' or 'inline'
</pre>
  **dayButtonSize:**
<pre>
  Description:
      String - Allows you to adjust the size of the **day button**. It is a string
      because it allows you to use different units from px to vw.
  Default:
      '34px'
</pre>
  **display(start, end, onFocus):**
  Description:
      Function - Enables an absolute customization of the date/time fields. Please note
                 that all variables below are required if you do this!
      Variables:
        start {
          dateRef - References the start date node,
          onClickDate - Function for handling the onClick event for the start date,
          formattedDate - Formatted start date,
          timeRef - References the start time node,
          onClickTime - Function for handling the onClick event for the start time,
          formattedTime - Formatted start time,
        }
        end {
          dateRef - References the end date node,
          onClickDate - Function for handling the onClick event for the end date,
          formattedDate - Formatted end date,
          timeRef - References the end time node,
          onClickTime - Function for handling the onClick event for the end time,
          formattedTime - Formatted end time,
        }
        onFocus - Function for handling focus event
  Example:
```javascript
    display={(start, end, onFocus) => {
      return (
        <div className='date-range-picker-text-field'>
          <div className='container'>
            <div
              className='date'
              ref={start.dateRef}
              onFocus={onFocus}
              onClick={start.onClickDate}
            >
              <span>{start.formattedDate}</span>
              {start.formattedDate !== 'Pick up' &&
                <span>,</span>
              }
            </div>
            <div
              className={classNames('time', {disabled: start.formattedDate === 'Pick up'})}
              ref={start.timeRef}
              onFocus={onFocus}
              onClick={start.onClickTime}
            >
              <span>{start.formattedTime}</span>
            </div>
          </div>
          <span className='separator'>-</span>
          <div className='container'>
            <div
              className={classNames('date', {disabled: start.formattedDate === 'Pick up'})}
              ref={end.dateRef}
              onFocus={onFocus}
              onClick={end.onClickDate}
            >
              <span>{end.formattedDate}</span>
              {end.formattedDate !== 'Drop off' &&
                <span>,</span>
              }
            </div>
            <div
              className={classNames('time', {disabled: end.formattedDate === 'Drop off'})}
              ref={end.timeRef}
              onFocus={onFocus}
              onClick={end.onClickTime}
            >
              <span>{end.formattedTime}</span>
            </div>
          </div>
        </div>
      );
    }}
```
  **endLabel:**
<pre>
  Description:
      String - The text used to indicate the ending date/time selection fields.
  Default:
      'End'
</pre>
  **firstDayOfWeek:**
<pre>
  Description:
      Integer - Used to change the first day of week. It varies from Saturday
      to Monday between different locales. The allowed range is 0 (Sunday)
      to 6 (Saturday). The default is `1`, Monday, as per ISO 8601.
  Default:
      1
</pre>
  **locale:**
<pre>
  Description:
      String - The locale for calculating the datetime.
  Default:
      'en-US'
</pre>
  **mode:**
<pre>
  Description:
      String - Determines the rotation of the calendar.
  Default:
      'portrait'
  Options:
      'portrait' or 'landscape'
</pre>
  **onChange(e, selection):**
<pre>
  Description:
      Function - Called when the datetimes have been selected for start and end.
  Default: null
  Example:
      The selection will be an object with start and end attributes that will either be a
      datetime value or falsey (undefined/null).
</pre>
```javascript
  {
    start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT),
    end: undefined
  }
```
<pre><strong>Note that if a date is not given it will be either undefined or null (falsey value).</strong></pre>

  **onDismiss(e, selection):**
<pre>
  Description:
      Function - Called when the picker has been closed/dismissed.
  Default:
      null
  Example:
      The `selection` will be an object with start and end attributes
      that will either be a datetime value or falsey (undefined/null).
</pre>
```javascript
  {
    start: null,
    end: null
  }
```
<pre><strong>Note that if a date is not given it will be either undefined or null (falsey value).</strong></pre>

  **showCalendarStatus:**
<pre>
  Description:
      Boolean - If true, this will show a header with the current field being selected.
  Default:
      false
  Example:
      If true, the user would see a header displaying "Start Date",
      "End Time", etc... or the custom labels provided.
</pre>
  **startLabel:**
<pre>
  Description:
      String - The text used to indicate the beginning date/time selection fields.
  Default:
      'Start'
</pre>
  **value:**
<pre>
  Description:
      Object - The default value for the date/time range picker
  Example:
</pre>
```javascript
  {
    start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT),
    end: Wed Jun 14 2018 12:00:00 GMT-0600 (MDT)
  }
  ```


## Contributions:

I don't have a lot of time to maintain this repo currently. If you see any bugs, feel free to open an issue and if you have time, code contributions are always welcome.

## License
This project is licensed under the terms of the
[MIT license](https://github.com/jkslyby/material-ui-datetime-range-picker/blob/master/LICENSE)
