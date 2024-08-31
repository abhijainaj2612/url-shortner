const express = require("express");
const connectToMongo = require("./database/db");
let ejs = require('ejs');
const urlData = require("./Models/urldata");
const app = express();
const path = require("path")
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.set("views", path.join(__dirname, "views"));
connectToMongo();

let ourSite = "http://shortten.herokuapp.com/";

function validateURL(link) {
    if (link.indexOf("http://") == 0 || link.indexOf("https://") == 0) {
        return true;
    }
    else {
        return false;
    }
}
app.get("/", (req, res) => {
    res.render("home", { shortenUrl : null });
})

//Generating short url
app.post("/", urlencodedParser, async (req, res) => {
    let { url } = req.body;
    if (!validateURL(url)) {
        url = "http://" + url;
    }
    try {
        const data = await urlData.findOne({ url: url });
        if (data) {
            const shortenUrl = ourSite.concat(data.shortcode);
            res.render("home", { shortenUrl: shortenUrl });
        } else {
            let shortcode = Math.random().toString(36).substring(2, 7);
            const newdata = new urlData({ url, shortcode });
            const savedData = await newdata.save();
            const shortenUrl = ourSite.concat(shortcode);
            res.render("home", { shortenUrl: shortenUrl })
        }
    } catch (error) {
        console.log(error);
        res.render("error")
    }

})

//Redirecting to the Shorten Url
app.get("/:scode", async (req, res) => {
    const shortCode = req.params.scode;
    try {
        const data = await urlData.findOne({ shortcode: shortCode });
        if (data) {
            res.redirect(data.url);
        } else {
            res.render("error", { errorCode: "404", errorMsg: "Not Found!" });
        }
    } catch (error) {
        console.log(error);
        res.render("error", { errorCode: "500", errorMsg: "Internal Server Error!" })
    }
})

app.get("/site/about",(req,res)=>{
    res.render("about")
})

app.listen(process.env.PORT || 5000, (req, res) => {
    console.log("Server running at 5000");
})