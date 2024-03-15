const deletePostBtns = document.getElementsByClassName("deletePost");

function showAlert(message) {
  console.log(message);
}

async function deletePost(event) {
  const button = event.target;
  const postid = button.dataset.id;

  const request = new Request(`/blog/posts/${postid}/delete`, {
    method: "POST",
  });

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Redirect after successful deletion
      const responseData = await response.json();
      showAlert(responseData.message);
      setTimeout(() => {
        window.location.href = "/account/admin/dashboard";
      }, 1500);
    } else {
      const responseData = await response.json();
      showAlert(responseData.message);
    }
  } catch (error) {
    showAlert(`Error: ${error}`);
  }
}

Array.from(deletePostBtns).forEach((button) => {
  button.addEventListener("click", deletePost);
});
