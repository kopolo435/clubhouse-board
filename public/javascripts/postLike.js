import updatePointCounter from "./updatePointCounter.js";

async function upvotePost(event) {
  const button = event.target;
  const { postid } = button.dataset;

  const bodyData = { postid };
  const requestBody = JSON.stringify(bodyData);

  const request = new Request(`/blog/post/${postid}/upvote`, {
    method: "POST",
    body: requestBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(request);
  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData.message, responseData.points);
    updatePointCounter(button, responseData.points);
  } else {
    console.log(responseData.message);
  }
}

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
    console.log(responseData.message, responseData.points);
    updatePointCounter(button, responseData.points);
  } else {
    console.log(responseData.message);
  }
}

const downvoteBtns = document.getElementsByClassName("downvotePost");
const upvoteBtns = document.getElementsByClassName("upvotePost");

Array.from(upvoteBtns).forEach((button) => {
  button.addEventListener("click", upvotePost);
});

Array.from(downvoteBtns).forEach((button) => {
  button.addEventListener("click", downvotePost);
});
