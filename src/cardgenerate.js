const path = require('path');
const directoryPath = path.join(__dirname, '/audio');

function createcard(cardID,filename,audiopath) {
    var parentlocation = document.getElementById("cardwidget");
    var playButtonID = (cardID + "play")
    var pauseButtonID = (cardID + "pause")
    var audioID = (cardID + "audio")
    var volumeID = (cardID + "volume")
    var resetID = (cardID + "reset")
    var timeID = (cardID + "time")
    var audiosourceID = (cardID + "audiosource")
    var playercard = document.createElement("div")
    var buttonwrapper = document.createElement("div")
    var playbutton = document.createElement("div")
    var playbuttontext = document.createElement("p")
    var pausebutton = document.createElement("div")
    var pausebuttontext = document.createElement("p")
    var audio = document.createElement("audio")
    var source = document.createElement("source")
    var volumecontrol = document.createElement("div")
    var input = document.createElement("input")
    var timereset = document.createElement("div")
    var timereseticon = document.createElement("i")
    var deletecard = document.createElement("div")
    var deletecardicon = document.createElement("i")
    var timeremaining = document.createElement("div")
    var time = document.createElement("p")
    var playercardname = document.createElement("div")
    var playercardnametext = document.createElement("p")

    parentlocation.append(playercard)
    playercard.setAttribute("id",cardID)
    playercard.setAttribute("class","playercard")

    playercard.append(buttonwrapper)
    buttonwrapper.setAttribute("class","buttonwrapper")

    buttonwrapper.append(playbutton)
    playbutton.setAttribute("class","playbutton")
    playbutton.setAttribute("id",playButtonID)
    playbutton.append(playbuttontext)
    playbuttontext.innerHTML = "Play"

    buttonwrapper.append(pausebutton)
    pausebutton.setAttribute("class","pausebutton")
    pausebutton.setAttribute("id",pauseButtonID)
    pausebutton.append(pausebuttontext)
    pausebuttontext.innerHTML = "Pause"

    playercard.append(audio)
    audio.setAttribute("id",audioID)
    audio.setAttribute("preload","auto")

    audio.append(source)
    source.setAttribute("src",audiopath)
    source.setAttribute("type","audio/mpeg")
    source.setAttribute("id",audiosourceID)

    playercard.append(volumecontrol)
    volumecontrol.setAttribute("class","volumecontrol")

    volumecontrol.append(input)
    input.setAttribute("type","range")
    input.setAttribute("min","0")
    input.setAttribute("max","100")
    input.setAttribute("value","100")
    input.setAttribute("class","volumeslider")
    input.setAttribute("id",volumeID)

    playercard.append(timereset)
    timereset.setAttribute("class","timereset")
    timereset.setAttribute("id",resetID)

    timereset.append(timereseticon)
    timereseticon.setAttribute("class","fas fa-redo")

    playercard.append(deletecard)
    deletecard.setAttribute("class","deletecard")
    deletecard.setAttribute("onclick",removeCard(cardID))

    deletecard.append(deletecardicon)
    deletecardicon.setAttribute("class","fas fa-trash")

    playercard.append(timeremaining)
    timeremaining.setAttribute("class","timeremaining")

    timeremaining.append(time)
    time.setAttribute("id",timeID)

    playercard.append(playercardname)
    playercardname.setAttribute("class","playercardname")

    playercardname.append(playercardnametext)
    playercardnametext.innerHTML = filename

    // Audio Stuff
    
    var audioelement = audio
    var pausebutton = document.getElementById(cardID + "pause")
    var durationelement = document.getElementById(cardID + "time")
    var volumecontrolslider = document.getElementById(cardID + "volume");
    var playbuttonAudio = document.getElementById(cardID + "play");
    var pausebuttonAudio = pausebutton
    var resetbuttonAudio = document.getElementById(cardID + "reset");
    
    playbuttonAudio.onclick = function() {
        audioelement.play();
        playercard.style.border = "solid 2px #32d74b";
    }

    pausebuttonAudio.onclick = function() {
        audioelement.pause();
        playercard.style.border = "solid 2px #343440";
    }

    resetbuttonAudio.onclick = function() {
        audioelement.currentTime = 0;
    }

    audioelement.onloadedmetadata = function() {
        var curtime
        var totaltime

        if (Math.round(audioelement.currentTime) < 10) {
            curtime = "0:0" + Math.round(audioelement.currentTime)
        } else if (Math.round(audioelement.currentTime) > 9) {
            curtime = "0:" + Math.round(audioelement.currentTime)
        }

        if (Math.round(audioelement.duration) < 10) {
            totaltime = "0:0" + Math.round(audioelement.duration)
        } else if (Math.round(audioelement.duration) > 9) {
            totaltime = "0:" + Math.round(audioelement.duration)
        }

        fadePause()

        durationelement.innerHTML = curtime + " / " + totaltime
    };
    
    audioelement.ontimeupdate = function() {
        var curtime
        var totaltime

        if (Math.round(audioelement.currentTime) < 10) {
            curtime = "0:0" + Math.round(audioelement.currentTime)
        } else if (Math.round(audioelement.currentTime) > 9) {
            curtime = "0:" + Math.round(audioelement.currentTime)
        }

        if (Math.round(audioelement.duration) < 10) {
            totaltime = "0:0" + Math.round(audioelement.duration)
        } else if (Math.round(audioelement.duration) > 9) {
            totaltime = "0:" + Math.round(audioelement.duration)
        }

        fadePause()

        durationelement.innerHTML = curtime + " / " + totaltime
    };

    function fadePause() {
        if (audioelement.currentTime != audioelement.duration) {
            if (audioelement.currentTime != 0) {
                pausebutton.style.display = "block";
                pausebutton.style.opacity = "1";
                pausebutton.style.cursor = "pointer";
            }
        } else {
            pausebutton.style.opacity = "0";
            pausebutton.style.cursor = "context-menu";
            playercard.style.border = "solid 2px #343440";
        }
    }

    volumecontrolslider.oninput = function() {
        audioelement.volume = (this.value / 100);
    }
}

fs.readdir(directoryPath, function(err, files) {
    if(err) {
        return console.log('Unable to fetch directory: ' + err);
    } 

    files.forEach(function(file) {
        const unicardID = ('_' + Math.random().toString(36).substr(2, 9))

        console.log(unicardID);

        var cardname = file.replace('.mp3','');
        createcard(unicardID,cardname,("audio/" + file))
    });
});