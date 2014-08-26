var Schemas = {};

Schemas.Shortlists = new SimpleSchema({
  address: {
    type: String,
    label: 'Address'
  },
  price: {
    type: Number,
    label: 'Price'
  },
  size: {
    type: Number,
    label: 'Size',
    optional: true
  },
  beds: {
    type: Number,
    label: 'Beds'
  },
  baths: {
    type: Number,
    label: 'Baths',
    optional: true
  },
  img: {
    type: String,
    label: 'Image',
    optional: true
  },
  agent: {
    type: String,
    label: 'Agent',
    optional: true
  },
  contact: {
    type: String,
    label: 'Contact',
    optional: true
  }
});

Schemas.CalEvents = new SimpleSchema({
  startTime: {
    type: Date,
    label: 'Start time'
  }
});

Shortlists = new Meteor.Collection('shortlists');
CalEvents = new Meteor.Collection('calEvents');

Shortlists.attachSchema(Schemas.Shortlists);

Router.configure({
  // layoutTemplate: 'schedule'
});

Router.map(function () {
  this.route('schedule', {
    path: '/',
    template: 'schedule',
    waitOn: function () {
      return [
        Meteor.subscribe('shortlists'),
        Meteor.subscribe('calEvents')
      ];
    },
    data: function () {
      return {
        calEvents: CalEvents.find().fetch()
      }
    }
  });
  this.route('test', {
    path: '/test',
    template: 'test'
  });
});

if (Meteor.isClient) {
  // shortlistsHandle = Meteor.subscribe('shortlists');
  // calEventsHandle = Meteor.subscribe('calEvents');

  Session.setDefault('lastMod', null);
  Session.set('showEditEvent', false);
  Session.setDefault('editing_calendar', null);

  function shortlists () {
    return Shortlists.find();
  }

  Template.shortlists.helpers({
    shortlists: shortlists
  });

  Template.shortlist.rendered = function () {
    var draggableArgs = {
      appendTo: 'body',
      zIndex: 10000,
      // helper: 'clone',
      // opacity: 0.5,
      revert: 'invalid',
      scroll: false,
      snap: '.fc-widget-content',
      // snap: '.map',
      cursor: 'crosshair',
      cursorAt: {top: -10, left: 30}
      // snap: '#calendar'
    }
    $('.shortlist').draggable(draggableArgs);
  };

  Template.scheduleCalendar.rendered = function() {
    calEvents = this.data.calEvents;
    console.log(calEvents);
    $('.calendar').fullCalendar({
      header: {
        left: 'prev',
        center: 'title, month, agendaWeek',
        right: 'next'
      },
      eventStartEditable: true,
      // contentHeight: 544,
      // contentHeight: 300,
      defaultView: 'agendaWeek',
      allDaySlot: false,
      minTime: '08:00:00',
      maxTime: '23:00:00',
      slotEventOverlap: false,
      weekMode: 'liquid',
      events: function(start, end, timezone, callback) {

        var events = [];

        // calEvents = CalEvents.find();
        // console.log(calEvents);
        calEvents.forEach(function(evt) {
          events.push(evt);
        });

        callback(events);
      },
      dayClick: function (date, jsEvent, view) {
        Session.set('lastMod', moment());
        console.log(date);
        Session.set('currentTimeslotPicked', date);
        Session.set('showEditEvent', true);
        $('.editEvent').css('left', jsEvent.clientX + 20).css('top', jsEvent.clientY - 20);
      },
      eventClick: function (event, jsEvent, view) {
        console.log(event);
      }
    });

    // $('.fc-button-agendaWeek').click();
  };

  Template.scheduleCalendar.helpers({
    lastMod: function () {
      return Session.get('lastMod');
    },
    showEditEvent: function () {
      return Session.get('showEditEvent');
    },
    subReady: function () {
      // return calEventsHandle.ready();
    }
  });

  Template.editEvent.helpers({
    shortlists: shortlists,
    arraySource: function () {
      return {
        placeholder: 'Choose a unit...',
        tabindex: 5,
        options: {
          data: {
            results: function () {
              var shortlistsArray = [];
              var shortlists = shortlists();

              shortlists.forEach(function (shortlist) {
                shortlistsArray.push(shortlist);
              });
              console.log(shortlistsArray);
              return shortlistsArray;
            }
          }
        }
      }
    }
  });

  Template.editEvent.events({
    'click .submit-schedule': function (event) {
      event.preventDefault();
      Session.set('showEditEvent', false);

      console.log(Session.get('currentTimeslotPicked'));
    },
    'click .close-edit-event': function (e) {
      Session.set('showEditEvent', false);
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Shortlists.find().count() == 0) {
      Shortlists.insert({
        address: "#21 Holland Close",
        price: 3500,
        beds: 3,
        baths: 2,
        size: 1500,
        img: "shortlist-1.jpg",
        agent: "Eugene Koh",
        contact: "93488123"
      });

      Shortlists.insert({
        address: "#32 Holland Drive",
        price: 2700,
        beds: 1,
        baths: 1,
        size: 900,
        img: "shortlist-2.jpg",
        agent: "Alicia Ng",
        contact: "63490241"
      });

      Shortlists.insert({
        address: "St. Michael Place",
        price: 3200,
        beds: 2,
        baths: 1,
        size: 1200,
        img: "shortlist-3.jpg",
        agent: "Michel Kim",
        contact: "83420123"
      });
    }

    if (CalEvents.find().count() == 0) {
      CalEvents.insert({
        title: '#63 Beach Road',
        allDay: false,
        start: moment().set('hour', '9').set('minute', '30')._d,
        end: moment().set('hour', '10').set('minute', '0')._d
      });

      CalEvents.insert({
        title: '#9 Millenium Ave',
        allDay: false,
        start: moment().set('hour', '10').set('minute', '30')._d,
        end: moment().set('hour', '11').set('minute', '0')._d
      });

      CalEvents.insert({
        title: 'St. Patrick Dr',
        allDay: false,
        start: moment().add('1', 'days').set('hour', '11').set('minute', '0')._d,
        end: moment().add('1', 'days').set('hour', '11').set('minute', '30')._d
      });

      CalEvents.insert({
        title: 'Anyhow one',
        allDay: false,
        start: moment().add('2', 'days').set('hour', '12').set('minute', '0')._d,
        end: moment().add('2', 'days').set('hour', '12').set('minute', '30')._d
      });
    }
  });

  Meteor.publish('shortlists', function () {
    return Shortlists.find();
  });

  Meteor.publish('calEvents', function () {
    return CalEvents.find();
  });
}