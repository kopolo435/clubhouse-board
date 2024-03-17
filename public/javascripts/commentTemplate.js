import { upvoteComment, downvoteComment } from "./commentLike.js";

function createCommentContent(comment) {
  const p = document.createElement("p");
  p.textContent = comment.content;
  return p;
}

function createPointsContainer(comment) {
  const upvoteButton = document.createElement("button");
  const downvoteButton = document.createElement("button");
  const pointsContainer = document.createElement("div");
  const pointsValue = document.createElement("p");

  pointsContainer.classList.add("pointsContainer");
  pointsValue.classList.add("pointCounter");
  upvoteButton.dataset.comment_id = comment._id;
  downvoteButton.dataset.comment_id = comment._id;

  pointsValue.textContent = "0";

  upvoteButton.textContent = "like";
  downvoteButton.textContent = "liken't";

  upvoteButton.addEventListener("click", upvoteComment);
  downvoteButton.addEventListener("click", downvoteComment);

  pointsContainer.appendChild(upvoteButton);
  pointsContainer.appendChild(pointsValue);
  pointsContainer.appendChild(downvoteButton);

  return pointsContainer;
}

function createPosterInfo(user) {
  const container = document.createElement("div");
  const img = document.createElement("img");
  const usernameLink = document.createElement("a");
  usernameLink.textContent = user.username;
  usernameLink.setAttribute("href", user.url);
  img.setAttribute("src", user.img_url);

  container.appendChild(img);
  container.appendChild(usernameLink);
  return container;
}

function createCommentDate(comment) {
  const p = document.createElement("p");
  p.textContent = comment.formatted_date;
  return p;
}

function createCommentContainer(comment, user) {
  const li = document.createElement("li");
  const commentContainer = document.createElement("div");

  li.appendChild(createPointsContainer(comment));
  if (user.is_member) {
    commentContainer.appendChild(createPosterInfo(user));
    commentContainer.appendChild(createCommentContent(comment));
    commentContainer.appendChild(createCommentDate(comment));
    li.appendChild(commentContainer);
  } else {
    commentContainer.appendChild(createCommentContent(comment));
    li.appendChild(commentContainer);
  }
  return li;
}

function addComment(comment, locals) {
  const commentContainer = document.querySelector(".comments");
  commentContainer.insertBefore(
    createCommentContainer(comment, locals),
    commentContainer.firstChild
  );
}

export default addComment;
