// Client-side unique ID generator - Move this logic to server for better consistency and security
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

document.getElementById("submitBtn").addEventListener("click", () => {
  let postid = uuidv4();
  let inputElem = document.getElementById("imgfile");
  let file = inputElem.files[0];

  if (!file) {
    alert("Please select an image file before submitting!");
    return;
  }

  // Create new file to rename the file
  let blob = file.slice(0, file.size, "image/jpeg");
  let newFile = new File([blob], `${postid}_post.jpeg`, { type: "image/jpeg" });

  // Build the form data
  let formData = new FormData();
  formData.append("imgfile", newFile);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.text())
    .then(() => {
      alert("Image uploaded successfully!");
      loadPosts();
    })
    .catch((error) => console.error("Error:", error));
});

// Load posts and display images on the page
function loadPosts() {
  fetch("/upload")
    .then((res) => res.json())
    .then((data) => {
      const imagesContainer = document.getElementById("images");
      imagesContainer.innerHTML = ""; // Clear previous images
      data[0].forEach((item) => {
        const newImg = document.createElement("img");
        newImg.setAttribute(
          "src",
          `https://storage.googleapis.com/gdgoc-trial-storage/${item.id}`
        );
        newImg.setAttribute("alt", "Uploaded Image");
        newImg.setAttribute("width", 100);
        newImg.setAttribute("height", 100);
        imagesContainer.appendChild(newImg);
      });
    })
    .catch((error) => console.error("Error fetching images:", error));
}
