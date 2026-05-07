const versionSelect = document.getElementById('switch-version');
const v1Panel = document.getElementById('switch-v1-panel');
const v2Panel = document.getElementById('switch-v2-panel');
const serialInput = document.getElementById('switch-serial');
const checkButton = document.getElementById('check-serial');
const serialResult = document.getElementById('serial-result');

function updatePanels() {
  const isV2 = versionSelect.value === 'v2';
  v1Panel.hidden = isV2;
  v2Panel.hidden = !isV2;
}

function normalizeSerial(serial) {
  return serial.toUpperCase().replace(/\s+/g, '');
}

function getStatusMessage(serial, ranges) {
  const match = ranges.find((entry) => serial.startsWith(entry.prefix));

  if (!match) {
    return 'No known match in this local serial JSON list. Treat as unknown and verify with a current Switch serial checker guide.';
  }

  return `${match.prefix}: ${match.status}. ${match.guidance}`;
}

async function checkSerial() {
  const serial = normalizeSerial(serialInput.value);

  if (!serial) {
    serialResult.textContent = 'Enter your serial number first.';
    return;
  }

  try {
    const response = await fetch('assets/data/switch-serials.json');

    if (!response.ok) {
      serialResult.textContent = 'Could not read serial database JSON.';
      return;
    }

    const ranges = await response.json();
    serialResult.textContent = getStatusMessage(serial, ranges);
  } catch (error) {
    serialResult.textContent = 'Serial lookup failed. Serve this site over HTTP to allow JSON lookup.';
  }
}

versionSelect.addEventListener('change', updatePanels);
checkButton.addEventListener('click', checkSerial);
updatePanels();
