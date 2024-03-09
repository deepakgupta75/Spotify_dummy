
let currentMusic = new Audio();
let musics;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getmusics(folder) {
    currFolder = folder;

    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let musics = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            musics.push(element.href.split(`/${currFolder}/`)[1])
        }

    }


    // list all the music in the platlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const music of musics) {
        songUL.innerHTML = songUL.innerHTML + `<li> 

                            <img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div> ${music.replaceAll("%20", " ")}</div>
                                <div></div>

                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="images/play.svg" alt="">
                            </div>
                        </li></li>`;
    }

    // Attch an event listener to the  each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    return musics
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/musics/" + track)
    currentMusic.src = `/${currFolder}/` + track
    if (!pause) {
        currentMusic.play()
        play.src = "images/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    

}

async function displayAlbum (){
    let a = await fetch(`http://127.0.0.1:5501/musics/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    Array.from(anchors).forEach( async e=>{
        if(e.href.includes("/musics")){
          let folder=  e.href.split("/").slice(-2)[0]
          //get the data of the folder
        //   let a = await fetch(`http://127.0.0.1:5501/musics/${folder}/info.json`)
        //   let response = await a.json();
        //    console.log(response)
        }
    })
}





async function main() {



    // get the list of all musics in the console
    musics = await getmusics("musics/ncs/cs/Ap/Arijit/Atif/KK/Shreya/Diljit")
    playMusic(musics[0], true)
    // console.log(musics)

    //Display all the allbum folder in the page
 await displayAlbum()

    

    //Attach an even t listner to play ,next and pervius

    play.addEventListener("click", () => {
        if (currentMusic.paused) {
            currentMusic.play()
            play.src = "images/pause.svg"

        }
        else {
            currentMusic.pause()
            play.src = "images/play.svg"
        }
    })

    // Listen for timeupdate event
    currentMusic.addEventListener("timeupdate", () => {
        console.log(currentMusic.currentTime, currentMusic.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentMusic.currentTime)}/${secondsToMinutesSeconds(currentMusic.duration)}`
        document.querySelector(".circle").style.left = (currentMusic.currentTime / currentMusic.duration) * 100 + "%";
    })

    //Add an event listern to the seek baar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentMusic.currentTime = ((currentMusic.duration) * percent) / 100
    })

    // ADD an event in hamburger when we click the hambuger the left side part will be shown
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })



    // Store the original left position
    const originalLeftPosition = document.querySelector(".left").style.left;

    document.querySelector(".close").addEventListener("click", () => {
        // Reset the left position to its original value
        document.querySelector(".left").style.left = originalLeftPosition;
    });

    // another mothod to ADD an event in the close button
    // document.querySelector(".close").addEventListener("click", () => {
    //     document.querySelector(".left").style.left = "-120px";
    // });

    // Add an event listnerr to previous
    previous.addEventListener("click", () => {
        console.log("previous Clicked")
        console.log(currentMusic)
        let index = musics.indexOf(currentMusic.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(musics[index - 1])

        }
    })

    // Add an event listnerr to next
    next.addEventListener("click", () => {
        currentMusic.pause()
        console.log("Next Clicked")

        let index = musics.indexOf(currentMusic.src.split("/").slice(-1)[0])
        if ((index + 1) < musics.length ) {
            playMusic(musics[index + 1])

        }
    })
      // Add an event to volume
      document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentMusic.volume = parseInt(e.target.value)/100
      })
    

      //load the playlist whenever card is clicked
      Array.from(document.getElementsByClassName("card")).forEach(e=>{
        // console.log(e)
        e.addEventListener("click",async item=>{
            console.log("Fetching Songs")
            musics = await getmusics(`musics/${item.currentTarget.dataset.folder}`)
            playMusic(musics[0])
        })
      })


      // Add event listener to the mute track
      document.querySelector(".volume>img").addEventListener("click", e=>{
        console.log(e.traget)
        console.log("changing",e.target.src)
        if(e.target.src.includes("images/volume.svg")){
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentMusic.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else{
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentMusic.volume  = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;

        } 
      })
}
main()
