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
  loadingTemplate: 'loading',
  waitOn: function () {
    return [
      Meteor.subscribe('shortlists'),
      Meteor.subscribe('calEvents')
    ]
  },
  // onBeforeAction: function (pause) {
    // this.render('loading');
    // pause();
  // }
});

Router.map(function () {
  this.route('schedule', {
    path: '/',
    template: 'schedule',
    data: function () {
      return {calEvents: CalEvents.find()}
    }
  });
  this.route('test', {
    path: '/test',
    template: 'test'
  });
});

Router.onBeforeAction('loading');

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
    var calEvents = this.data.calEvents;
    console.log('calEvents length: ' + calEvents.count());

    var options = {
      header: {
        left: 'prev',
        center: 'title, month, agendaWeek, agendaDay',
        right: 'next'
      },
      eventStartEditable: true,
      // contentHeight: 544,
      // contentHeight: 300,
      defaultView: 'agendaDay',
      allDaySlot: false,
      minTime: '08:00:00',
      maxTime: '23:00:00',
      slotEventOverlap: false,
      weekMode: 'liquid',
      // aspectRatio: 2,
      // weekends: false,
      events: function(start, end, timezone, callback) {

        var events = [];

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
      },
      eventRender: function (event, element, view) {
        if (view.name === 'agendaDay') {
          element.html('<div class="shortlist calEvent"><div class="info"><h3>' + event.title + '</h3><ul class="sub-info list-inline"><li><h5>' + event.price + '</h5>per month</li><li><h5>' + event.beds + '</h5>beds</li><li><h5>' + event.size + '</h5>sqr feet</li><li><h5>' + event.contact + '</h5>' + event.agent + '</li></ul></div></div>');
          // <div class="img" style="{background-image: url("../' + event.img + '")}"></div>
        }
      }
    }

    this.$('.calendar').fullCalendar(options);

    this.autorun(_.bind(function () {
      var calEvents = CalEvents.find();

      // calEvents.map(function (calEvent) {});

      Deps.afterFlush(_.bind(function () {
        this.$('.calendar').data('fullCalendar').reinit(options)
      }), this);

    }), this);
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

      Shortlists.insert({
        address: "Heaven Palace",
        price: 5300,
        beds: 4,
        baths: 3,
        size: 2000,
        img: "shortlist-1.jpg",
        agent: "Don Master",
        contact: "94293841"
      });
    }

    if (CalEvents.find().count() == 0) {
      CalEvents.insert({
        shortlistId: 'yK6ZrEgqFdnL8aBm8',
        title: '#21 Holland Close',
        allDay: false,
        start: moment().set('hour', '9').set('minute', '30')._d,
        end: moment().set('hour', '10').set('minute', '0')._d,
        price: 3500,
        beds: 3,
        baths: 2,
        size: 1500,
        img: "shortlist-1.jpg",
        agent: "Eugene Koh",
        contact: "93488123"
      });

      CalEvents.insert({
        shortlistId: '6sa58GBBJD33oQ3ei',
        title: 'St. Michael Place',
        allDay: false,
        start: moment().set('hour', '10').set('minute', '30')._d,
        end: moment().set('hour', '11').set('minute', '0')._d,
        price: 3200,
        beds: 2,
        baths: 1,
        size: 1200,
        img: "shortlist-3.jpg",
        agent: "Michel Kim",
        contact: "83420123"
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