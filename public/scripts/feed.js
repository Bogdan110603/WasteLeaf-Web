function getUserWithId(people, id) {
  let userData;

  people.forEach((user) => {
    if (user.id == id) {
      userData = user.data;
    }
  });

  return userData;
}

function addPostElement(post, userData, url1, url2) {
  const postDivFeed = document.createElement("div");
  const profilePicturePostFeed = document.createElement("img");
  const nicknameUserPostFeed = document.createElement("p");
  const timestampPostFeed = document.createElement("p");
  const textpostFeed = document.createElement("p");
  const imagePostDivFeed = document.createElement("div");
  const imagePostFeed = document.createElement("img");
  const likesNumberFeed = document.createElement("p");
  const unlikedIconFeed = document.createElement("img");
  const likedIconFeed = document.createElement("img");

  postDivFeed.className = "postDivFeed";
  profilePicturePostFeed.id = "profilePicturePostFeed";
  nicknameUserPostFeed.id = "nicknameUserPostFeed";
  timestampPostFeed.id = "timestampPostFeed";
  textpostFeed.id = "textpostFeed";
  imagePostDivFeed.id = "imagePostDivFeed";
  imagePostFeed.id = "imagePostFeed";
  likesNumberFeed.id = "likesNumberFeed";
  unlikedIconFeed.id = "unlikedIconFeed";
  likedIconFeed.id = "likedIconFeed";

  profilePicturePostFeed.src = url1;

  nicknameUserPostFeed.innerHTML = userData.nickname;

  timestampPostFeed.innerHTML = post.data.timestamp._seconds;

  textpostFeed.innerHTML = post.data.text;

  imagePostFeed.src = url2;
  
  likesNumberFeed.innerHTML = post.data.likes.length;

  unlikedIconFeed.src = "resources/thumb_up_off_alt_black_24dp.png";
  likedIconFeed.src = "resources/thumb_up_alt_black_24dp.png";

  unlikedIconFeed.style.display = "inline";
  likedIconFeed.style.display = "none";

  if (post.data.likes.includes(getCurrentUserUID())) {
    unlikedIconFeed.style.display = "none";
    likedIconFeed.style.display = "inline";
  }

  imagePostDivFeed.appendChild(imagePostFeed);

  postDivFeed.appendChild(profilePicturePostFeed);
  postDivFeed.appendChild(nicknameUserPostFeed);
  postDivFeed.appendChild(timestampPostFeed);
  postDivFeed.appendChild(textpostFeed);
  postDivFeed.appendChild(imagePostDivFeed);
  postDivFeed.appendChild(likesNumberFeed);
  postDivFeed.appendChild(unlikedIconFeed);
  postDivFeed.appendChild(likedIconFeed);

  document.getElementById("feedScreen").appendChild(postDivFeed);
}

function handleFeedScreen() {
  const getFeed = httpsCallable(functions, 'getFeed');
  getFeed().then((result) => {
    const posts = result.data.posts;

    posts.sort((a,b) => b.data.timestamp._seconds - a.data.timestamp._seconds);

    posts.forEach((post) => {
      const userData = getUserWithId(result.data.people, post.data.userID)

      const promise1 = getDownloadURL(ref(storage, userData.profilePictureID + '.png'));
      const promise2 = getDownloadURL(ref(storage, post.data.imageID + '.png'));

      Promise.all([promise1, promise2]).then((urls) => {
        addPostElement(post, userData, urls[0], urls[1]);
        setLoadingScreen(false);
      });
    });
  });
}