async function loadDevices() {
    const apiEndpoint = apiBaseURL + '/adb/devices';
    const response = await fetch(apiEndpoint);
    const jsres = await response.json();
    console.log(jsres);
    
    if (jsres.isNotEmpty && jsres.isLoaded) {
        deviceLoaded();
        return;
    }

    for (const device of jsres.devices) {
        const serial = device.serial;
        const state = device.status;

        const table = document.getElementById('hmd_table');
        
        // insert serial and state into table, make serial a link to loadDevice(serial)
        const row = table.insertRow(-1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = serial;
        cell2.innerHTML = state;
        cell1.onclick = function() {
            loadDevice(serial);
        }
    }
}

loadDevices();

async function loadDevice(serial) {
    console.log('Loading device ' + serial);

    const apiEndpoint = apiBaseURL + '/adb/load?serial=' + serial;
    const response = await fetch(apiEndpoint);
    const jsres = await response.json();
    console.log(jsres);
    if (jsres.isLoaded) {
        deviceLoaded();
    }else {
        console.error('Failed to load device ' + serial);
        alert('Failed to load device ' + serial);
        location.reload();
    }
}

async function deviceLoaded() {
    // TODO: Hide device selection
}