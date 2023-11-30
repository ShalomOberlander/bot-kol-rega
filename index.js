
import axios from 'axios';
import { parse } from 'node-html-parser';

const url = 'https://www.kore.co.il/flashNews';

let lestid = 0

async function fetchAndParseWebsite() {
  try {
    // Fetch the HTML content of the website
    const response = await axios.get(url);

    // Parse the HTML content
    const root = parse(response.data);
    let alltext = root.toString()
    let id = 0
    let texttosand = ""
    let startfleshindex = 0
    let finelfleshindex = 0
    let texttochaek = ""
    let bul1 = true

    let index = 8120
    while(bul1){
        texttochaek = alltext.slice(index,index+25)
        if (texttochaek === '<li><a href="/flashNews#f'){
            bul1 = false
            startfleshindex = index+25
        }

        index ++
    }
    index = 0
    bul1 = true
    texttochaek = ""
    while(bul1){
        texttochaek += alltext[startfleshindex+index]
        if ((alltext[startfleshindex+index+1].charCodeAt(0) < 48)||(alltext[startfleshindex+index+1].charCodeAt(0) > 57)){
            bul1 = false
            id = texttochaek
            startfleshindex = startfleshindex+index+6   
        }
        
        index ++
    }
    if (lestid !== id){
        index = startfleshindex
        bul1 = true
        while(bul1){
            texttochaek = alltext.slice(index,index+13)
            if (texttochaek === '</p></a></li>'){
                bul1 = false
                finelfleshindex = index
            }

            index ++
        }
        texttosand = alltext.slice(startfleshindex,finelfleshindex)
        lestid = id
        while (texttosand.includes("quot")){
            for (let index = 0; index < texttosand.length; index++) {
                if (texttosand[index] == 'q'){
                    startfleshindex = index
                }  
            }
            let letext = texttosand.length
            texttosand = texttosand.slice(0,startfleshindex-1) +'"'+texttosand.slice(startfleshindex+5,letext)
        }
        webhook(texttosand)
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

function webhook(text) {
    
    const webhookURL = 'https://chat.googleapis.com/v1/spaces/AAAA-_rWn38/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=SSNJ3qPiWJLaRNyF8sQckaS1AaV64WcpBoYQppyZlck';
  
    const data = JSON.stringify({
      'text':text,
    });
    let resp;
    fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: data,
    }).then((response) => {
      resp = response;
      
    });
    return resp;
  }

// Watch for file changes
setInterval(() => {
  
    fetchAndParseWebsite();
}, 100000);

