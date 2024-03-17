const upvoteCommentBtns = document.getElementsByClassName("upvoteComment");
const downvoteCommentsBtns = document.getElementsByClassName("downvoteComment");

async function upvoteComment(event) {
  const button = event.target;
  const { comment_id } = button.dataset;
  const body = { comment_id };
  const requestBody = JSON.stringify(body);
  const request = new Request(`/blog/comments/${comment_id}/upvote`, {
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
  } else {
    console.log(responseData.message);
  }
}

async function downvoteComment(event) {
  const button = event.target;
  const { comment_id } = button.dataset;
  const body = { comment_id };
  const bodyData = JSON.stringify(body);
  const request = new Request(`/blog/comments/${comment_id}/downvote`, {
    method: "POST",
    body: bodyData,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await fetch(request);
  const responseData = await response.json();
  if (response.ok) {
    console.log(responseData.message, responseData.points);
  } else {
    console.log(responseData.message);
  }
}

Array.from(upvoteCommentBtns).forEach((button) => {
  button.addEventListener("click", upvoteComment);
});

Array.from(downvoteCommentsBtns).forEach((button) => {
  button.addEventListener("click", downvoteComment);
});

export { upvoteComment, downvoteComment };
