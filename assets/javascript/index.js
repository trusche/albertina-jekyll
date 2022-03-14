
function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else { 
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  const sections = document.querySelectorAll('.fade-in-section');

  const config = {
    rootMargin: '20px 20px 20px 20px',
    threshold: [0.2]
  };

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0.2) {
        entry.target.classList.add("is-visible");
      }
    })
  }, config);

  sections.forEach(section => {
    observer.observe(section);
  });
});

function httpGet(url) {
    return new Promise(
        function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.onload = function () {
                if (this.status === 200) {
                    // Success
                    resolve(JSON.parse(this.response));
                } else {
                    // Something went wrong (404 etc.)
                    reject(new Error(this.statusText));
                }
            };
            request.onerror = function () {
                reject(new Error(
                    'XMLHttpRequest Error: '+this.statusText));
            };
            request.open('GET', url);
            request.send();
        });
}

httpGet('https://corpsweb.de/albertina/program.json')
.then(
    function (events) {
        let el = document.getElementById('termine');
        rowsHtml = '';
        events.map(function(event) {
          rowsHtml += `
            <tr>
              <th class='date'>${event['day']}</th>
              <td>${event['name']}</td>
              <td class='time'>${event['time'] || ''}</td>
            </tr>`
        });
        if (rowsHtml.length > 0) {
          el.innerHTML = rowsHtml;
        } else {
          el.innerHTML = "<tr><td colspan='3' class='text-center'>Kommt bald...</td></tr>"
        }
    },
    function (reason) {
        console.error('Something went wrong', reason);
    });
