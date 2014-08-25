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

Schemas.Timeslots = new SimpleSchema({
  startTime: {
    type: Date,
    label: 'Start time'
  }
});

Timeslots = new Meteor.Collection('timeslots');

Shortlists.attachSchema(Schemas.Shortlists);

if (Meteor.isClient) {
  Meteor.subscribe('shortlists');

  Template.shortlists.helpers({
    shortlists: function () {
      return Shortlists.find();
    }
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

  Template.schedule.rendered = function () {
    // $('.map').droppable('.shortlist');
    // $('.shortlists').droppbale('.shortlist');
  };
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
      };
    }

    if (Calendar.find().count() == 0) {
      Calendar.insert({
        title: '#63 Beach Road',
        allDay: false,
        start: 'Thu Aug 21 2014 11:00:00 GMT+0800 (SGT)',
        end: 'Thu Aug 21 2014 11:30:00 GMT+0800 (SGT)'
      });

      Calendar.insert({
        title: '#9 Millenium Ave',
        allDay: false,
        start: 'Thu Aug 21 2014 11:30:00 GMT+0800 (SGT)',
        end: 'Thu Aug 21 2014 12:00:00 GMT+0800 (SGT)'
      });

      Calendar.insert({
        title: 'St. Patrick Dr',
        allDay: false,
        start: 'Thu Aug 21 2014 16:00:00 GMT+0800 (SGT)',
        end: 'Thu Aug 21 2014 16:30:00 GMT+0800 (SGT)'
      });

      Calendar.insert({
        title: 'Anyhow one',
        allDay: false,
        start: 'Aug 21 2014 9:0:00 GMT+0800 (SGT)',
        end: 'Aug 21 2014 9:30:00 GMT+0800 (SGT)'
      });
    }
  });

  Meteor.publish('shortlists', function () {
    return Shortlists.find();
  })
}