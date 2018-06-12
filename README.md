

# [Material-UI Datetime Range Picker](http://www.material-ui.com/)

Material-UI Datetime Range Picker is a datetime range picker built off of [Material-UI](http://material-ui.com/) components.

Check out their [documentation site](http://www.material-ui.com/) for live examples.

## Installation

Material-UI Datetime Range Picker is available as an [npm package](https://www.npmjs.org/package/material-ui-datetime-range-picker).

```sh
npm install material-ui-datetime-range-picker
```

## Notes

This is still a work in progress so use it at your own risk. I've added some basic documentation. There are many attributes that need to be abstracted into a param and other work that needs to be done. Feel free to contribute!

## Usage

`import { DateRangePicker } from 'material-ui-datetime-range-picker';`

### Example:
```
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
/>
```

### Options:


  **autoOk:**
&nbsp; &nbsp; Description:
<pre>      Boolean - If true, this closes the calendar automatically
    when a date/time is selected.</pre>
&nbsp; &nbsp; Default:
<pre>      false</pre>
  **autoOpenField:**
&nbsp; &nbsp; Description:
<pre>      Boolean - If true, immediately jumps to the next input field.
      For example, if you just selected the start date, the start time
      field would open immediately.</pre>
&nbsp; &nbsp; Default:
<pre>      false
</pre>
  **blockedDateTimeRanges:**
&nbsp; &nbsp; Description:
<pre>      Array of Objects with start and end attributes - Allows you to
      block specific datetime ranges so that datetimes in those ranges
      are not selectable.</pre>
&nbsp; &nbsp; Default:
<pre>      []
</pre>
&nbsp; &nbsp; Example:
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
&nbsp; &nbsp; Description:
<pre>      String - Allows you to adjust the width of the **day** picker. It is a string
      because it allows you to use different units from px to vw.</pre>
&nbsp; &nbsp; Default:
<pre>      '310px'</pre>
  **calendarTimeWidth:**
&nbsp; &nbsp; Description:
<pre>      String - Allows you to adjust the width of the **time** picker. It is a string
      because it allows you to use different units from px to vw.</pre>
&nbsp; &nbsp; Default:
<pre>      '125px'</pre>
  **className:**
&nbsp; &nbsp; Description:
<pre>      String - If provided, it will allow the class styling to overwrite some basic
      styling of the root element.</pre>
&nbsp; &nbsp; Default:
<pre>      null</pre>
**container:**
&nbsp; &nbsp; Description:
<pre>      String - Determines if the calendar/time picker should appear as a
      modal or inline when active.</pre>
&nbsp; &nbsp; Default:
<pre>      'dialog'</pre>
&nbsp; &nbsp; Options:
<pre>      'dialog' or 'inline'</pre>
  **dayButtonSize:**
&nbsp; &nbsp; Description:
<pre>      String - Allows you to adjust the size of the **day button**. It is a string
      because it allows you to use different units from px to vw.</pre>
&nbsp; &nbsp; Default:
<pre>      '34px'</pre>
  **endLabel:**
&nbsp; &nbsp; Description:
<pre>      String - The text used to indicate the ending date/time selection fields.</pre>
&nbsp; &nbsp; Default:
<pre>      'End'</pre>
  **firstDayOfWeek:**
&nbsp; &nbsp; Description:
<pre>      Integer - Used to change the first day of week. It varies from Saturday
      to Monday between different locales. The allowed range is 0 (Sunday)
      to 6 (Saturday). The default is `1`, Monday, as per ISO 8601.</pre>
&nbsp; &nbsp; Default:
<pre>      1</pre>
  **locale:**
&nbsp; &nbsp; Description:
<pre>      String - The locale for calculating the datetime.</pre>
&nbsp; &nbsp; Default:
<pre>      'en-US'</pre>
  **mode:**
&nbsp; &nbsp; Description:
<pre>      String - Determines the rotation of the calendar.</pre>
&nbsp; &nbsp; Default:
<pre>      'portrait'</pre>
&nbsp; &nbsp; Options:
<pre>      'portrait' or 'landscape'</pre>
  **onChange(e, selection):**
&nbsp; &nbsp; Description:
<pre>      Function - Called when the datetimes have been selected for start and end.</pre>
&nbsp; &nbsp; Default:
<pre>      null</pre>
&nbsp; &nbsp; Example:
<pre>      The selection will be an object with start and end attributes that will either be a
      datetime value or falsey (undefined/null).
</pre>
```javascript
  {
    start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT),
    end: undefined
  }
```
<pre>  <strong>Note that if a date is not given it will be either undefined or null (falsey value).</strong></pre>

  **onDismiss(e, selection):**
&nbsp; &nbsp; Description:
<pre>      Function - Called when the picker has been closed/dismissed.</pre>
&nbsp; &nbsp; Default:
<pre>      null</pre>
&nbsp; &nbsp; Example:
<pre>      The `selection` will be an object with start and end attributes
      that will either be a datetime value or falsey (undefined/null).</pre>
```javascript
  {
    start: null,
    end: null
  }
```
<pre>  <strong>Note that if a date is not given it will be either undefined or null (falsey value).</strong></pre>

  **showCalendarStatus:**
&nbsp; &nbsp; Description:
<pre>      Boolean - If true, this will show a header with the current field being selected.</pre>
&nbsp; &nbsp; Default:
<pre>      false</pre>
&nbsp; &nbsp; Example:
<pre>      If true, the user would see a header displaying "Start Date",
      "End Time", etc... or the custom labels provided.</pre>
  **startLabel:**
&nbsp; &nbsp; Description:
<pre>      String - The text used to indicate the beginning date/time selection fields.</pre>
&nbsp; &nbsp; Default:
<pre>      'Start'</pre>
  **value:**
&nbsp; &nbsp; Description:
<pre>      Object - The default value for the date/time range picker</pre>
&nbsp; &nbsp; Example:
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
