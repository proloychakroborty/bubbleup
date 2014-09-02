/*global console, alert, ActiveXObject, XMLSerializer */

(function () {
    "use strict";

    var alist = document.getElementById("alist"),
        addItem = document.getElementById("addItem"),
        errorBox = document.getElementById("errorbox"),
        modal = document.getElementById("modal"),
        modalText = document.getElementById("modalText"),
        btnYes = document.getElementById("btnYes"),
        btnNo = document.getElementById("btnNo"),
        removeSel = document.getElementById("removeSel"),
        exportXML = document.getElementById("exportXML"),
        xmlOutput = document.getElementById("xmlOutput"),
        clickedAIndex,
        xmlDoc;

    // Has class [begin]
    function hasClass(sl, cl) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            objCount = (theObj.length > 1) ? theObj.length : 1,
            status = [],
            thisObj,
            currentClasses,
            i;

        for (i = 0; i < objCount; i += 1) {
            thisObj = (typeof theObj[i] === "undefined") ? theObj : theObj[i];

            if (thisObj.className !== "") {
                currentClasses = thisObj.className.split(" ");

                status[i] = (currentClasses.indexOf(cl) === -1) ? false : true;

            } else {
                status[i] = false;
            }
        }

        return (status.indexOf(true) === -1) ? false : true;
    }
    // Has class [end]

    // Add Class [begin]
    function addClass(sl, cl, bool) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            objCount = (theObj.length > 1) ? theObj.length : 1,
            thisObj,
            currentClasses,
            i;

        bool = (typeof bool === "undefined") ? false : bool;

        for (i = 0; i < objCount; i += 1) {
            thisObj = (typeof theObj[i] === "undefined") ? theObj : theObj[i];

            currentClasses = (thisObj.className === "") ? [] : thisObj.className.split(" ");

            if (bool) {
                currentClasses.push(cl);
            } else if (!hasClass(thisObj, cl)) {
                currentClasses.push(cl);
            }

            thisObj.className = (currentClasses.length > 1) ? currentClasses.join(" ") : currentClasses[0];
        }
    }
    // Add Class [end]

    // Remove Class [begin]
    function removeClass(sl, cl) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            objCount = (theObj.length > 1) ? theObj.length : 1,
            currentClasses,
            classPosition,
            thisObj,
            i;

        for (i = 0; i < objCount; i += 1) {
            thisObj = (typeof theObj[i] === "undefined") ? theObj : theObj[i];

            if (hasClass(thisObj, cl)) {
                currentClasses = thisObj.className.split(" ");
                classPosition = currentClasses.indexOf(cl);

                if (classPosition !== -1) {
                    currentClasses.splice(classPosition, 1);
                    thisObj.className = (currentClasses.length > 1) ? currentClasses.join(" ") : currentClasses.join("");
                }
            }
        }
    }
    // Remove Class [end]

    // Show Error Message [begin]
    function showMessage(sl, idf, msg) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            identifier = (typeof idf === "object") ? idf.getAttribute("id") : idf,
            children = theObj.childNodes,
            status = 0,
            node,
            textnode,
            i;

        for (i = 0; i < children.length; i += 1) {
            if (children[i].getAttribute("data-identifier") === identifier) {
                status += 1;
            }
        }

        if (status === 0) {
            node = document.createElement("p");
            textnode = document.createTextNode(msg);

            node.appendChild(textnode);
            node.setAttribute("data-identifier", identifier);

            theObj.appendChild(node);
            addClass(theObj, "show");

            if (typeof idf === "object") {
                addClass(idf, "form-input-alert");
            }
        }
    }
    // Show Error Message [end]

    // Hide Error Message [begin]
    function hideMessage(sl, idf, rmcls, rmclsobj) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            children = theObj.childNodes,
            identifier = (typeof idf === "object") ? idf.getAttribute("id") : idf,
            i;

        rmcls = (typeof rmcls === "undefined") ? true : rmcls;

        if (hasClass(theObj, "show")) {

            for (i = 0; i < children.length; i += 1) {
                if (children[i].getAttribute("data-identifier") === identifier) {
                    theObj.removeChild(children[i]);

                    if (typeof idf === "object" && rmcls) {
                        removeClass(idf, "form-input-alert");
                    } else if (typeof rmclsobj === "object" && rmcls) {
                        removeClass(rmclsobj, "form-input-alert");
                    }
                }
            }

            if (theObj.childNodes.length < 1) {
                removeClass(theObj, "show");
            }
        }
    }
    // Hide Error Message [end]

    // Validate URL
    function validateURL(textval) {
        var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return urlregex.test(textval);
    }

    function htmlspecialchars(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    }

    // Serialize XML to String
    function serializeXmlNode(xmlNode) {
        try {
            return (new window.XMLSerializer()).serializeToString(xmlNode);
        } catch (err) {
            try {
                return htmlspecialchars(xmlNode.xml.toString());
            } catch (er) {
                return "";
            }
        }
    }

    // Load XML
    function loadXML(xmlf, sl) {
        var theObj = (typeof sl === "string") ? document.querySelector(sl) : sl,
            xmlhttp = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
            theHtml = document.createElement("div"),
            theItem,
            i;

        xmlhttp.open("GET", xmlf, false);
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;

        theItem = xmlDoc.getElementsByTagName("item");

        (function () {
            for (i = 0; i < theItem.length; i += 1) {
                var node = document.createElement("a"),
                    textnode = document.createTextNode(theItem[i].firstChild.nodeValue);

                node.appendChild(textnode);
                node.setAttribute("href", theItem[i].getAttribute("url"));
                theHtml.appendChild(node);
            }
        }());

        theObj.innerHTML = theHtml.innerHTML;
        xmlOutput.innerHTML = serializeXmlNode(xmlDoc);
    }

    window.onload = function () {
        loadXML("data.xml", alist);
    };

    // Bubble Event on A tag which are added dynamically [begin]
    alist.addEventListener("click", function (e) {
        var ilink = e.target,
            tag = ilink.tagName.toString().toLowerCase(),
            ilinkA = alist.getElementsByTagName("a"),
            i;

        if (tag === "a") {
            if (hasClass(ilink, "clicked")) {
                removeClass(ilinkA, "clicked");
                removeClass(modal, "show");
            } else {
                removeClass(ilinkA, "clicked");
                addClass(ilink, "clicked");
                modalText.innerHTML = "Do you want to open <strong>" + ilink.firstChild.nodeValue + "</strong> in new window?";
                btnYes.setAttribute("data-url", ilink.getAttribute("href"));
                btnNo.setAttribute("data-url", ilink.getAttribute("href"));
                addClass(modal, "show");

                clickedAIndex = Array.prototype.indexOf.call(ilink.parentNode.childNodes, ilink);
            }

            e.preventDefault();
        } else {
            return false;
        }
    });
    // Bubble Event on A tag which are added dynamically [end]

    // Form field event to add A tag [begin]
    addItem.addEventListener("click", function (e) {
        var theName = document.getElementById("theName"),
            theUrl = document.getElementById("theUrl"),
            node = document.createElement("a"),
            textnode = document.createTextNode(theName.value),
            nodeXml = document.createElement("item"),
            textnodeXml = document.createTextNode(theName.value),
            status = [false, false, false];

        // If Name not empty set text of new node else show/hide error
        if (theName.value !== "") {
            node.appendChild(textnode);
            nodeXml.appendChild(textnodeXml);

            hideMessage(errorBox, theName);

            status[0] = true;
        } else {
            showMessage(errorBox, theName, "Name cannot be empty");

            status[0] = false;
        }

        // if URL is empty show error else hide error
        if (theUrl.value !== "") {
            hideMessage(errorBox, theUrl, false);

            status[1] = true;
        } else {
            showMessage(errorBox, theUrl, "URL cannot be empty");

            status[1] = false;
        }

        // If URL is valide url then set href attribute of node else show/hide error
        if (validateURL(theUrl.value)) {
            node.setAttribute("href", theUrl.value);
            nodeXml.setAttribute("url", theUrl.value);

            hideMessage(errorBox, "valideURL", true, theUrl);

            status[2] = true;
        } else {
            showMessage(errorBox, "valideURL", "Enter a valid URL");

            status[2] = false;
        }

        if (status.indexOf(false) === -1) {
            theName.value = "";
            theUrl.value = "";
            alist.appendChild(node);
            xmlDoc.firstChild.appendChild(nodeXml);

            xmlOutput.innerHTML = serializeXmlNode(xmlDoc);
        }
    });
    // Form field event to add A tag [begin]

    // Yes Mobal Button
    btnYes.addEventListener("click", function (e) {
        e.stopPropagation();

        window.open(this.getAttribute("data-url"));

        e.preventDefault();
    });

    // No Modal Button
    btnNo.addEventListener("click", function (e) {
        e.stopPropagation();

        var ilinkA = alist.getElementsByTagName("a");

        removeClass(ilinkA, "clicked");
        removeClass(modal, "show");

        window.location.href = this.getAttribute("data-url");

        e.preventDefault();
    });

    //Remove Element
    removeSel.addEventListener("click", function (e) {
        e.stopPropagation();

        alist.removeChild(alist.childNodes[clickedAIndex]);
        xmlDoc.documentElement.removeChild(xmlDoc.getElementsByTagName("item")[clickedAIndex]);
        xmlOutput.innerHTML = serializeXmlNode(xmlDoc);
        removeClass(modal, "show");

        e.preventDefault();
    });
}());