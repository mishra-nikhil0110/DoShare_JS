const dropZone = document.querySelector(".drop-zone");
const browseButton = document.querySelector(".browse-button");
const fileInput = document.querySelector("#inputFile");

const bgProgress = document.querySelector(".bg-progress");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.querySelector(".progress-bar");
const percentDiv = document.querySelector("#percent");

const fileURLInput = document.querySelector("#fileURL");

const sharingContainer = document.querySelector(".sharing-container");

const copyButton = document.querySelector("#copy-button");

const emailForm = document.querySelector("#email-form");

const toast = document.querySelector(".toast");

const maxAllowedSize = 100 * 1024 * 1024;


const host = "https://innshare.herokuapp.com/";
const uploadUrl = `${host}api/files`;
const emailURL = `${host}api/files/send`;




dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }

});
dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragged");
    const files = e.dataTransfer.files
    console.table(files);
    if (files.length) {
        fileInput.files = files;
        uploadFile()
    }

});
fileInput.addEventListener('change', () => {
    uploadFile();
});
browseButton.addEventListener("click", () => {
    fileInput.click();
});

copyButton.addEventListener("click", () => {
    fileURLInput.select();
    document.execCommand("copy");
    showToast("Link Copied to Clipboard!")
});


const uploadFile = () => {



    if (fileInput.files.length > 1) {
        fileInput.value = "";
        showToast("Only upload 1 file at a time!!");
        return;
    }
    const file = fileInput.files[0];
    if (file.size > maxAllowedSize) {
        showToast("Can't upload more than 100 GB!!");
        fileInput.value = "";
        return;

    }

    progressContainer.style.display = "block";

    const formData = new FormData();
    formData.append("myfile", file);
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {

        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            showLink(JSON.parse(xhr.response));
        }


        console.log(xhr.readyState)
    };
    xhr.upload.onprogress = updateProgress;

    xhr.upload.onerror = () => {
        fileInput.value = " ";
        showToast(`Error in Upload: ${xhr.statusText}`)
    }
    xhr.open("POST", uploadUrl);
    xhr.send(formData)
};
const updateProgress = (e) => {
    const percent = Math.round((e.loaded / e.total) * 100);
    // console.log(percent);
    bgProgress.style.width = `${percent}%`
    percentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`
};

const showLink = ({ file: url }) => {
    console.log(url);
    // fileInput.value = "";
    progressContainer.style.display = "none";
    // emailForm[2].removeAttribute("disabled");
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
};


// const resetFileInput = () => {

// }
// emailForm.addEventListener("submit", (e) => {
//     e.preventDefault();


//     emailForm[2].setAttribute("disabled", "true");
//     const url = fileURLInput.value;
//     const formData = {
//         uuid: url.split("/").splice(-1, 1)[0],
//         emailTo: emailForm.elements["to-email"].value,
//         emaiFrom: emailForm.elements["from-email"].value
//     };



// console.table(formData);


// fetch(emailURL, {

//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json",
//     },

//     body: JSON.stringify(formData),
// })
//     .then((response) => response.json())
//     .then((data) => {
//         if(success){
//             sharingContainer.style.display = "none";
//         }
//     });
// });
let toastTimer;
const showToast = (msg) => {
    toast.innerText = msg;
    toast.style.transform = "translate(-50%, 0)";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.transform = "translate(-50%, 60px)";
    }, 2000);
};