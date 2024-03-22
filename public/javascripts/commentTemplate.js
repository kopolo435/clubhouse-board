import { upvoteComment, downvoteComment } from "./commentLike.js";

function createCommentContent(comment) {
  const p = document.createElement("p");
  p.classList.add("commentContent");
  p.textContent = comment.content;
  return p;
}

function createPointsContainer(comment) {
  const upvoteButton = document.createElement("button");
  const upvoteArrow = document.createElement("span");
  const downvoteArrow = document.createElement("span");
  const downvoteButton = document.createElement("button");
  const pointsContainer = document.createElement("div");
  const pointsValue = document.createElement("p");

  upvoteArrow.classList.add("material-symbols-outlined");
  upvoteArrow.textContent = "arrow_upward";
  downvoteArrow.classList.add("material-symbols-outlined");
  downvoteArrow.textContent = "arrow_downward";
  upvoteButton.classList.add("upvoteComment");
  downvoteButton.classList.add("downvoteComment");

  pointsContainer.classList.add("pointsContainerComment");
  pointsValue.classList.add("pointCounter");
  upvoteButton.dataset.comment_id = comment._id;
  downvoteButton.dataset.comment_id = comment._id;

  pointsValue.textContent = "0";

  upvoteButton.appendChild(upvoteArrow);
  downvoteButton.appendChild(downvoteArrow);

  upvoteButton.addEventListener("click", upvoteComment);
  downvoteButton.addEventListener("click", downvoteComment);

  pointsContainer.appendChild(upvoteButton);
  pointsContainer.appendChild(pointsValue);
  pointsContainer.appendChild(downvoteButton);

  return pointsContainer;
}

function createPosterInfo(user) {
  const container = document.createElement("div");
  const imgContainer = document.createElement("div");
  const img = document.createElement("img");
  const usernameLink = document.createElement("a");
  usernameLink.textContent = user.username;
  usernameLink.setAttribute("href", user.url);
  img.setAttribute("src", user.img_url);

  container.classList.add("userInfo");
  imgContainer.classList.add("profileImg");

  container.appendChild(img);
  container.appendChild(usernameLink);
  return container;
}

function createCommentDate(comment) {
  const p = document.createElement("p");
  p.classList("commentDate");
  p.textContent = comment.formatted_date;
  return p;
}

function createCommentContainer(comment, user) {
  const li = document.createElement("li");
  const commentContainer = document.createElement("div");
  li.classList.add("commentItem");
  commentContainer.classList.add("commentContainer");

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
