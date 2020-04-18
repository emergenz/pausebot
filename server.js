const os = require('os');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const fs = require('fs')
const child_process = require('child_process');
const patt = /(?:\/)(\d+)/;
function systemSync(cmd) {
  return child_process.execSync(cmd).toString();
}

function finder(link,callback){
    https.get(link,(resp)=>{
        let data = "";
        if(resp.statusCode===301){
            //WENN DIE URL GEHT
            resp.on('data',(chunk)=>{
                data+=chunk;
            });
            resp.on('end',()=>{
                var newUrl=data.match(patt)[1];
                callback(newUrl)
                //console.log(newUrl);

            });
        }else{
            //WENN DIE URL NICHT GEHT
            var newUrl= "Nope";
            callback(newUrl)
            //console.log(resp.statusCode);
        }
    });
}

function getVideo(inputfile, tiktokId){
    systemSync('tiktok-scraper video ' + link);
}

function compressVideo(inputfile, tiktokId){
    systemSync("ffmpeg -y -i " + inputfile + " -crf 49 -vf scale=iw/2:ih/2,crop=iw:ih*.824:0:ih*.09,hue=s=0 -an '"+ tiktokId+"output.mp4'");
}

function getTimestamps(inputfile, tiktokId){
    systemSync(`ffmpeg -i "`+ tiktokId +`output.mp4" -filter:v "select='gt(scene,0.4)',showinfo" -f null - 2> ffout` + tiktokId +".txt");

    systemSync("grep showinfo ffout" + tiktokId + ".txt | grep \'pts_time:[0-9.]*\' -o | grep \'[0-9.]*\' -o > "+ tiktokId +"timestamps.txt");
   systemSync("ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "+ tiktokId +"output.mp4 >> "+ tiktokId +"timestamps.txt");

    var timestampsname = tiktokId + "timestamps.txt";
    var diff = [];
    var timestamps = fs.readFileSync(timestampsname, "UTF-8").split("\n");
    timestamps = timestamps.filter(item => item).map(Number);

    console.log(timestamps)

    for (i=0; i < timestamps.length - 1; i++){
        diff.push(timestamps[timestamps.length -1-i] - timestamps[timestamps.length -2-i]);
    }

    console.log(diff)

    if(timestamps.length > 1){
        old_diff=diff.slice();
        old_diff=old_diff.reverse();
        console.log(old_diff);
        diff.sort();
        console.log(diff);
        var lowest_diff = diff[0];
        console.log(lowest_diff);
        var lowest_diff_position = old_diff.indexOf(lowest_diff);
        console.log(timestamps[lowest_diff_position]);
        var new_timestamp = timestamps[lowest_diff_position]+ (timestamps[lowest_diff_position + 1] - timestamps[lowest_diff_position])/2;
        console.log(new_timestamp);
        return new_timestamp;
    } else if(timestamps.length == 1){
        var lowest_diff_position = 0;
        var new_timestamp = timestamps[0];
        return new_timestamp;
    } else {
        console.log("Error: No timestamps found")
    }
}

function getScreenshot(inputfile, tiktokId){


    compressVideo(inputfile, tiktokId);

    new_timestamp = getTimestamps(inputfile, tiktokId);

    systemSync("ffmpeg -y -ss " + new_timestamp.toString() + " -i " + inputfile +" -vframes 1 -q:v 2 " +tiktokId+ ".jpg");

}

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'pug')

app.get('/', function (req, res) {
    console.log("GET REQUEST");
    res.render('index', {pageTitle: 'Pausebot - We pause your TikToks- just in time', pageDescription: 'Pausebot - Your TikTok Pausebot and Downloader', keyWords: 'TikTok pausebot, Tik Tok, Pausebot, pausebot.com, tiktok pause, TikTok downloader, mp4 Tik Tok downloader', ogTitle: 'Pausebot - We pause your TikToks - just in time', ogDescription: 'Your online TikTok Pausebot & Downloader', twitterTitle: 'Pausebot - just in time', twitterDescription: 'Your online TikTok Pausebot & Downloader', title1: 'Your TikTok', title2: 'Pausebot', buttonText: 'Get Photo', actionVar: '/', headingText: 'Why pausebot?',textBox: 'Do you want to be the CEO of pausing TikToks? Do you dislike the pausebots offered on TikTok? Then this is the right website for you. We at pausebot.com have developed sophisticated algorithms for pausing TikToks for you - just in time. <br> To do so you simply have to: <br><br> 1. Copy a TikTok link (e.g https://vm.tiktok.com/123456) <br> 2. Go to this site (pausebot.com) <br> 3. Paste the link in the field above. <br> 4. Hit the "Get Photo" button and wait for our servers to process your request. The processing time ranges from 5 to 10 seconds, depending on your Internet speed and the length of the video. <br> 5. After we have processed the video the paused image will appear on your screen without a watermark. Glad we could help! <br> If you want to express your gratitude in financial form, please take a look at the bottom of this page or visit our ”Contact us” page. <br> If you are not satisfied with the results of our services, please checkout our Contact page. <br> You can also download the TikTok video directly to your device via our download service and manually pause the video yourself. <br> If you have encountered any problems or issues with our service we advise you to contact us via our Contact page. If you have any questions regarding your privacy rules please take a look at our ”Privacy” page.'});
    systemSync("rm -f *.jpg");
    systemSync("rm -f *.mp4");
    systemSync("rm -f *.txt");
})

app.get('/contact/', function (req, res) {
    res.render('contact', {pageTitle: 'Contact', pageDescription: 'Contact pausebot.com', ogTitle: 'Contact the pausebot.com Team!', ogDescription: 'pausebot.com help and contact', twitterTitle: 'pausebot.com contact page', twitterDescription: 'Contact the pausebot.com Team here!', title1: '', title2: 'Contact us', textBox: '#'});
})

app.get('/privacy/', function(req, res) {
    res.render('contact', {pageTitle: 'Privacy', pageDescription: 'pausebot.com privacy rules ', ogTitle: 'Pausebot.com Privacy', ogDescription: 'Privacy page and rules of pausebot.com', twitterTitle: 'pausebot.com privacy page', twitterDescription: 'Privacy on pausebot.com', title1: '', title2: 'Privacy', textBox: '#'});
})

app.get('/download/', function(req, res){
    res.render('index', {pageTitle: 'TikTok Downloader', pageDescription: 'TikTok Video Downloader by Pausebot', keyWords: 'tiktok downloader, tiktok video downloader, tiktok to mp4, tiktok mp4 video, pausebot downloader', ogTitle: 'TikTok downloader by pausebot.com', ogDescription: 'Download TikTok Videos to mp4 powered by Pausebot', twitterTitle: 'TikTok Downloader - powered by Pausebot', twitterDescription: 'Download TikTok Videos to mp4 powered by Pausebot', title1: 'Your TikTok', title2: 'Downloader', buttonText: 'Get Video', actionVar: '/download/', textBox: '#'});
})

app.get('/wp-login', function(req, res){
    res.render('wp-login');
})

app.get('/robots.txt', function(req, res){
    res.type('text/plain');
    res.send('Sitemap: https://pausebot.com/sitemap.xml\nUser-agent: *\nDisallow:');
})

app.get('/sitemap.xml', function(req, res){
    res.sendFile("public/sitemap.xml", {root: __dirname});
})

app.post('/', function (req, res) {

    link = req.body.link;

    if(link.includes("/video/")){
        console.log("JO INCLUDES VIDEO");
        var tiktokId = link.match(patt)[1];
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error){
            res.render('errorhandling',{title: 'Error', text: 'Please check if your link is right.'});
        }
        try {
        getScreenshot(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
        }
        console.log(link);
        //res.render('index');
        res.sendFile(""+ tiktokId +".jpg", {root: __dirname});

    } else if(/\d{10}/.test(link)===true){
        console.log("JO INCLUDES NUMBER");
        var tiktokId = link.match(patt)[1];
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error){
            res.render('errorhandling',{tite: 'Error', text: 'Please check if your link is right.'});
        }
        try {
        getScreenshot(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
        }
        console.log(link);
        res.sendFile(""+ tiktokId +".jpg", {root: __dirname});

    } else {
        try {
            finder(link,function(results){
                console.log("JO NO NUMBER");
                var tiktokId = results;
                var inputfile = tiktokId + ".mp4";
                link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
                getVideo(inputfile, tiktokId);
                try {
                    getScreenshot(inputfile, tiktokId);
                } catch (error){
                    res.render('errorhandling',{tite: 'Error', text: 'Your link is right? There\'s something to pause?'});
                }
                console.log(link);
                res.sendFile(""+ tiktokId +".jpg", {root: __dirname});

            });
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Your link is right? There\'s something to pause?'});
        }
    }
})

app.post('/download/', function (req, res) {
    link = req.body.link;
    if(link.includes("/video/")){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES VIDEO");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Please check if your link is right.'});
        }
        console.log(link);
        //res.render('index');
        res.download(inputfile);

    } else if(/\d{10}/.test(link)===true){
        var tiktokId = link.match(patt)[1];
        console.log("JO INCLUDES NUMBER");
        var inputfile = tiktokId + ".mp4";
        link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
        try {
        getVideo(inputfile, tiktokId);
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Please check if your link is right.'});
        }
        console.log(link);
        res.download(inputfile);

    } else {
        try {
        finder(link,function(results){
            console.log("JO NO NUMBER");
            var tiktokId = results;
            var inputfile = tiktokId + ".mp4";
            link = "https://www.tiktok.com/@tiktok/video/" + tiktokId;
            getVideo(inputfile, tiktokId);
            console.log(link);
            res.download(inputfile);
        });
        } catch (error) {
            res.render('errorhandling',{tite: 'Error', text: 'Please check if your link is right.'});
        }
    }
})
app.use(function(req, res, next){
    res.status(404).render("errorhandling", {title: '404', text: 'Sorry, mate. That site doesn\'t exist.'});
})


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})
