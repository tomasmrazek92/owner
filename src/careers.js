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
      // Els
      var positionList = $('.careers-roles_list');
      var positionItem = positionList.find('li').clone();

      // Clear the list
      positionList.empty();

      for (var x = 0; x < roles.length; x++) {
        var currentItem = positionItem;
        currentItem.find('a').attr('href', '/careers/role?=' + roles[x].id);
        currentItem.find('[data-title]').text(roles[x].text);
        currentItem.find('[data-category]').text(roles[x].categories.team);
        currentItem.find('[data-location]').text(roles[x].categories.allLocations.join(', '));
        positionList.append(currentItem.clone());
      }

      // Counter
      $('[roles-counter]').text(roles.length);

      // Reveal the list
      positionList.css('opacity', '1');
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
