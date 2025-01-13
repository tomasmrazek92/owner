let url = 'https://api.lever.co/v0/postings/owner?mode=json';

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
      // Els
      var positionList = $('.careers-roles_list');
      var positionItem = positionList.find('li').clone();

      // Clear the list
      positionList.empty();

      for (var x = 0; x < data.length; x++) {
        var currentItem = positionItem;
        currentItem.find('a').attr('href', data[x].hostedUrl);
        currentItem.find('[data-title]').text(data[x].text);
        currentItem.find('[data-category]').text(data[x].categories.team);
        currentItem.find('[data-location]').text(data[x].categories.allLocations.join(', '));
        positionList.append(currentItem.clone());
      }

      // Counter
      $('[roles-counter]').text(data.length);

      // Reveal the list
      positionList.css('opacity', '1');
    })
    .catch((error) => console.error('Error fetching data:', error));
}

if (window.location.pathname === '/careers/role') {
  var jobId = window.location.search.split('=')[1];
  console.log(jobId);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Filter the job by its ID
      let filteredJob = data.find((item) => item.id === jobId);

      if (filteredJob) {
        console.log('Filtered Job:', filteredJob);

        // Set page title dynamically
        document.title = filteredJob.text + ' | owner.com';

        // Update other elements with job details
        let name = $('[data-name]');
        let type = $('[data-type]');
        let location = $('[data-location]');
        let team = $('[data-team]');
        let detailLink = $('[data-link]');
        let detailOpening = $('[data-opening]');
        let detailHtml = $('[data-html]');
        let detailAdditional = $('[data-additional]');

        // Fix of EmploymentType
        function formatEmploymentType(type) {
          return type.replace(/([a-z])([A-Z])/g, '$1 $2');
        }
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
        type.text(filteredJob.categories.commitment);
        location.text(filteredJob.categories.location);
        team.text(filteredJob.categories.team);
        detailLink.attr('href', filteredJob.hostedUrl + '/apply');

        // Opening
        detailOpening.html(cleanInlineStyles(filteredJob.opening));

        // Detail
        detailHtml.html(cleanInlineStyles(filteredJob.descriptionBody));

        filteredJob.lists.forEach((item) => {
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
        detailAdditional.html(cleanInlineStyles(filteredJob.additional));

        // Reveal
        $('.section_job-role').addClass('rendered');
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
}
