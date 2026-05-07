function initSwitchPage() {
  const versionSelect = document.getElementById('switch-version');
  const v1Panel = document.getElementById('switch-v1-panel');
  const v2Panel = document.getElementById('switch-v2-panel');
  const serialInput = document.getElementById('switch-serial');
  const checkButton = document.getElementById('check-serial');
  const serialResult = document.getElementById('serial-result');

  const requiredElements = {
    versionSelect,
    v1Panel,
    v2Panel,
    serialInput,
    checkButton,
    serialResult
  };
  const missing = Object.entries(requiredElements)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    console.warn('Switch page initialization skipped. Missing elements:', missing.join(', '));
    return;
  }

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
      return 'Serial prefix not recognized. Verify your serial and check current community serial resources.';
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
      console.error(error);
      serialResult.textContent = 'Unable to check serial number right now. Please try again later.';
    }
  }

  versionSelect.addEventListener('change', updatePanels);
  checkButton.addEventListener('click', checkSerial);
  updatePanels();
}

initSwitchPage();
