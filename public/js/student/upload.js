const data = localStorage.getItem("user");
const user = JSON.parse(data);
if (!data) {
  window.location.href = "/";
}

let params = new URLSearchParams(document.location.search);
let title = params.get("title");

function uploadFile(files) {
  const file = files[0];

  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("Title", title);
    formData.append("ParticipantID", user.UserID);

    fetch("/files/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
        }
        // Handle success as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error as needed
      });
  } else {
    console.error("No file selected");
  }
}

let isAdvancedUpload = (function () {
  var div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
})();

let draggableFileArea = document.querySelector(".drag-file-area");
let browseFileText = document.querySelector(".browse-files");
let uploadIcon = document.querySelector(".upload-icon");
let dragDropText = document.querySelector(".dynamic-message");
let fileInput = document.querySelector(".default-file-input");
let cannotUploadMessage = document.querySelector(".cannot-upload-message");
let cancelAlertButton = document.querySelector(".cancel-alert-button");
let uploadedFile = document.querySelector(".file-block");
let fileName = document.querySelector(".file-name");
let fileSize = document.querySelector(".file-size");
let progressBar = document.querySelector(".progress-bar");
let removeFileButton = document.querySelector(".remove-file-icon");
let uploadButton = document.querySelector(".upload-button");
let fileFlag = 0;

fileInput.addEventListener("click", () => {
  fileInput.value = "";
});

fileInput.addEventListener("change", (e) => {
  console.log(" > " + fileInput.value);
  uploadIcon.innerHTML = "check_circle";
  dragDropText.innerHTML = "File Dropped Successfully!";
  document.querySelector(
    ".label"
  ).innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: 0;"> browse file</span></span>`;
  uploadButton.innerHTML = `Upload`;
  fileName.innerHTML = fileInput.files[0].name;
  fileSize.innerHTML = (fileInput.files[0].size / 1024).toFixed(1) + " KB";
  uploadedFile.style.cssText = "display: flex;";
  progressBar.style.width = 0;
  fileFlag = 0;
});

uploadButton.addEventListener("click", () => {
  if (fileInput.files) {
    uploadFile(fileInput.files);
  } else {
    cannotUploadMessage.style.cssText =
      "display: flex; animation: fadeIn linear 1.5s;";
  }
});

cancelAlertButton.addEventListener("click", () => {
  cannotUploadMessage.style.cssText = "display: none;";
});

if (isAdvancedUpload) {
  [
    "drag",
    "dragstart",
    "dragend",
    "dragover",
    "dragenter",
    "dragleave",
    "drop",
  ].forEach((evt) =>
    draggableFileArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
    })
  );

  ["dragover", "dragenter"].forEach((evt) => {
    draggableFileArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadIcon.innerHTML = "file_download";
      dragDropText.innerHTML = "Drop your file here!";
    });
  });

  draggableFileArea.addEventListener("drop", (e) => {
    uploadIcon.innerHTML = "check_circle";
    dragDropText.innerHTML = "File Dropped Successfully!";
    document.querySelector(
      ".label"
    ).innerHTML = `drag & drop or <span class="browse-files"> <input type="file" class="default-file-input" style=""/> <span class="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>`;
    uploadButton.innerHTML = `Upload`;

    let files = e.dataTransfer.files;
    fileInput.files = files;
  });
}

removeFileButton.addEventListener("click", () => {
  uploadedFile.style.cssText = "display: none;";
  fileInput.value = "";
  uploadIcon.innerHTML = "file_upload";
  dragDropText.innerHTML = "Drag & drop any file here";
  document.querySelector(
    ".label"
  ).innerHTML = `or <span class="browse-files"> <input type="file" class="default-file-input"/> <span class="browse-files-text">browse file</span> <span>from device</span> </span>`;
  uploadButton.innerHTML = `Upload`;
});
