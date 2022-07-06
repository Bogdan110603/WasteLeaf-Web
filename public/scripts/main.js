const navBar = document.getElementById("navBar");

const loginScreen = document.getElementById("loginScreen");
const loadingScreen = document.getElementById("loadingScreen");

const feedScreen = document.getElementById("feedScreen");
const userScreen = document.getElementById("userScreen");
const postScreen = document.getElementById("postScreen");

const feedBtn = document.getElementById("feedBtn");
const profileBtn = document.getElementById("profileBtn");
const logoutBtn = document.getElementById("logoutBtn");

const screenStack = [];
const screenStackParams = [];

function activateFeedScreen() {
  navBar.style.display = "inline";
  loginScreen.style.display = "none";

  feedScreen.style.display = "inline";
  userScreen.style.display = "none";
  postScreen.style.display = "none";

  closeUserScreen();
  closePostScreen();

  handleFeedScreen();

  screenStack.push("FeedScreen");
  screenStackParams.push(null);
  setLoadingScreen(true);
}

function activateUserScreen(userId) {
  navBar.style.display = "inline";
  loginScreen.style.display = "none";

  feedScreen.style.display = "none";
  userScreen.style.display = "inline";
  postScreen.style.display = "none";

  closePostScreen();

  handleUserScreen(userId);

  screenStack.push("UserScreen");
  screenStackParams.push(userId);
  setLoadingScreen(true);
}

function activatePostScreen(postId) {
  navBar.style.display = "inline";
  loginScreen.style.display = "none";

  feedScreen.style.display = "none";
  userScreen.style.display = "none";
  postScreen.style.display = "inline";

  closeUserScreen();

  handlePostScreen(postId);

  screenStack.push("PostScreen");
  screenStackParams.push(postId);
  setLoadingScreen(true);
}

function backBtnOnClick() {
  if (screenStack.length == 1) return;

  screenStack.pop();
  screenStackParams.pop();

  window["activate" + screenStack[screenStack.length - 1]](screenStackParams[screenStackParams.length - 1]);

  screenStack.pop();
  screenStackParams.pop();
}

function feedBtnOnClick() {
  activateFeedScreen();
}

function profileBtnOnClick() {
  activateUserScreen(getCurrentUserUID());
}

function logoutBtnOnClick() {
  location.reload();
}

function setLoadingScreen(state) {
  loadingScreen.style.display = ((state) ? 'inline' : 'none');
}
