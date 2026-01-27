let url = 'https://api.ashbyhq.com/posting-api/job-board/Owner';

if (window.location.pathname === '/careers') {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      let roles = data.jobs;

      var groupedRoles = {};

      for (var i = 0; i < roles.length; i++) {
        var team = roles[i].team;
        if (!groupedRoles[team]) {
          groupedRoles[team] = [];
        }
        groupedRoles[team].push(roles[i]);
      }

      var teams = Object.keys(groupedRoles).sort();
      console.log(teams);
      var html = '';

      for (var t = 0; t < teams.length; t++) {
        var team = teams[t];
        var teamRoles = groupedRoles[team];

        teamRoles.sort(function (a, b) {
          return a.title.localeCompare(b.title);
        });

        var rolesHtml = '';

        for (var r = 0; r < teamRoles.length; r++) {
          rolesHtml += `<li><a href="/careers/role?=${teamRoles[r].id}" target="_blank" class="careers-roles_item w-inline-block"><p data-title="" id="w-node-_86bb2348-612f-64e3-1a96-c5d8e0401310-9fbcf1de" class="h15">${teamRoles[r].title}</p><div id="w-node-_86bb2348-612f-64e3-1a96-c5d8e0401312-9fbcf1de" class="text-color-content-quaternary"><p data-category="" class="h15">${teamRoles[r].team}</p></div><div id="w-node-_86bb2348-612f-64e3-1a96-c5d8e0401315-9fbcf1de" class="text-color-content-quaternary"><p data-location="" class="h15">${teamRoles[r].location}</p></div><div id="w-node-_86bb2348-612f-64e3-1a96-c5d8e0401318-9fbcf1de" class="button is-link is-role"><p class="h15">Apply Now</p><div class="button_arrow cc-inherit"><div class="button_arrow-tail w-embed"><svg width="100%" height="100%" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><div class="button_arrow-head w-embed"><svg width="100%" height="100%" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L5 6L1 10.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"></path></svg></div></div></div></a></li>`;
        }

        html += `<li><div class="margin-bottom margin-12"><p class="h24" data-team-name="">${team}</p></div><ul class="careers-roles_list">${rolesHtml}</ul></li>`;
      }

      document.querySelector('.careers-roles_team-list').innerHTML = html;
      document.querySelector('[roles-counter]').textContent = roles.length;
      document.querySelector('.careers-roles_team-list').style.opacity = '1';
      document.querySelectorAll('.careers-roles_list').forEach((el) => (el.style.opacity = '1'));
    })
    .catch((error) => console.error('Error fetching data:', error));
}

if (window.location.pathname === '/careers/role') {
  var jobId = window.location.search.split('=')[1];

  // Fetch and Display Data
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      let filteredJob = data.jobs.find((job) => job.id === jobId);

      if (filteredJob) {
        console.log('Filtered Job:', filteredJob);

        document.title = filteredJob.title + ' | owner.com';

        let name = $('[data-role-title]');
        let location = $('[data-role-location]');
        let type = $('[data-role-type]');
        let detailLink = $('[data-role-link]');
        let detailOpening = $('[data-role-opening]');
        let detailHtml = $('[data-role-html]');
        let detailAdditional = $('[data-role-additional]');

        function cleanInlineStyles(htmlString) {
          let $temp = $('<div>').html(htmlString);
          $temp.find('*').removeAttr('style');
          return $temp.html();
        }

        name.text(filteredJob.title);
        location.text(filteredJob.location);

        let details = [];
        if (filteredJob.employmentType) {
          details.push(filteredJob.employmentType);
        }
        if (filteredJob.team) {
          details.push(filteredJob.team);
        }
        let combinedDetails = details.join(' / ');
        type.text(combinedDetails);

        detailLink.attr('href', filteredJob.jobUrl);

        detailOpening.html(cleanInlineStyles(filteredJob.descriptionHtml));

        $('.section_job-role').addClass('rendered');
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
}
