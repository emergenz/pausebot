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
    res.render('index', {pageTitle: 'Pausebot - We pause your TikToks- just in time', pageDescription: 'Pausebot - Your TikTok Pausebot and Downloader',
    keyWords: 'TikTok pausebot, Tik Tok, Pausebot, pausebot.com, tiktok pause, TikTok downloader, mp4 Tik Tok downloader',
    ogTitle: 'Pausebot - We pause your TikToks - just in time',
    ogDescription: 'Your online TikTok Pausebot & Downloader',
    twitterTitle: 'Pausebot - just in time',
    twitterDescription: 'Your online TikTok Pausebot & Downloader',
    title1: 'Your TikTok',
    title2: 'Pausebot',
    buttonText: 'Get Photo',
    actionVar: '/',
    headingText: 'Why pausebot?',
    textBox: `Do you want to be the CEO of pausing TikTok videos? Do you dislike the pausebots offered on TikTok? Then this is the right website for you. <br>
    Our team at pausebot.com has developed sophisticated algorithms for pausing your submitted TikToks - <span class='underline-description'> just in time </span><br>
    To do so you simply have to: <br><br>
    <ul>
    <li> <span class='description-list-start'> 1. </span>Copy a TikTok link (e.g https://vm.tiktok.com/123456)</li>
    <li> <span class='description-list-start'> 2. </span>Go to this site (pausebot.com) </li>
    <li> <span class='description-list-start'> 3. </span>Paste the link in the field above. </li>
    <li> <span class='description-list-start'> 4. </span>Hit the "Get Photo" button and wait for our servers to process your request. The processing time can range from 5 to 10 seconds, depending on your Internet speed and the length of the video. </li>
    <li> <span class='description-list-start'> 5. </span>After we have processed the video the paused image will appear on your screen without a watermark. Glad we could help! </li>
    </ul>
    If you want to express your gratitude in form of financial support, please take a look at the bottom of this page or visit our <a href=/contact/>Contact page</a>. <br>
    If you are not satisfied with the results of our services, please checkout our <a href=/contact/>Contact page</a>. <br>
    You can also download the TikTok video directly to your device via our <a href=/download/>Download page</a> and manually pause the video yourself. <br>
    If you have encountered any problems or issues with our services we advise you to contact us via our <a href=/contact/>Contact page</a>. If you have any questions regarding your privacy rules please take a look at our <a href=/privacy/>Privacy page</a>`});
    systemSync("rm -f *.jpg");
    systemSync("rm -f *.mp4");
    systemSync("rm -f *.txt");
})

app.get('/download/', function(req, res){
    res.render('index', {pageTitle: 'TikTok Downloader',
    pageDescription: 'TikTok Video Downloader by Pausebot',
    keyWords: 'tiktok downloader, tiktok video downloader, tiktok to mp4, tiktok mp4 video, pausebot downloader',
    ogTitle: 'TikTok downloader by pausebot.com',
    ogDescription: 'Download TikTok Videos to mp4 powered by Pausebot',
    twitterTitle: 'TikTok Downloader - powered by Pausebot',
    twitterDescription: 'Download TikTok Videos to mp4 powered by Pausebot',
    title1: 'Your TikTok',
    title2: 'Downloader',
    buttonText: 'Get Video',
    actionVar: '/download/',
    headingText:'TikTok Downloader',
    textBox: `Downloading TikTok videos without a watermark to your mobile or desktop device has never been so easy.
    In order to download any TikTok video follow the following steps:
    <ul>
    <li> <span class='description-list-start'> 1. </span> Copy a TikTok link (e.g https://vm.tiktok.com/123456)</li>
    <li> <span class='description-list-start'> 2. </span> Go to this site (pausebot.com/download) </li>
    <li> <span class='description-list-start'> 3. </span> Paste the link in the field above. </li>
    <li> <span class='description-list-start'> 4. </span> Hit the "Get Video" button and wait for our servers to process your request. The processing time can range from 5 to 10 seconds, depending on your Internet speed and the length of the video. </li>
    <li> <span class='description-list-start'> 5. </span> After processing the video will be downloaded to your device's storage without a watermark. Glad we could help! </li>
    </ul>
    Just copy the link from TikTok, paste it in the text field above and hit "Get video".
    Our servers immediately process your request and start downloading the video as an mp4 file directly to your device's storage.
    This process takes between 5 and 10 seconds, depending on your Internet speed and the length of the video.
    If you have encountered any problems or issues with our services we advise you to contact us via our Contact page.`
    });
})

app.get('/contact/', function (req, res) {
    res.render('contact', {pageTitle: 'Contact',
    pageDescription: 'Contact pausebot.com',
    ogTitle: 'Contact the pausebot.com Team!',
    ogDescription: 'pausebot.com help and contact',
    twitterTitle: 'pausebot.com contact page',
    twitterDescription: 'Contact the pausebot.com Team here!',
    title1: '',
    title2: 'Contact us',
    headingText: 'Information',
    textBox: `<span class='underline-description'> E-Mail:</span> <a href="mailto:pausebot@pausebot.com"> pausebot@pausebot.com</a> <br>
    <span class='underline-description'>Instagram:</span> <a href='https://instagram.com/pausebotcom'> pausebotcom </a> <br>
    <span class='underline-description'>TikTok:</span> <a href='https://www.tiktok.com/@pausebotcom'> pausebotcom</a> <br>
    <h4 class='small-text-box-heading'>Reporting an issue</h4>
    If you want to report a problem that you have encountered during the use of our services please make sure to give us a detailed description of the occuring of the error.<br>
    In order to locate the cause of the issue we require certain information, such as:
    <ul>
    <li> <span class='underline-description'> What happened exactly?</span> <br> Website crashed, error message appeared, wrongfully paused</li>
    <li> <span class='underline-description'> Which video did not get paused?</span> <br> Please include the TikTok link that caused the issue so we can distinguish between an algorithmic or network error.</li>
    <li> <span class='underline-description'> When did the error occur? </span> <br> We update our services frequently so our users can enjoy an extraordinary experience. Issues can occur during updating our services.
    Please keep in mind to always include your timezone when reporting a time.</li>
    <li> <span class='underline-description'> What operating system and browser are you using? </span> <br> The used browser and operating system have a big impact on the appearance and functionality of our services.</li>
    </ul>
    We need this information in order to narrow down the root cause of the issue.<br>
    If you have any questions regarding our privacy policy, please take a look at our <a href='/privacy'>Privacy page</a>`
    });
})

app.get('/privacy/', function(req, res) {
    res.render('contact', {pageTitle: 'Privacy',
    pageDescription: 'pausebot.com privacy rules ',
    ogTitle: 'Pausebot.com Privacy',
    ogDescription: 'Privacy page and rules of pausebot.com',
    twitterTitle: 'pausebot.com privacy page',
    twitterDescription: 'Privacy on pausebot.com',
    title1: '',
    title2: 'Privacy',
    headingText: 'Our Policy',
    textBox: `
    <h4 class='small-text-box-heading'>Personal identification information</h4>
    We may collect personal identification information from users in a variety of ways, including, but not limited to, when users visit our site, fill out a form, and in connection with other activities, services, features or resources we make available on our site. users may visit our site anonymously. We will collect personal identification information from users only if they voluntarily submit such information to us. users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain site related activities.
    <h4 class='small-text-box-heading'>Non-personal identification information</h4>
    We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the browser name, the type of computer and technical information about users means of connection to our site, such as the operating system and the Internet service providers utilized and other similar information. We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the browser name, the type of computer and technical information about users means of connection to our site, such as the operating system and the Internet service providers utilized and other similar information.
    <h4 class='small-text-box-heading'>Web browser cookies</h4>
    We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the browser name, the type of computer and technical information about users means of connection to our site, such as the operating system and the Internet service providers utilized and other similar information. We may collect non-personal identification information about users whenever they interact with our site. Non-personal identification information may include the browser name, the type of computer and technical information about users means of connection to our site, such as the operating system and the Internet service providers utilized and other similar information.
    <h4 class='small-text-box-heading'>How we use collected information</h4>
    pausebot.com does not collect or store information about you.
    <h4 class='small-text-box-heading'>Advertising</h4>
    Ads appearing on our site may be delivered to users by advertising partners, who may set cookies. These cookies allow the ad server to recognize your computer each time they send you an online advertisement to compile non personal identification information about you or others who use your computer. This information allows ad networks to, among other things, deliver targeted advertisements that they believe will be of most interest to you. This privacy policy does not cover the use of cookies by any advertisers.
    <h4 class='small-text-box-heading'>Google Adsense</h4>
    Some of the ads may be served by Google. Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet. DART uses "non personally identifiable information" and does NOT track personal information about you, such as your name, email address, physical address, etc. You may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at <a href='https://policies.google.com/technologies/ads'>https://policies.google.com/technologies/ads</a>
    <h4 class='small-text-box-heading'>Changes to this privacy policy</h4>
    pausebot.com has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our site, revise the updated date at the bottom of this page. We encourage users to frequently check this page for any changes to stay informed about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
    <h4 class='small-text-box-heading'>Your acceptance of these terms</h4>
    By using this site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our site. Your continued use of the site following the posting of changes to this policy will be deemed your acceptance of those changes.`
});
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
            console.log('bei getVideo');
            res.render('errorhandling',{title: 'Error', text: 'Please check if your link is right.'});
        }
        try {
            getScreenshot(inputfile, tiktokId);
        } catch (error) {
            console.log('bei getScreenshot');
            res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
        }
        console.log(link);
        //res.render('index');
        if (fs.existsSync(tiktokId + ".jpg")) {
            res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
        } else {
            console.log('bei sendFile');
            res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
        }

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
        if (fs.existsSync(tiktokId + ".jpg")) {
            res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
        } else {
            console.log('bei sendFile');
            res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
        }
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
                if (fs.existsSync(tiktokId + ".jpg")) {
                    res.sendFile(""+ tiktokId +".jpg", {root: __dirname});
                } else {
                    console.log('bei sendFile');
                    res.render('errorhandling',{tite: 'Error', text: 'Sure that your video has something to pause?'});
                }
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
