const downvoteBtns = document.getElementsByClassName("downvotePost");

async function downvotePost(event) {
  const button = event.target;
  const { postid } = button.dataset;
  const bodyData = { postid };
  const requestBody = JSON.stringify(bodyData);
  const request = new Request(`/blog/posts/${postid}/downvote`, {
    method: "POST",
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(request);
  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData.message);
  } else {
    console.log(responseData.message);
  }
}

Array.from(downvoteBtns).forEach((button) => {
  button.addEventListener("click", downvotePost);
});
