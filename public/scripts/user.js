function handleUserScreen(userId) {
  const nickname = document.getElementById("nickname");
  const profilePicture = document.getElementById("profilePicture");
  const stats = document.getElementById("stats");

  const getUserData = httpsCallable(functions, 'getUserData');
  getUserData({ userId: userId }).then((result) => {
    nickname.innerHTML = result.data.user.nickname;
    getDownloadURL(ref(storage, result.data.user.profilePictureID + '.png'))
      .then((url) => {
        profilePicture.src = url;
    });
    stats.innerHTML = `${result.data.user.friendsNumber} friends ${result.data.user.postsNumber} posts ${result.data.user.reportsMadeNumber} reported ${result.data.user.reportsClearedNumber} collected`;
    const posts = Array.from(result.data.posts);

    const promises = [];

    posts.forEach((post) => {
      const promise = getDownloadURL(ref(storage, post.imageID + '.png'));
      promises.push(promise);
      promise.then((url) => {
        post.url = url;
      })
    });

    Promise.all(promises).then((urls) => {
      posts.sort((a, b) => parseFloat(b.timestamp._seconds) - parseFloat(a.timestamp._seconds));
      
      posts.forEach((post) => {
        addPostElem(post.id, post.url);
      });

      setLoadingScreen(false);
    });
  });
}

function addPostElem(postId, url) {
  const profileDiv = document.getElementById("profileDiv");
  const postElem = document.createElement("img");
  postElem.className = "post";
  postElem.id = postId;
  postElem.src = url;
  profileDiv.appendChild(postElem);

  postElem.addEventListener("click", function(event) {
    activatePostScreen(postElem.id);
    event.preventDefault();
  });
}

function closeUserScreen() {
  const allPosts = Array.from(document.getElementsByClassName("post"));
  allPosts.forEach(post => post.remove());
}