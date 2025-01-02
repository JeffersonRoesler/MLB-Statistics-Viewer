import './styles.scss';

const ISOK = 200; // HTTP status code for a successful request
var request = new XMLHttpRequest();
var scheduleData;
var currentIndex = 0;
var currentHighlightIndex = 0;
var gamePk = "";
var videoObj = {};

function getJSONAsync(url, callback) {
    request.onload = function () {
        if (request.status === ISOK) {
            callback(JSON.parse(request.responseText));
        }
    };
    request.open("GET", url, true);
    request.send();
}

function displaySchedule() {
    var game = scheduleData.dates[0].games[currentIndex];
    var homeTeam = game.teams.home.team.name;
    var awayTeam = game.teams.away.team.name;
    gamePk = game.gamePk;

    document.getElementById("teamsDiv").innerHTML = "Home Team: " + homeTeam + "<br>Away Team: " + awayTeam;
    getVideoData();
}

function getVideoData() {
    request.onload = function () {
        if (request.status === ISOK) {
            videoObj = JSON.parse(request.responseText);
            displayHighlight(0);
        }
    };

    var videoUrl = "https://statsapi.mlb.com/api/v1/game/[gamePK]/content".replace("[gamePK]", gamePk);
    request.open("GET", videoUrl, true);
    request.send();
}

function displayHighlight(index) {
    if (videoObj && videoObj.highlights && videoObj.highlights.highlights && videoObj.highlights.highlights.items) {
        var highlights = videoObj.highlights.highlights.items;
        var highlightDiv = document.getElementById("highlightDiv");
        highlightDiv.innerHTML = "";

        if (index >= 0 && index < highlights.length) {
            var highlight = highlights[index];
            var title = highlight.title;
            var highlightElement = document.createElement("div");
            highlightElement.textContent = "Highlight: " + title;
            highlightDiv.appendChild(highlightElement);
        } else {
            console.log("Invalid highlight index");
        }
    }
}

function playVideo() {
    var highlight = videoObj.highlights.highlights.items[currentHighlightIndex];
    var videoUrl = highlight.playbacks[0].url;
    window.open(videoUrl, '_blank').focus();
}

function getNext() {
    if (currentIndex < scheduleData.dates[0].games.length - 1) {
        currentIndex++;
        displaySchedule();
    }
}

function getPrevious() {
    if (currentIndex > 0) {
        currentIndex--;
        displaySchedule();
    }
}

function getNextHighlight() {
    if (videoObj && videoObj.highlights && videoObj.highlights.highlights && videoObj.highlights.highlights.items) {
        var highlights = videoObj.highlights.highlights.items;
        if (currentHighlightIndex < highlights.length - 1) {
            currentHighlightIndex++;
        } else {
            currentHighlightIndex = 0;
        }
        displayHighlight(currentHighlightIndex);
    }
}

function getPreviousHighlight() {
    if (videoObj && videoObj.highlights && videoObj.highlights.highlights && videoObj.highlights.highlights.items) {
        var highlights = videoObj.highlights.highlights.items;
        if (currentHighlightIndex > 0) {
            currentHighlightIndex--;
        } else {
            currentHighlightIndex = highlights.length - 1;
        }
        displayHighlight(currentHighlightIndex);
    }
}

function retrieveMLBData() {
    var year = document.getElementById("year").value;
    var month = document.getElementById("month").value;
    var day = document.getElementById("day").value;

    var url = "https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=" + year + "-" + month + "-" + day + "&endDate=" + year + "-" + month + "-" + day;

    getJSONAsync(url, function (data) {
        scheduleData = data;
        currentIndex = 0;
        currentHighlightIndex = 0;
        displaySchedule();
    });
}