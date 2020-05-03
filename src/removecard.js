const fs = require('fs');

function removeCard(CardIDRC) {
    var audioSourceElement = document.getElementById((CardIDRC + 'audiosource'));
    var audioFilePath = audioSourceElement.getAttribute('crc');

    fs.unlink(audioFilePath, (err) => {
        if(err) {
            console.log(err)
            return
        }
    }); 
}