// These are the MLB team names and ballpark locations.
var teams = [
        {
          title: 'Boston Red Sox',
          location: {lat: 42.346676400, lng: -71.097217800}
        },
        {
          title: 'New York Yankees',
          location: {lat: 40.829642600, lng: -73.926174500}
        },
        {
          title: 'Tampa Bay Rays',
          location: {lat: 27.768224600, lng: -82.653392100}
        },
        {
          title: 'Toronto Blue Jays',
          location: {lat: 43.641437800, lng: -79.389353200}
        },
        {
          title: 'Baltimore Orioles',
          location: {lat: 39.284051600, lng: -76.621511700}
        },
        {
          title: 'Cleveland Indians',
          location: {lat: 41.496211000, lng: -81.685228900}
        },
        {
          title: 'Minnesota Twins',
          location: {lat: 44.981712100, lng: -93.277759900}
        },
        {
          title: 'Kansas City Royals',
          location: {lat: 39.051671900, lng: -94.480314200}
        },
        {
          title: 'Chicago White Sox',
          location: {lat: 41.829902100, lng: -87.633752200}
        },
        {
          title: 'Detroit Tigers',
          location: {lat: 42.338998400, lng: -83.048519700}
        },
        {
          title: 'Houston Astros',
          location: {lat: 29.757268400, lng: -95.355518500}
        },
        {
          title: 'Los Angeles Angels',
          location: {lat: 33.800308000, lng: -117.882732100}
        },
        {
          title: 'Seattle Mariners',
          location: {lat: 47.591390800, lng: -122.332327400}
        },
        {
          title: 'Texas Rangers',
          location: {lat: 32.751280200, lng: -97.082504400}
        },
        {
          title: 'Oakland Athletics',
          location: {lat: 37.751594600, lng: -122.200545800}
        },
        {
          title: 'Washington Nationals',
          location: {lat: 38.873010200, lng: -77.007432900}
        },
        {
          title: 'Miami Marlins',
          location: {lat: 25.778317600, lng: -80.219597000}
        },
        {
          title: 'Atlanta Braves',
          location: {lat: 33.890700300, lng: -84.467684100}
        },
        {
          title: 'New York Mets',
          location: {lat: 40.757087700, lng: -73.845821300}
        },
        {
          title: 'Philadelphia Phillies',
          location: {lat: 39.906057200, lng: -75.166495200}
        },
        {
          title: 'Chicago Cubs',
          location: {lat: 41.948438400, lng: -87.655332700}
        },
        {
          title: 'Milwaukee Brewers',
          location: {lat: 43.028204100, lng: -87.971257600}
        },
        {
          title: 'St. Louis Cardinals',
          location: {lat: 38.622618800, lng: -90.192820900}
        },
        {
          title: 'Pittsburgh Pirates',
          location: {lat: 40.446854800, lng: -80.005665700}
        },
        {
          title: 'Cincinnati Reds',
          location: {lat: 39.097931300, lng: -84.508151000}
        },
        {
          title: 'Los Angeles Dodgers',
          location: {lat: 34.073851000, lng: -118.239958300}
        },
        {
          title: 'Arizona Diamondbacks',
          location: {lat: 33.445526400, lng: -112.066664100}
        },
        {
          title: 'Colorado Rockies',
          location: {lat: 39.755882300, lng: -104.994178100}
        },
        {
          title: 'San Diego Padres',
          location: {lat: 32.707656300, lng: -117.156904300}
        },
        {
          title: 'San Francisco Giants',
          location: {lat: 37.778595100, lng: -122.389269800}
        }
    ];

// Create a new blank array for all the ballpark/team markers.
var markers = [];

// Define elements of a team object.
var Team = function (data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.marker = data.marker;
};

var ViewModel = function() {
    var self = this;

    this.initMap = function() {
    // Constructor creates a new map centered on the continental US.
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.8283, lng: -98.5795},
      zoom: 4,
      mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();

    // The following loop uses the teams array to create an array of markers
    // on initialize.
    for (var i = 0; i < teams.length; i++) {
      // Get the position from the teams array.
      var position = teams[i].location;
      var title = teams[i].title;
      // Create a marker per team, and put into the markers array.
      var image = 'images/baseball.jpg';
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: image,
        id: i,
        visible: true
      });

      // Push the marker to an array of markers.
      markers.push(marker);

      // Add the marker object as a property to the respective team object
      // in the teams array in the model.
      teams[i].marker = marker;

      // Create an onclick event to open the large infowindow at each marker
      // and get the Wikipedia articles for that specific team.
      marker.addListener('click', function() {
        self.populateInfoWindow(this, largeInfowindow);
        var team = self.getTeam(this);
        self.loadData(team);
      });

      // Two event listeners - one for mouseover, one for mouseout,
      // to change the image of the marker.
      marker.addListener('mouseover', function() {
        this.setIcon('images/maps_180709_POI_stadium_EN.gif');
      });
      marker.addListener('mouseout', function() {
        this.setIcon('images/baseball.jpg');
      });
    }

    // This function populates the infowindow when the marker is clicked or
    // when the team name in the list is clicked. Only one infowindow will
    // open at a time at the corresponding marker and populate based on that
    // marker's position.
    this.populateInfoWindow = function(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      // Clear the infowindow content to give the streetview time to load.
      infowindow.setContent('');
      infowindow.marker = marker;
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
      var streetViewService = new google.maps.StreetViewService();
      var radius = 50;
      // If the status is OK, meaning the pano was found, compute the
      // position of the streetview image, then calculate the heading, then
      // get a panorama from that and set the options.
      var getStreetView = function(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
          var nearStreetViewLocation = data.location.latLng;
          var heading = google.maps.geometry.spherical.computeHeading(
            nearStreetViewLocation, marker.position);
            infowindow.setContent('<div><b>' + marker.title + '</b></div>' +
              '<div id="pano"></div>');
            var panoramaOptions = {
              position: nearStreetViewLocation,
              pov: {
                heading: heading,
                pitch: 30
              }
            };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
        } else {
          infowindow.setContent('<div>' + marker.title + '</div>' +
            '<div>No Street View Found</div>');
        }
      };
      // Use streetview service to get the closest streetview image within
      // 50 meters of the markers position.
      streetViewService.getPanoramaByLocation(marker.position, radius,
        getStreetView);
      // Open the infowindow on the corresponding marker.
      infowindow.open(map, marker);
    }
    };
    };
    //end of initMap

    // Create a new blank observable array to hold the list of team objects.
    this.teamList = ko.observableArray([]);

    // Loop through the teams array and create a new team object for each
    // team and push it to the teamList observable array.
    teams.forEach(function(team) {
        self.teamList.push( new Team(team) );
    });

    // When a team in the list is clicked, ensure the corresponding marker
    // is made visible, turn off any animation that may currently be happening
    // on any other marker, make the corresponding marker bounce, open the
    // corresponding infowindow, and lastly get the Wikipedia articles for
    // that team.
    this.setCurrentTeam = function(team) {
        var teammarker = self.getTeamMarker(team);
        teammarker.setVisible(true);
        self.animationOff();
        teammarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ teammarker.setAnimation(null); }, 4200);
        self.populateInfoWindow(teammarker, largeInfowindow);
        self.loadData(team);
    },

    // Gets the corresponding team for the selected marker.
    this.getTeam = function(marker) {
        for (var i = 0; i < self.teamList().length; i++) {
            if(self.teamList()[i].title().toLowerCase() ===
                marker.title.toLowerCase()) {
                return self.teamList()[i];
            }
        }
    };

    // Gets the corresponding marker for the selected team.
    this.getTeamMarker = function(team) {
        for (var i = 0; i < markers.length; i++) {
            if(markers[i].title.toLowerCase() === team.title().toLowerCase()) {
                return markers[i];
            }
        }
    };

    // Turn off all marker's animation.
    this.animationOff = function() {
      for (var i = 0; i < markers.length; i++) {
          markers[i].setAnimation(null);
      }
    };

    // This function queries the Wikipedia website via an ajax request using
    // the Wikipedia api and then interfacing with the View creates a list of
    // Wikipedia articles.
    this.loadData = function(team) {
        var $wikiElem = $('#wikipedia-links');
        // Clear out old data before new request.
        $wikiElem.text("");
        // Load wikipedia data.
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch' +
            '&search=' + team.title() + '&format=json&callback=wikiCallback';
        var wikiRequestTimeout = setTimeout(function(){
            $wikiElem.text("failed to get wikipedia resources");
        }, 8000);

        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            jsonp: "callback",
            success: function( response ) {
                var articleList = response[1];
                for (var i = 0; i < articleList.length; i++) {
                    var articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $wikiElem.append('<li><a href="' + url + '" ' +
                      ' target="_blank">' + articleStr + '</a></li>');
                }
                clearTimeout(wikiRequestTimeout);
            }
        });
    };

    // Creates an observable variable where the user input comes in from the
    // filter input box in the View.
    this.filter = ko.observable();

    // Filter the teams using the filter text and turning the marker off as the
    // team no longer appears in the list.
    this.filteredTeams = ko.computed(function(){
        return this.teamList().filter(function(team){
            if(!self.filter() || team.title().toLowerCase().indexOf(
                self.filter().toLowerCase()) !== -1) {
                return team;
            } else {
                    var teammarker = self.getTeamMarker(team);
                    teammarker.setVisible(false);
              }
        });
    }, this);

    // Makes the marker visible again once the team reappears in the list and
    // is no longer filtered out.
    this.markerVisible = ko.computed(function(){
        this.filteredTeams().forEach(function(team) {
            for (var i = 0; i < markers.length; i++) {
                if(markers[i].title.toLowerCase() ===
                    team.title().toLowerCase()) {
                  markers[i].setVisible(true);
                }
            }
        });
    }, this);

    // Removes any info from the filter and sets all markers visible.
    this.showAll = function() {
        this.filter(null);
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(true);
        }
    };

    // Closes the infowindow if it was left open and sets all markers to not
    // visible.
    this.hideAll = function() {
        largeInfowindow.close();
        for (var i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
    };
};

var viewModel = new ViewModel();

ko.applyBindings(viewModel);



