function changeItemDisplayed() {
  const postContainer = document.querySelector(".postsContainer");
  const commentContainer = document.querySelector(".commentsContainer");
  postContainer.classList.toggle("hide");
  commentContainer.classList.toggle("hide");
}

const itemDisplaySelect = document.getElementById("itemDisplay");
itemDisplaySelect.addEventListener("change", changeItemDisplayed);
