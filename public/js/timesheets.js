$(document).ready(function(){
  var timesheets = new Promise(function(resolve, reject) {
    getTimesheetDocument(parseTimesheets);

  /**
   * Scrapes the team's monthly timesheet page
   * @param {Function} callback
   */
    function getTimesheetDocument(callback) {
      $.ajax({
          url: '/api/v1/timesheetDocument',
          success: function(result) {
              callback(result.timesheetDocument);
          },
          error: function(error) {
              console.log(error);
          }
      });
    }
    /**
     * Parses the scraped timesheet page into an array of users and their percent logged
     * Resolves the promise of the timesheets variable
     * @param {String} timesheetDocument
     */
    function parseTimesheets(timesheetDocument) {
      var timesheetDocumentWrapper = document.createElement('div');
      timesheetDocumentWrapper.innerHTML = timesheetDocument;

      var rowsCollection = $(timesheetDocument).find('.mainlog');
      var rows = Array.prototype.slice.call( rowsCollection );
      var users = [];

      rows.forEach(function(row) {
        var user = {};
        user.username = $( $(row).find('.username')[0] ).attr('data-tempo-user');
        user.percentLogged = parseInt($( $(row).find('.color-percentage')[0] ).text().replace(/\s/g, "").split('%')[0]);
        user.displayName = $( $(row).find('.username')[0] ).first().text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        if (photoCollection.hasOwnProperty(user.username)) {
          user.photos = photoCollection[user.username]['photos'];
        } else {
          user.photos = ["img/thumb-1.jpg", "img/thumb-2.jpg", "img/thumb-3.jpg", "img/thumb-4.jpg"];
        }
        if (excludedUsers.indexOf(user.username) > -1) {
          user.excluded = true;
        } else {
          user.excluded = false;
        }
        users.push(user);
      });

      console.log(users);
      console.log(rows);

      if (users.length > 0) {
        resolve(users);
      } else {
        reject(Error('No timesheets could be fetched'));
      }
    }
  });

  timesheets.then(function(result) {
    displayDeliquents(result);
  }, function(err) {
    console.log(err);
  });

  function displayDeliquents(users) {
    // sort the users by their percentLogged
    users.sort(percentLoggedDesc);
    // remove the loading icon
    $('#loading-icon').remove();
    // if the user has less than 90% of their time logged, add them to the page
    users.forEach(function(user) {
      if (user.percentLogged < 90 && !user.excluded) {
        addDeliquentToPage(user);
      }
    });
    // load the carousel javascript
    $.ajax({
      url: '/js/main.js',
      dataType: "script",
      success: function(result) {
        console.log('loaded script');
      },
      error: function(error) {
        console.log(error);
      }
    });

    // sort the deliquents by percentLogged
    function percentLoggedDesc(a,b) {
      if (a.percentLogged < b.percentLogged) {
        return -1;
      } else if (a.percentLogged > b.percentLogged) {
        return 1;
      } else {
        return 0;
      }
    }
    // add the deliquent to the page
    function addDeliquentToPage(user) {
      var deliquentHTML = '<li>\
  			<ul id="photos_' + user.username + '" class="cd-item-wrapper">\
  				<!-- <li class="cd-item-out">...</li> -->\
  			</ul> <!-- cd-item-wrapper -->\
  			<div class="cd-item-info">\
  				<b><a href="#0">' + user.displayName + '</a></b>\
          <div class="pull-right" style="padding-top:10px">\
            <input type="text" id="' + user.username + '-chart" value="' + user.percentLogged + '">\
          </div>\
        </div> <!-- cd-item-info -->\
  			<nav>\
  				<ul class="cd-item-navigation">\
  					<li><a class="cd-img-replace" href="#0">Prev</a></li>\
  					<li><a class="cd-img-replace" href="#0">Next</a></li>\
  				</ul>\
  			</nav>\
  			<a class="cd-3d-trigger cd-img-replace" href="#0">Open</a>\
  		</li>';

      $('#cd-gallery-items').append(deliquentHTML);

      var photoDiv = $('#photos_' + user.username);
      var i = 0;
      var className = "";
      while (i < user.photos.length && i < 4) {
        switch(i) {
          case 0:
            className = "cd-item-front";
            break;
          case 1:
            className = "cd-item-middle";
            break;
          case 2:
            className = "cd-item-back";
            break;
          case 3:
            className = "cd-item-out";
            break;
        }
        $(photoDiv).append('<li class="' + className + '"><a href="#0"><img src="' + user.photos[i] + '"></a></li>');
        i++;
      }
      // user.photos.forEach(function(photo) {
      //   photoDiv.append('<li class="cd-item-front"><a href="#0"><img src="' + photo + '"></a></li>');
      // });

      $('#' + user.username + '-chart').knob({
        readOnly: true,
        width: 50,
        height: 50,
        thickness: 0.1,
        fgColor: '#7385ad',
        bgColor: '#d8d8d8'
      });
    }
  }

});
