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

Shortlists = new Meteor.Collection('shortlists');
CalEvents = new Meteor.Collection('calEvents');

Shortlists.attachSchema(Schemas.Shortlists);

Router.configure({
  loadingTemplate: 'loading',
  waitOn: function () {
    return [
      Meteor.subscribe('shortlists'),
      Meteor.subscribe('calEvents')
    ]
  }
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
  var tmpEditEvent = null;
  Meteor.startup(function () {
    tmpEditEvent = UI.render(Template.editEvent)
    UI.insert(tmpEditEvent, document.body);
  });
  // shortlistsHandle = Meteor.subscribe('shortlists');
  // calEventsHandle = Meteor.subscribe('calEvents');

  showEditEventDeps = new Deps.Dependency
  var showEditEvent = false;
  getShowEditEvent = function() {
    showEditEventDeps.depend();
    return showEditEvent;
  }
  setShowEditEvent = function(value) {
    showEditEvent = value;
    showEditEventDeps.changed();
  }
  Deps.autorun(function () {
    var t = getShowEditEvent();
    if(t){
      // show
      console.log('show', tmpEditEvent);
      if(tmpEditEvent)
        $(tmpEditEvent.view._templateInstance.find('.editEvent')).removeClass('hide');
    }
    else {
      // hide
      console.log('hide');
      if(tmpEditEvent)
        $(tmpEditEvent.view._templateInstance.find('.editEvent')).addClass('hide');
    }
  });






  // Session.setDefault('showEditEvent', false);
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
      // opacity: 0.5,xe
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
    var options = {
      header: {
        left: 'month, agendaDay',
        center: 'title',
        right: 'prev, next'
      },
      eventStartEditable: true,
      contentHeight: $('.map').height() - 50,
      defaultView: 'agendaDay',
      allDaySlot: false,
      minTime: '08:00:00 GMT+0800 (SGT)',
      maxTime: '23:00:00 GMT+0800 (SGT)',
      slotEventOverlap: false,
      weekMode: 'liquid',
      timezone: 'Asia/Saigon',
      columnFormat: {
        day: ''
      },
      titleFormat: {
        day: 'D MMM'
      },
      events: function(start, end, timezone, callback) {

        var events = [];

        calEvents.forEach(function(evt) {
          events.push(evt);
        });

        callback(events);
      },
      dayClick: function (date, jsEvent, view) {
        var currentDate = moment(date._d).set('hour', date._i[3])._d;
        Session.set('currentTimeslotPicked', currentDate);
        

        //Session.set('showEditEvent', true);
        setShowEditEvent(true);


        Deps.afterFlush(function () {
          $('.editEvent').css('left', jsEvent.clientX + 20).css('top', jsEvent.clientY - 20);
        });
      },
      eventClick: function (event, jsEvent, view) {
        console.log(event);
      },
      // eventColor: 'white',
      eventRender: function (event, element, view) {
        if (view.name === 'agendaDay') {
          element.html('<div class="shortlist calEvent"><img class="img" src="../' + event.img + '" alt=""><div class="info"><h3>' + event.address + '</h3><ul class="sub-info list-inline"><li><h5>' + event.price + '</h5>per month</li><li><h5>' + event.beds + '</h5>beds</li><li><h5>' + event.size + '</h5>sqr feet</li><li><h5>' + event.contact + '</h5>' + event.agent + '</li></ul></div></div>');
          // <div class="img" style="{background-image: url("..\u2215' + event.img + '")}"></div>
        }
      }
    }

    this.$('.calendar').fullCalendar(options);

    // Create a computation to rerun everytime events data changed
    this.autorun(_.bind(function () {
      var calEvents = CalEvents.find();

      calEvents.map(function (calEvent) {
        // body...
      })

      Deps.afterFlush(_.bind(function () {
        // reinitiate calendar
        // console.log(this.$('.calendar').data('fullCalendar'));
        this.$('.calendar').data('fullCalendar').refetchEvents();
        // this.$('.calendar').fullCalendar(options);
      }), this);
    }), this);
  };

  Template.scheduleCalendar.helpers({
    isEditEvent: function () {
      console.log('show');
      // return Session.get('showEditEvent');
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
    },
    scheduleStart: function () {
      return moment(Session.get('currentTimeslotPicked')).format('h:mm a');
    },
    scheduleEnd: function () {
      return moment(Session.get('currentTimeslotPicked')).add(30, 'minutes').format('h:mm a');
    }
  });

  Template.editEvent.events({
    'click .submit-schedule': function (event) {
      event.preventDefault();
      

      //console.log('insert call');
      //Session.set('showEditEvent', false);
      setShowEditEvent(false);
      
      Deps.nonreactive(function () {
        Deps.afterFlush(function () {
          var newEvent = {
            start: Session.get('currentTimeslotPicked'),
            end: moment(Session.get('currentTimeslotPicked')).add(30, 'minutes')._d
          }
          var scheduleUnit = _.omit(Shortlists.findOne({_id: Session.get('scheduleUnitId')}), '_id');

          _.extend(newEvent, scheduleUnit);
          console.log('insert');
          console.trace();
          CalEvents.insert(newEvent);
        });
      });
    },
    'click .close-edit-event': function (e) {
      // Session.set('showEditEvent', false);
      setShowEditEvent(false);
    },
    'change #schedule-select': function (event) {
      Session.set('scheduleUnitId', event.target.value);
    }
  });

  Template.editEvent.destroyed = function () {
    console.log('editEvent template is destroyed');
    console.log('_______________________________');
  };

  Template.editEvent.created = function () {
    console.log('editEvent template is created');
  };

  Template.eventDetail.helpers({
    data: function() {
      return {
        address: "#21 Holland Close",
        price: 3500,
        beds: 3,
        baths: 2,
        size: 1500,
        img: "shortlist-1.jpg",
        agent: "Eugene Koh",
        contact: "93488123",
        start: "8.30am Wednesday Aug 27th 2014",
        end: "9am Wednesday Aug 27th 2014"
      };
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
  });

  Meteor.publish('shortlists', function () {
    return Shortlists.find();
  });

  Meteor.publish('calEvents', function () {
    return CalEvents.find();
  });
}