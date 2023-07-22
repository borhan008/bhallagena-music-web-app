const audioCategoryLists = document.getElementById("audio-categories");
const allAudioContainer = document.getElementById("all-audio");

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("previous-btn");
const audioVolume = document.getElementById("audio-volume");
const aduioProgress = document.getElementById("audio-progress");
const audioList = document.getElementById("audio-lists");
const audioImage = document.getElementById("audio-image");
const audioMuter = document.getElementById("audio-muter");
const audioLoop = document.getElementById("audio-loop");
const audioLoopSpan = document.getElementById("audio-loop-span");
const audioTiming = document.getElementById("audio-timing");
const audioCurrentTime = document.getElementById("audio-currenttime");
const audioDownloadLink = document.getElementById("download-link");

//Volume at first
const audioVolumeFirst = localStorage.getItem("volume")
  ? parseFloat(localStorage.getItem("volume"))
  : 0.1;
audio.volume = audioVolumeFirst;
document.querySelector(
  `#${audioVolume.getAttribute("id")} div`
).style.width = `${audioVolumeFirst * 100}%`;

const audioTimeConverter = (totalTimeInSeconds) => {
  const sec = parseInt(totalTimeInSeconds, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - hours * 3600) / 60);
  let seconds = sec - hours * 3600 - minutes * 60;
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (audio.duration > 3600) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
};

const changeVolume = (event) => {
  const volume = event.offsetX / audioVolume.clientWidth;
  audio.volume = volume;
  localStorage.setItem("volume", audio.volume);
  document.querySelector(
    `#${audioVolume.getAttribute("id")} div`
  ).style.width = `${event.offsetX}px`;
};

//console.log(audio.currentTime);
fetch(`0.json`)
  .then((res) => res.json())
  .then((data) => addSongs(data));

const addSongs = (data) => {
  if (data.length <= 0) {
  } else {
    const totalAudio = data.length;
    let currentAudio = 0;

    const showingAllAudio = () => {
      data.map((singleAudio) => {
        const createNewAudioDiv = document.createElement("div");
        createNewAudioDiv.classList.add("bg-black");
        createNewAudioDiv.innerHTML = `            
                    <div class="border-b border-gray-900 w-full flex p-2 hover:text-gray-300 cursor-pointer items-center single-audio text-gray-500"
                data-id=${singleAudio.id - 1}>
                <img src="${
                  singleAudio.imgUrl ? singleAudio.imgUrl : `def.png`
                }" alt="" class="rounded">
                <h2 class="text-xl ml-5">${singleAudio.id}. ${
          singleAudio.title
        }</h2>
            </div>`;

        document.getElementById("audio-lists").appendChild(createNewAudioDiv);
      });
    };
    showingAllAudio();
    const audioDetailsUpadate = (audioData, autoPlay) => {
      audio.currentTime = 0;
      audioTiming.innerHTML = "00:00";
      audioCurrentTime.innerHTML = "00:00";
      audio.src = data[audioData].url;
      currentAudio = parseInt(audioData);
      audioDownloadLink.classList.add("pointer-events-none", "bg-black");
      document.getElementById("audio-name").innerText = `Loading....`;
      const removeClass = document.querySelectorAll(`.single-audio`);
      removeClass.forEach((clName) => {
        clName.classList.remove("bg-black", "text-gray-200");
      });
      document
        .querySelector(`[data-id="${data[audioData].id - 1}"]`)
        .classList.add("bg-black", "text-gray-200");
      audioImage.src =
        "https://d-great.org/wp-content/themes/apparatus/images/newsletter_loader.gif";
      audio.addEventListener("loadedmetadata", () => {
        document.title = data[audioData].title;
        audioTiming.innerHTML = audioTimeConverter(
          audio.duration ? audio.duration : 0
        );
        if (autoPlay === true) {
          audio.play();
          playBtn.classList.add("bg-black", "text-white");
          playBtn.innerHTML = `<i class="fa fa-solid fa-pause"></i>`;
        }
        document.getElementById("audio-name").innerHTML = `${
          data[audioData].id
        }.<span class="inline-block md:hidden">${data[audioData].title.slice(
          0,
          10
        )}.</span><span class="hidden md:inline-block">${data[
          audioData
        ].title.slice(0, 50)}</span>`;

        audioImage.src =
          data[audioData].imgUrl.length > 0
            ? data[audioData].imgUrl
            : `def.png`;

        document
          .getElementById("download-link")
          .setAttribute("href", `${data[audioData].url}`);
        audioDownloadLink.classList.remove("pointer-events-none", "bg-black");
      });
    };

    const playMusic = () => {
      if (!audio.paused) {
        audio.pause();
        playBtn.classList.remove("bg-black", "text-white");
        playBtn.innerHTML = `<i class="fa fa-solid fa-play"></i>`;
      } else {
        const playAudio = audio.play();
        if (playAudio !== undefined) {
          playAudio
            .then((_) => {
              playBtn.classList.add("bg-black", "text-white");
              playBtn.innerHTML = `<i class="fa fa-solid fa-pause"></i>`;
            })
            .catch((error) => {
              audio.pause();
              playBtn.classList.remove("bg-black", "text-white");
              playBtn.innerHTML = `<i class="fa fa-solid fa-play"></i>`;
              document.getElementById("audio-name").innerHTML =
                "<strong>Loading.</strong>";
            });
        }
      }
    };

    const changeTime = (e) => {
      const audioTimePercentage =
        (e.srcElement.currentTime / e.srcElement.duration) * 100;
      aduioProgress.style.width = `${audioTimePercentage}%`;
      audioCurrentTime.innerHTML = audioTimeConverter(
        audio.currentTime ? audio.currentTime : 0
      );
    };

    const updateAudioProgress = (e) => {
      if (audio.duration > 0) {
        const audioUpdateTime =
          (e.offsetX / aduioProgress.parentNode.clientWidth) * audio.duration;
        audio.currentTime = audioUpdateTime;
      }
    };

    const nextPrevAudio = (operation) => {
      if (operation < 0) {
        currentAudio = totalAudio - 1;
        audioDetailsUpadate(currentAudio, true);
      } else if (operation >= totalAudio) {
        currentAudio = 0;
        audioDetailsUpadate(0, true);
      } else {
        currentAudio = operation;
        audioDetailsUpadate(operation, true);
      }
    };

    const audioMuteUnmute = () => {
      if (audio.muted) {
        audio.muted = false;
        audioMuter.innerHTML = `<i class="fas fa-volume-down text-xl"></i>`;
      } else {
        audio.muted = true;
        audioMuter.innerHTML = `<i class="fas fa-volume-mute "></i>`;
      }
    };

    const audioLoopUnloop = () => {
      if (audio.loop) {
        audio.loop = false;
        audioLoopSpan.innerText = `x`;
      } else {
        audio.loop = true;
        audioLoopSpan.innerText = `1`;
      }
    };

    playBtn.addEventListener("click", function () {
      playMusic();
    });
    document.addEventListener("keydown", (e) => {
      if (e.charCode === 32 || e.code === "Space") {
        e.preventDefault();
        playMusic();
      } else if (e.keyCode === 38 || e.code === "ArrowUp") {
        audio.volume >= 0.9 ? (audio.volume = 1) : (audio.volume += 0.1);
        document.querySelector(
          `#${audioVolume.getAttribute("id")} div`
        ).style.width = `${audio.volume * 100}%`;
        localStorage.setItem("volume", audio.volume);
      } else if (e.keyCode === 40 || e.code === "ArrowDown") {
        audio.volume <= 0.1 ? (audio.volume = 0) : (audio.volume -= 0.1);
        document.querySelector(
          `#${audioVolume.getAttribute("id")} div`
        ).style.width = `${audio.volume * 100}%`;
        localStorage.setItem("volume", audio.volume);
      } else if (e.keyCode === "39" || e.code === "ArrowRight") {
        if (audio.duration > 0) {
          audio.currentTime >= audio.duration ? "" : (audio.currentTime += 10);
        }
      } else if (e.keyCode === "37" || e.code === "ArrowLeft") {
        if (audio.duration > 0) {
          audio.currentTime <= 9
            ? (audio.currentTime = 0)
            : (audio.currentTime -= 10);
        }
      }
    });

    const showProgressHoverTime = (e) => {
      if (audio.duration > 0) {
        const audioUpdateTime =
          (e.offsetX / aduioProgress.parentNode.clientWidth) * audio.duration;
        aduioProgress.parentNode.setAttribute(
          "title",
          audioTimeConverter(audioUpdateTime)
        );
      }
    };

    audio.addEventListener("timeupdate", changeTime);
    aduioProgress.parentNode.addEventListener(
      "mousemove",
      showProgressHoverTime
    );
    aduioProgress.parentNode.addEventListener("click", updateAudioProgress);

    nextBtn.addEventListener("click", function () {
      nextPrevAudio(currentAudio + 1);
    });
    prevBtn.addEventListener("click", function () {
      nextPrevAudio(currentAudio - 1);
    });

    audioMuter.addEventListener("click", () => audioMuteUnmute());
    audioLoop.addEventListener("click", () => audioLoopUnloop());
    audioList.addEventListener("click", function (e) {
      if (e.target.classList.contains("single-audio")) {
        audioDetailsUpadate(e.target.getAttribute("data-id"), true);
      } else if (e.target.parentNode.classList.contains("single-audio")) {
        audioDetailsUpadate(e.target.parentNode.getAttribute("data-id"), true);
      }
    });
    audio.onended = function () {
      nextPrevAudio(currentAudio + 1);
    };
    audioDetailsUpadate(currentAudio, false);
  }
};
