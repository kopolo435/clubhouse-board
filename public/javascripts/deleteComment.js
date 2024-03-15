const deleteCommentBtns = document.getElementsByClassName("deleteComment");

function showAlert(message) {
  console.log(message);
}

async function deleteComment(event) {
  const button = event.target;
  const commentId = button.dataset.id;
  const request = new Request(`/blog/comments/${commentId}/delete`, {
    method: "POST",
  });

  try {
    const response = await fetch(request);
    const responseData = await response.json();
    if (response.ok) {
      showAlert(responseData.message);
      setTimeout(() => {
        window.location.href = "/account/admin/dashboard";
      }, 1500);
    } else {
      showAlert(responseData.message);
    }
  } catch (error) {
    showAlert(`Error: ${error}`);
  }
}

Array.from(deleteCommentBtns).forEach((button) => {
  button.addEventListener("click", deleteComment);
});
