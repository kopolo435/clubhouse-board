const newCommentForm = document.getElementById("newCommentForm");

function displayError(message) {
  const p = document.getElementById("newCommentError");
  p.textContent = message;
  p.style.display = "block";
}

function hideError() {
  const p = document.getElementById("newCommentError");
  p.textContent = "";
  p.style.display = "hide";
}

newCommentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("newComment").value;
  const postId = document.getElementById("postId").value;
  const userId = document.getElementById("userId").value;
  // Construct the body object
  const bodyData = {
    comment: content,
    postId,
    userId,
  };

  // Convert the body object to JSON
  const requestBody = JSON.stringify(bodyData);

  // Create the request
  const request = new Request("/blog/comments/create", {
    method: "POST",
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(request);
  if (response.status === 200) {
    const responseData = await response.json();
    hideError();
    console.log(responseData.message); // Success message
  } else {
    const errorData = await response.json();
    displayError(errorData.error.msg); // Error information
  }
});
