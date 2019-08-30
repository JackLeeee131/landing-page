const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const saveSubscription = async subscription => {
  console.log(subscription);

  const SERVER_URL = 'http://localhost:8082/save-subscription';
  const response = await fetch(SERVER_URL, {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  });
  return response;
};

self.addEventListener('push', function(event) {
  if (event.data) {
    console.log('Push event!! ', event.data.text());
  } else {
    console.log('Push event but no data');
  }
});

self.addEventListener('activate', async () => {
  try {
    const applicationServerKey = urlB64ToUint8Array(
      'BH8382F_R7muq3DN8Iy61jEFEv4Y97iAbkptJw6oInujsD_ROVh25h2j9oJh-bL7eE_O_FDRmD33H4fZP5ugKfo'
    );
    const options = { applicationServerKey, userVisibleOnly: true };
    const subscription = await self.registration.pushManager.subscribe(options);

    const response = await saveSubscription(subscription);
    console.log(response);
  } catch (err) {
    console.log('Error', err);
  }
});
