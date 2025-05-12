let url = 'https://lever.ownerengineering.com/postings';

if (window.location.pathname === '/careers') {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      let roles = data.data;
      console.log(data.data);

      var teamListElement = $('.careers-roles_team-list');
      var teamTemplate = teamListElement.children('li').clone();

      teamListElement.empty();

      var groupedRoles = {};

      for (var i = 0; i < roles.length; i++) {
        var { team } = roles[i].categories;

        if (!groupedRoles[team]) {
          groupedRoles[team] = [];
        }

        groupedRoles[team].push(roles[i]);
      }

      var teams = Object.keys(groupedRoles).sort();

      console.log(groupedRoles);

      for (var t = 0; t < teams.length; t++) {
        var team = teams[t];
        var teamRoles = groupedRoles[team];

        teamRoles.sort(function (a, b) {
          return a.text.localeCompare(b.text);
        });

        var currentTeam = teamTemplate.clone();

        currentTeam.find('[data-team-name]').text(team);

        var rolesList = currentTeam.find('.careers-roles_list');
        var roleTemplate = rolesList.find('li').clone();

        rolesList.empty();

        for (var r = 0; r < teamRoles.length; r++) {
          var currentRole = roleTemplate.clone();
          currentRole.find('a').attr('href', '/careers/role?=' + teamRoles[r].id);
          currentRole.find('[data-title]').text(teamRoles[r].text);
          currentRole.find('[data-category]').text(teamRoles[r].categories.team);
          currentRole.find('[data-location]').text(teamRoles[r].categories.allLocations.join(', '));
          rolesList.append(currentRole);
        }

        teamListElement.append(currentTeam);
      }

      $('[roles-counter]').text(roles.length);
      teamListElement.css('opacity', '1');
      $('.careers-roles_list').css('opacity', '1');
    })
    .catch((error) => console.error('Error fetching data:', error));
}

if (window.location.pathname === '/careers/role') {
  var jobId = window.location.search.split('=')[1];

  // Fetch and Display Data
  fetch(`${url}/${jobId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.data.posting);
      // Filter the job by its ID
      let filteredJob = data.data.posting;

      if (filteredJob) {
        console.log('Filtered Job:', filteredJob);

        // Set page title dynamically
        document.title = filteredJob.text + ' | owner.com';

        // Update other elements with job details
        let name = $('[data-role-title]');
        let location = $('[data-role-location]');
        let type = $('[data-role-type]');
        let detailLink = $('[data-role-link]');
        let detailOpening = $('[data-role-opening]');
        let detailHtml = $('[data-role-html]');
        let detailAdditional = $('[data-role-additional]');

        function cleanInlineStyles(htmlString) {
          // Create a temporary div with the HTML content
          let $temp = $('<div>').html(htmlString);

          // Remove all style attributes from all elements
          $temp.find('*').removeAttr('style');

          // Return the cleaned HTML string
          return $temp.html();
        }

        // Data
        name.text(filteredJob.text);
        location.text(filteredJob.categories.location);

        // Categories
        let details = [];
        if (filteredJob.categories.commitment) {
          details.push(filteredJob.categories.commitment);
        }
        if (filteredJob.categories.team) {
          details.push(filteredJob.categories.team);
        }
        let combinedDetails = details.join(' / ');
        type.text(combinedDetails);

        // Link
        detailLink.attr('href', filteredJob.urls.apply);

        // Opening
        detailOpening.html(cleanInlineStyles(filteredJob.content.descriptionHtml));

        filteredJob.content.lists.forEach((item) => {
          // Create the HTML elements
          let listSection = $('<div>');
          let heading = $('<h3>').text(item.text);
          let list = $('<ul>').html(item.content);

          // Append heading and list to the section
          listSection.append(heading).append(list);

          // Append the entire section to detailHtml
          detailHtml.append(listSection);
        });

        // Additional
        detailAdditional.html(cleanInlineStyles(filteredJob.content.closing));

        // Reveal
        $('.section_job-role').addClass('rendered');
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
}
