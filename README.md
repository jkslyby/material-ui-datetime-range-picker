<style>
  .attribute {
      margin-left: 40px;
      margin-bottom: 20px;
  }
  .attribute > .header {
      font-weight: bold;
      font-size: 18px;
  }
  .attribute > .content {
      margin-left: 40px;
  }
  .add-margin {
      margin-left: 40px;
      margin-bottom: 10px;
  }
</style>

# [Material-UI Datetime Range Picker](http://v0.material-ui.com/)

Material-UI Datetime Range Picker is a datetime range picker built off of [Material-UI](http://v0.material-ui.com/) components.

Check out their [documentation site](http://v0.material-ui.com/) for examples of the original Date Picker.

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
    value={{start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT), end: Wed Jun 14 2018 12:00:00 GMT-0600 (MDT), }} />
```

### Options:

<div class="attribute">
  <div class="header">autoOk:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Boolean - If true, this closes the calendar automatically when a date/time is selected.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>false</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">autoOpenField:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Boolean - If true, immediately jumps to the next input field. For example, if you just selected the start date, the start time field would open immediately.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>false</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">onChange(e, selection):</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Function - Called when the datetimes have been selected for start and end.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>null</code></div>
    <div>Example:</div>
    <div class="add-margin">
      The <code>selection</code> will be an object with start and end attributes that will either be a datetime value or falsey (undefined/null).
    </div>
    <div class="add-margin">
<pre><code>{
  start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT),
  end: undefined
}</code></pre>
        <strong>**Note that if a date is not given it will be either undefined or null (falsey value).**</strong>
    </div>
  </div>
</div>
<div class="attribute">
  <div class="header">onDismiss(e, selection):</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Function - Called when the picker has been closed/dismissed.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>null</code></div>
    <div>Example:</div>
    <div class="add-margin">
      The <code>selection</code> will be an object with start and end attributes that will either be a datetime value or falsey (undefined/null).
    </div>
    <div class="add-margin">
<pre><code>{
  start: null,
  end: null
}</code></pre>
        <strong>**Note that if a date is not given it will be either undefined or null (falsey value).**</strong>
    </div>
  </div>
</div>
<div class="attribute">
  <div class="header">showCalendarStatus:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Boolean - If true, this will show a header with the current field being selected.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>false</code></div>
    <div>Example:</div>
    <div class="add-margin">
      If true, the user would see a header displaying "Start Date", "End Time", etc... or the custom labels provided.
    </div>
  </div>
</div>
<div class="attribute">
  <div class="header">className:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - If provided, it will allow the class styling to overwrite some basic styling of the root element.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>null</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">container:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - Determines if the calendar/time picker should appear as a modal or inline when active.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>dialog</code></div>
    <div>Options:</div>
    <div class="add-margin">'dialog' or 'inline'</div>
  </div>
</div>
<div class="attribute">
  <div class="header">endLabel:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - The text used to indicate the ending date/time selection fields.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>End</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">firstDayOfWeek:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Integer - Used to change the first day of week. It varies from Saturday to Monday between different locales. The allowed range is 0 (Sunday) to 6 (Saturday). The default is `1`, Monday, as per ISO 8601.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>1</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">dayButtonSize:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - Allows you to adjust the size of the **day button**. It is a string because it allows you to use different units from px to vw.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>34px</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">calendarDateWidth:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - Allows you to adjust the width of the **day** picker. It is a string because it allows you to use different units from px to vw.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>310px</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">calendarTimeWidth:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - Allows you to adjust the width of the **time** picker. It is a string because it allows you to use different units from px to vw.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>125px</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">locale:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - The locale for calculating the datetime.
    </div>
    <div>Example:</div>
    <div class="add-margin"><code>en-US</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">mode:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - Determines the rotation of the calendar.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>portrait</code></div>
    <div>Options:</div>
    <div class="add-margin">'portrait' or 'landscape'</div>
  </div>
</div>
<div class="attribute">
  <div class="header">startLabel:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      String - The text used to indicate the beginning date/time selection fields.
    </div>
    <div>Default:</div>
    <div class="add-margin"><code>Start</code></div>
  </div>
</div>
<div class="attribute">
  <div class="header">value:</div>
  <div class="content">
    <div>Description:</div>
    <div class="add-margin">
      Object - The default value for the date/time range picker
    </div>
    <div>Example:</div>
    <div class="add-margin">
<pre><code>{
  start: Wed Jun 13 2018 12:00:00 GMT-0600 (MDT),
  end: Wed Jun 14 2018 12:00:00 GMT-0600 (MDT)
}</code></pre>
    </div>
  </div>
</div>

## Contributions:

I don't have a lot of time to maintain this repo currently. If you see any bugs, feel free to open an issue and if you have time, code contributions are always welcome.

## License
This project is licensed under the terms of the
[MIT license](https://github.com/jkslyby/material-ui-datetime-range-picker/blob/master/LICENSE)
