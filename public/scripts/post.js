function addCommentElem(comment, user, url) {
  console.log(user);

  const commentDiv = document.createElement("div");
  const profilePictureComment = document.createElement("img");
  const nicknameComment = document.createElement("p");
  const commentText = document.createElement("p");
  const timestampComment = document.createElement("p");

  commentDiv.className = "comment";
  profilePictureComment.className = "profilePictureComment";
  nicknameComment.className = "nicknameComment";
  commentText.className = "commentText";
  timestampComment.className = "timestampComment";

  profilePictureComment.src = url;
  nicknameComment.innerHTML = user.nickname;
  commentText.innerHTML = comment.data.text;
  timestampComment.innerHTML = comment.data.timestamp._seconds;

  commentDiv.appendChild(profilePictureComment);
  commentDiv.appendChild(nicknameComment);
  commentDiv.appendChild(commentText);
  commentDiv.appendChild(timestampComment);
  document.getElementById("commentsDiv").appendChild(commentDiv);

  nicknameComment.addEventListener("click", function(event) {
    activateUserScreen(user.id);
    event.preventDefault();
  });

  profilePictureComment.addEventListener("click", function(event) {
    activateUserScreen(user.id);
    event.preventDefault();
  });
}

function handlePostScreen(postId) {
  const profilePicturePost = document.getElementById("profilePicturePost");
  const nicknameUserPost = document.getElementById("nicknameUserPost");
  const timestampPost = document.getElementById("timestampPost");
  const text = document.getElementById("text");
  const imagePost = document.getElementById("imagePost");
  const likesNumber = document.getElementById("likesNumber");

  const getPostData = httpsCallable(functions, 'getPostData');
  getPostData({ postId: postId }).then((result) => {
    getDownloadURL(ref(storage, result.data.users[0].profilePictureId + '.png'))
      .then((url) => {
        profilePicturePost.src = url;
    });

    nicknameUserPost.innerHTML = result.data.users[0].nickname;

    timestampPost.innerHTML = result.data.post.timestamp._seconds;

    text.innerHTML = result.data.post.text;

    getDownloadURL(ref(storage, result.data.post.imageID + '.png'))
      .then((url) => {
        imagePost.src = url;
      });
    
    likesNumber.innerHTML = result.data.post.likes.length;

    if (result.data.post.likes.includes(getCurrentUserUID())) {
      document.getElementById("unlikedIcon").style.display = "none";
      document.getElementById("likedIcon").style.display = "inline";
    }

    const comments = Array.from(result.data.comments);
    const users = Array.from(result.data.users);
    comments.forEach((comment) => {
      const userId = comment.data.userID;
      let userFound = false;
      let userComment;

      users.forEach((user) => {
        if (user.id == userId && !userFound) {
          userComment = user;
          userFound = true;
        }
      });

      getDownloadURL(ref(storage, userComment.profilePictureId + '.png'))
        .then((url) => {
          addCommentElem(comment, userComment, url);
        });
    });

    setLoadingScreen(false);
  });
}

function closePostScreen() {
  const allComments = Array.from(document.getElementsByClassName("comment"));
  allComments.forEach(comment => comment.remove());
}