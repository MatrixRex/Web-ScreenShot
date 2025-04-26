const urlInput = document.getElementById("url");
const customWidthInput = document.getElementById("customWidth");
const radioInputs = document.querySelectorAll('input[name="width"]');
const btn = document.getElementById("captureBtn");
const loader = document.getElementById("loader");
const status = document.getElementById("status");
const screenshotPreview = document.getElementById("screenshotPreview");
const screenshotContainer = document.getElementById("screenshotContainer");

radioInputs.forEach((radio) => {
  radio.addEventListener("change", () => {
    customWidthInput.style.display =
      radio.value === "custom" ? "block" : "none";
  });
});

btn.onclick = async () => {
  const url = urlInput.value;
  const selectedWidth = document.querySelector('input[name="width"]:checked');
  const width =
    selectedWidth.value === "custom"
      ? parseInt(customWidthInput.value)
      : parseInt(selectedWidth.value);

  if (!url.startsWith("http")) {
    status.innerText =
      "❌ Please enter a valid URL starting with http or https.";
    return;
  }

  loader.style.display = "block";
  status.innerText = "";

  try {
    const filePath = await window.electronAPI.capture({ url, width });

    if (filePath.startsWith("Error:")) {
      status.innerText = filePath;
      return;
    }

    screenshotPreview.src = `file://${filePath}`;
    screenshotPreview.style.display = "block";
    status.innerText = `✅ Screenshot captured.`;

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.style.display = "flex";
    saveBtn.onclick = async () => {
      const savedPath = await window.electronAPI.saveImageAs({
        srcPath: filePath,
      });
      if (savedPath) status.innerText = `✅ Saved to: ${savedPath}`;
    };
  } catch (err) {
    status.innerText = "❌ Error: " + err.message;
  } finally {
    loader.style.display = "none";
  }
};
