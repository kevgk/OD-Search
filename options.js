document.addEventListener('DOMContentLoaded', async () => {

  const presets = await loadPresets();

  const textArea = document.querySelector('textarea');
  textArea.innerText = JSON.stringify(presets);

  const saveButton = document.querySelector('#saveButton');
  const resetButton = document.querySelector('#resetButton');
  
  saveButton.addEventListener('click', save);
  resetButton.addEventListener('click', reset);

  async function save () {
    const json = JSON.parse(textArea.value);
    
    await browser.storage.sync.set({
      presets: json
    });
  }

  async function reset () {
    const data = await fetch('/presets.json');
    const stock = await data.json();
  
    await browser.storage.sync.set({
      presets: stock
    });

    textArea.innerText = JSON.stringify(stock);
  }

});

async function loadPresets () {
    const { presets } = await browser.storage.sync.get("presets");
    if (!presets) {
      const data = await fetch('/presets.json');
      presets = await data.json();
    }
    return presets;
  }