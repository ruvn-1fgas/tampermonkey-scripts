// ==UserScript==
// @name         CodeWars kata's solution saver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Скрипт сохраняет файл в папку, с соответствующим kyu, названием и расширением файла
// @author       @t138szx - telegram
// @match        https://www.codewars.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codewars.com
// @grant        GM_download

// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            if (this.readyState == 4 && window.location.href.search('train') != -1) {
                main();
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function main() {
    'use strict';
    let url = window.location.href;
    var elem = document.getElementsByClassName("flex flex-row flex-nowrap justify-end")[0];
    if (elem.children.length >= 4) {
        return;
    }

    var downloadBtn = document.createElement("Button");
    downloadBtn.innerHTML = "Download";

    var firstChild = elem.children[0];

    downloadBtn.className = firstChild.className;
    downloadBtn.className += "lg:w-15";
    elem.children[0].style.marginLeft = "4px";
    downloadBtn.addEventListener("click", download);
    elem.insertBefore(downloadBtn, elem.firstChild);
}

function download() {
    let kataName = $('h4')[0].innerText;
    let kataKyu = document.getElementsByClassName('inner-small-hex is-extra-wide');

    let tempKataKyu = document.getElementsByClassName('tag is-extra-wide ');
    if (tempKataKyu.length == 0)
        kataKyu = kataKyu[kataKyu.length - 1].textContent[0];
    else
        kataKyu = tempKataKyu[0].textContent[0];

    console.log(kataKyu);

    let kataLang = Array.from(String(window.location.href)).reverse();
    let ind = kataLang.indexOf('/');
    kataLang = kataLang.slice(0, ind).reverse().join('');
    console.log(kataLang);

    let kataCode = document.getElementsByClassName('CodeMirror-code')[0];
    console.log(kataCode);
    let kataCodeChild = kataCode.childNodes;

    let arrCode = [];
    for (let i = 0; i < kataCodeChild.length; i++) {
        let item = kataCodeChild.item(i).innerText;
        item = remCodePos(item);
        arrCode.push(item);
    }
    arrCode[0] = arrCode[0].substr(1, arrCode[0].length);
    let kataFileExt;
    switch (kataLang) {
        case 'cpp':
            kataFileExt = '.cpp';
            break;
        case 'csharp':
            kataFileExt = '.cs';
            break;
        case 'c':
            kataFileExt = '.c';
            break;
        case 'fsharp':
            kataFileExt = '.fs';
            break;
        case 'go':
            kataFileExt = '.go';
            break;
        case 'haskell':
            kataFileExt = '.hs';
            break;
        case 'java':
            kataFileExt = '.java';
            break;
        case 'javascript':
            kataFileExt = '.js';
            break;
        case 'lua':
            kataFileExt = '.lua';
            break;
        case 'pascal':
            kataFileExt = '.pas';
            break;
        case 'php':
            kataFileExt = '.php';
            break;
        case 'python':
            kataFileExt = '.py';
            break;
        case 'typescript':
            kataFileExt = '.ts';
            break;
        default:
            kataFileExt = '.file';
            break;
    }
    save(arrCode, kataFileExt, kataName, kataKyu);
}

function save(code, fileExt, fileName, kataKyu) {
    let htmlContent = [code.join("")];
    let bl = new Blob(htmlContent, { type: "text/" + fileExt });

    let downloadArgs;

    if (kataKyu != 'Beta')
        downloadArgs = {
            url: URL.createObjectURL(bl),
            name: "Codewars/" + kataKyu + " kyu/" + fileName + fileExt
        }
    else
        downloadArgs = {
            url: URL.createObjectURL(bl),
            name: "Codewars/" + kataKyu + "/" + fileName + fileExt
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