// ==UserScript==
// @name         HackerRank problems's solution saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт сохраняет файл в папку HackerRank
// @author       @t138szx - telegram
// @match        https://www.hackerrank.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codewars.com
// @grant        GM_download
// @licence      MIT

// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && window.location.href.search('challenges') != -1) {
                main();
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function main() {
    'use strict';
    let url = window.location.href;
    var elem = document.getElementsByClassName("pmR pmL pmB plT run-code-wrapper")[0];
    if (elem.children.length >= 3) {
        return;
    }

    var downloadBtn = document.createElement("Button");
    downloadBtn.innerHTML = "Download";
    var firstChild = elem.children[0];

    downloadBtn.className = firstChild.className;
    downloadBtn.style = "margin-right: 10px";

    downloadBtn.addEventListener("click", download);
    elem.appendChild(downloadBtn);
}

function download() {
    let pNC = document.getElementsByClassName('breadcrumb-item');
    let problemName = pNC[pNC.length - 1].childNodes[1].outerText;

    let problemLang = document.getElementsByClassName(' css-ki0glp')[0].textContent;
    console.log(problemName, problemLang);

    let problemCode = document.getElementsByClassName('view-lines')[0].childNodes;
    console.log(problemCode);

    let arrCode = [];
    for (let i = 0; i < problemCode.length; i++) {
        arrCode.push(problemCode[i].innerText + '\n')
    }

    let problemFileExt;
    switch (problemLang) {
        case 'C++':
            problemFileExt = '.cpp';
            break;
        case 'C++14':
            problemFileExt = '.cpp';
            break;
        case 'C#':
            problemFileExt = '.cs';
            break;
        case 'C':
            problemFileExt = '.c';
            break;
        case 'F#':
            problemFileExt = '.fs';
            break;
        case 'Go':
            problemFileExt = '.go';
            break;
        case 'Haskell':
            problemFileExt = '.hs';
            break;
        case 'Java 7':
            problemFileExt = '.java';
            break;
        case 'Java 8':
            problemFileExt = '.java';
            break;
        case 'Java 15':
            problemFileExt = '.java';
            break;
        case 'JavaScript (Node.js)':
            problemFileExt = '.js';
            break;
        case 'Lua':
            problemFileExt = '.lua';
            break;
        case 'Kotlin':
            problemFileExt = '.pas';
            break;
        case 'PHP':
            problemFileExt = '.php';
            break;
        case 'Python 3':
            problemFileExt = '.py';
            break;
        case 'TypeScript':
            problemFileExt = '.ts';
            break;
        default:
            problemFileExt = '.file';
            break;
    }
    save(arrCode, problemFileExt, problemName);
}

function save(code, fileExt, fileName) {
    let htmlContent = [code.join("")];
    let bl = new Blob(htmlContent, { type: "text/" + fileExt });

    let downloadArgs = {
        url: URL.createObjectURL(bl),
        name: "HackerRank/" + fileName + fileExt
    }
    GM_download(downloadArgs);
}

function remCodePos(str) {
    let s = String();
    let ind = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= '9') {
            continue;
        } else {
            ind = i;
            break;
        }
    }
    s = str.substr(ind, str.length);
    return s;
}