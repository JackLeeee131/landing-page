function handle(e) {
  var value = ppAmpSearchBox_320397_facadeInput.value;
  if (e.key == ' ') {
    addItem('data', value, 3);
    console.log('adding history');
  } else {
    console.log('other key: ' + e.key);
  }
}

function clicked(e) {
  ppAmpSearchBox_320397_facadeInput.value = e.innerText;
}

function addItem(cname, data) {
  if (localStorage.getItem(cname) != null) {
    var delimiter = ', ';
    var lsdata = localStorage.getItem(cname);
    lsdata = data + delimiter + lsdata;
  } else {
    localStorage.setItem(cname, data);
  }
}

function getItems(cname) {
  var items = JSON.parse(localStorage.getItem('data'));
  return items;
}

if (typeof Storage !== 'undefined') {
  localStorage.setItem('data', 'halooo');
  var ls = localStorage.getItem('data');
  console.log(ls);
} else {
  console.log('no support');
}

