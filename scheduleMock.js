Shortlists = new Meteor.Collection('shortlists');

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
  }
});

Schemas.Timeslots = new SimpleSchema({
  startTime: {
    type: Date,
    label: 'Start time'
  }
});

Timeslots = new Meteor.Collection('timeslots');

Shortlists.attachSchema(Schemas.Shortlists);

if (Meteor.isClient) {
  Template.shortlists.helpers({
    shortlists: function () {
      return Shortlists.find();
    }
  });

  Template.shortlists.rendered = function () {
    console.log($('.shortlist'));
  }

  Template.scheduleCalendar.rendered = function() {
    // var calHeight = $('#calendar').height() - 50;
    // $('#calendar').fullCalendar({
    //   header: {
    //     left: 'prev',
    //     center: 'title',
    //     right: 'next'
    //   },
    //   contentHeight: calHeight,
    //   defaultView: 'agendaDay',
    //   allDaySlot: false,
    //   minTime: '08:00:00',
    //   maxTime: '23:00:00',
    //   slotEventOverlap: false
    // });
  }

  // Template.calendar.rendered = function () {
    // var calHeight = $('.calendar').height() - 50;

    // $('#calendar').fullCalendar({
    //   header: {
    //     left: 'prev',
    //     center: 'title',
    //     right: 'next'
    //   },
    //   contentHeight: calHeight,
    //   defaultView: 'agendaDay',
    //   allDaySlot: false,
    //   minTime: '08:00:00',
    //   maxTime: '23:00:00',
    //   slotEventOverlap: false
    // });
  // }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Shortlists.find().count() == 0) {
      for (var i = 1; i >= 0; i--) {
        Shortlists.insert({
          address: "#21 Holland Close",
          price: 3500,
          beds: 3,
          baths: 2,
          size: 1500,
          img: "shortlist-1.jpg"
        });

        Shortlists.insert({
          address: "#32 Holland Drive",
          price: 2700,
          beds: 1,
          baths: 1,
          size: 900,
          img: "shortlist-2.jpg"
        });

        Shortlists.insert({
          address: "St. Michael Place",
          price: 3200,
          beds: 2,
          baths: 1,
          size: 1200,
          img: "shortlist-3.jpg"
        });
      };
    }

    if (Calendar.find().count() == 0) {
      Calendar.insert({
        title: '#63 Beach Road',
        allDay: false,
        start: 'Wed Aug 20 2014 11:00:00 GMT+0800 (SGT)',
        end: 'Wed Aug 20 2014 11:30:00 GMT+0800 (SGT)'
      });

      Calendar.insert({
        title: '#9 Millenium Ave',
        allDay: false,
        start: 'Wed Aug 20 2014 11:30:00 GMT+0800 (SGT)',
        end: 'Wed Aug 20 2014 12:00:00 GMT+0800 (SGT)'
      });

      Calendar.insert({
        title: 'St. Patrick Dr',
        allDay: false,
        start: 'Wed Aug 20 2014 16:00:00 GMT+0800 (SGT)',
        end: 'Wed Aug 20 2014 16:30:00 GMT+0800 (SGT)'
      });
    }
  });
}