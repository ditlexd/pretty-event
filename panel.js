function refreshPayloads() {
  var filterValue = document.getElementById('filter').value;

  chrome.runtime.sendMessage({method: "getPayloads"}, function(response) {
    var container = document.getElementById('payloads');
    container.innerHTML = '';

    for (var payload of response.payloads) {
      try {
        var jsonData = JSON.parse(payload.body);

        // Stringify the JSON data and check if it includes the filter value
        if (!filterValue || JSON.stringify(jsonData).includes(filterValue)) {
          var div = document.createElement('div');
          var h3 = document.createElement('h3');
          h3.textContent = 'URL: ' + payload.url;
          div.appendChild(h3);

          var table = createTable(jsonData);
          div.appendChild(table);

          container.appendChild(div);
        }
      } catch(e) {
        var errorDiv = document.createElement('div');
        errorDiv.textContent = 'Unable to parse JSON: ' + payload.body;
        div.appendChild(errorDiv);
      }
    }
  });
}


function createTable(data, level = 0) {
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  table.appendChild(tbody);

  if (level === 0) {
    var tr = document.createElement('tr');

    var th1 = document.createElement('th');
    th1.textContent = 'Key';
    tr.appendChild(th1);

    var th2 = document.createElement('th');
    th2.textContent = 'Value';
    tr.appendChild(th2);

    tbody.appendChild(tr);
  }

  for (var key in data) {
    var tr = document.createElement('tr');

    var keyTd = document.createElement('td');
    keyTd.textContent = key
    tr.appendChild(keyTd);

    var valueTd = document.createElement('td');
    if (typeof data[key] === 'object' && data[key] !== null) {
      valueTd.appendChild(createTable(data[key], level + 1));
    } else {
      valueTd.textContent = data[key];
    }

    valueTd.classList.add('value');  // Add the 'value' class
    tr.appendChild(valueTd);

    tbody.appendChild(tr);
  }

  return table;
}



document.getElementById('clear').addEventListener('click', function() {
  chrome.runtime.sendMessage({method: "clearPayloads"});
});

document.getElementById('filter').addEventListener('input', refreshPayloads);

setInterval(refreshPayloads, 1000);