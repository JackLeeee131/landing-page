var saveFunction = function(e) {
  var payloadJson = localStorage.getItem("payload");
  // e.preventDefault();
  var payload = JSON.parse(payloadJson);
  function create_UUID(){

    // Getting Seconds since 1 January 1970 00:00:00.
    var dt = new Date().getTime();
    // Replace every letter using below funtion
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        // Getting random number less than 16
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        // Return Hexadecimal
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
  var uuid, oldData = [];
  if (payloadJson) {
    uuid = payload.uuid;
    oldData = payload.parcelIdHistory;
  }
  else uuid = create_UUID();
  console.log(16 | 0);
  console.log(uuid)
  var arrayData = oldData.length ? oldData.split('~'): [];
  var newData = document.querySelector('#ppAmpSearchBox_320397_frm')['pParcelIds'].value;
  var newArrayData = newData.split('~');
  var parcelIdList = newData;
  var addArray = newArrayData.filter(item => arrayData.indexOf(item) == -1);
  var realArray = arrayData.concat(addArray);
  var parcelIdHistory = realArray.slice(-10).join('~');
  var payload = {uuid: uuid, parcelIdList: parcelIdList, parcelIdHistory: parcelIdHistory};
  localStorage.setItem("payload", JSON.stringify(payload));
  if(e == undefined) document.querySelector('#ppAmpSearchBox_320397_frm').submit();
}
document.querySelector('#ppAmpSearchBox_320397_frm').addEventListener('submit', saveFunction)

function addSearchbox(value) {
  // var initValue = document.getElementById('ppAmpSearchBox_320397_hiddenInput').value;
  var initValue = document.getElementById('ppAmpSearchBox_320397_hiddenInput').value;
  var oldValue = document.getElementById('ppAmpSearchBox_320397_facadeInput').value;
  // SeparatorCharacter = [" ",",",";",":","\t","\n"];
  // value = value + ' ';
  // ValidCharacter = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","-","_"];
  
  // var splitString = value.split('').reduce((acc, x) => acc + (SeparatorCharacter.includes(x) ? '|' : ValidCharacter.includes(x) ? x.toUpperCase() : ''  ), '|').split('|')
  // newString = splitString.reduce((acc,x) => buildState(x, acc), ppAmpSearchBox_320397_parcelIds)
  document.getElementById('ppAmpSearchBox_320397_facadeInput').value = oldValue + value + ' ';
  document.getElementById('ppAmpSearchBox_320397_hiddenInput').value = initValue + value + '~';
  document.getElementById('buttonId').disabled = false;
}

function refreshKey(e) {
  // localStorage.clear();
  var payloadJson = localStorage.getItem('payload');
  var payload = JSON.parse(payloadJson);
  var newData = payloadJson ? payload.parcelIdHistory: [];
  var newArray = newData.length ? newData.split('~'): [];
  var historyTag = document.querySelector('#lg_history');
  historyTag.innerHTML = "";
  if(newArray.length == 0) {
    historyTag.innerHTML = `<a onclick="#" class="list-group-item PR active>No history</a>`;
  } else {
    newArray.forEach(item => {
      historyTag.innerHTML += '<a onclick="addSearchbox(\''+item+'\')" class="list-group-item PR active">'+item+'</a>';
    });
  }
}
refreshKey();