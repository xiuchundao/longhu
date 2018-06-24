var XMLHttpREPORT = {
    _objPool: [], _getInstance: function () {
        for (var a = 0; a < this._objPool.length; a++) {
            if (this._objPool[a].readyState == 0 || this._objPool[a].readyState == 4) {
                return this._objPool[a]
            }
        }
        this._objPool[this._objPool.length] = this._createObj();
        return this._objPool[this._objPool.length - 1];
        return this._createObj()
    }, _createObj: function () {
        if (window.XMLHttpRequest) {
            var a = new XMLHttpRequest()
        } else {
            var a = new ActiveXObject("Microsoft.XMLHTTP")
        }
        if (a.readyState == null) {
            a.readyState = 0;
            a.addEventListener("load", function () {
                a.readyState = 4;
                if (typeof a.onreadystatechange == "function") {
                    a.onreadystatechange()
                }
            }, false)
        }
        return a
    }, sendReq: function (method, url, data, callback, onErrorMethod, params) {
        var objXMLHttp = this._getInstance();
        with (objXMLHttp) {
            try {
                if (url.indexOf("?") > 0) {
                    url += "&randnum=" + Math.random()
                } else {
                    url += "?randnum=" + Math.random()
                }
                open(method, url, true);
                setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
                send(data);
                onreadystatechange = function () {
                    if (objXMLHttp.readyState == 4) {
                        if (objXMLHttp.status == 200 || objXMLHttp.status == 304) {
                            callback(objXMLHttp, params)
                        } else {
                            if (onErrorMethod) {
                                onErrorMethod(objXMLHttp, params)
                            } else {
                            }
                        }
                    }
                }
            } catch (e) {
                alert(e)
            } finally {
            }
        }
    }
};

function autoRefreshReport(c, b, a) {
    if (a <= 0) {
        return
    }
    if (window.mAutoRefreshReports == null) {
        window.mAutoRefreshReports = new Object()
    }
    if (window.mAutoRefreshReports[c + "_" + b] == "true") {
        return
    }
    mAutoRefreshReports[c + "_" + b] = "true";
    var d = setInterval(function () {
        var g = document.getElementById("szseWebReport_pageinfo_" + c);
        if (g == null) {
            return
        }
        var f = g.getAttribute("url");
        if (f == null || f == "") {
            return
        }
        var e = g.getAttribute("tabkeys");
        if (e == null) {
            return
        }
        if (e.lastIndexOf(";") != e.length - 1) {
            e += ";"
        }
        if (e.indexOf(b + ";") >= 0) {
            refreshData(f)
        } else {
            window.mAutoRefreshReports[c + "_" + b] = null;
            clearInterval(d)
        }
    }, a * 1000)
}

function refreshData(d, b) {
    var e = d;
    var f = "";
    var a = d.indexOf("?");
    if (a > 0) {
        e = d.substring(0, a);
        f = d.substring(a + 1)
    }
    if (b == null || b == "") {
        var a = d.indexOf("?SOURCECATALOGID=");
        if (a < 0) {
            a = d.indexOf("&SOURCECATALOGID=")
        }
        if (a > 0) {
            b = d.substring(a + "&SOURCECATALOGID=".length);
            a = b.indexOf("&");
            if (a > 0) {
                b = b.substring(0, a)
            }
        }
        if (b == null || b == "") {
            a = d.indexOf("?CATALOGID=");
            if (a < 0) {
                a = d.indexOf("&CATALOGID=")
            }
            if (a > 0) {
                b = d.substring(a + "&CATALOGID=".length);
                a = b.indexOf("&");
                if (a > 0) {
                    b = b.substring(0, a)
                }
            }
        }
    }
    if (f.indexOf("%SOURCEURL%") > 0) {
        var g = document.getElementById("szseWebReport_pageinfo_" + b);
        if (g != null) {
            var c = g.getAttribute("url");
            if (c == null) {
                c = ""
            }
            c = c.replace(new RegExp(/&/g), "*_AND_*");
            c = c.replace(new RegExp(/\?/g), "*_QUESTION_*");
            c = c.replace(new RegExp(/ /g), "*_SPACE_*");
            f = f.replace(new RegExp(/%SOURCEURL%/g), "SOURCEURL=" + c)
        }
    }
    XMLHttpREPORT.sendReq("POST", e, f, callBack, onErrorMethod, b)
}

function callBack(xmlHttpObj, catalogid) {
    var ele = null;
    if (catalogid != null && catalogid != "") {
        ele = document.getElementById("REPORT_ID_" + catalogid)
    }
    if (ele == null) {
        ele = document.getElementById("REPORT_ID")
    }
    var mess = xmlHttpObj.responseText;
    if (ele != null) {
        ele.innerHTML = mess;
        var messSpanObj = document.getElementById("szseWebReport_pageinfo_" + catalogid);
        if (messSpanObj == null) {
            var idx = mess.indexOf('<span style="display:none" id="szseWebReport_pageinfo_');
            if (idx >= 0) {
                mess = mess.substring(idx + '<span style="display:none" id="szseWebReport_pageinfo_'.length);
                mess = mess.substring(0, mess.indexOf('"'));
                messSpanObj = document.getElementById("szseWebReport_pageinfo_" + mess)
            }
        }
        if (messSpanObj != null) {
            var onloadMethod = messSpanObj.getAttribute("onloadMethod");
            if (onloadMethod != null && onloadMethod != "") {
                eval(onloadMethod)
            }
        }
    }
}

function onErrorMethod(c, b) {
    var a = null;
    if (b != null && b != "") {
        a = document.getElementById("REPORT_ID_" + b)
    }
    if (a == null) {
        a = document.getElementById("REPORT_ID")
    }
    if (a) {
        a.innerHTML = "<strong>系统正忙，请稍后再试</strong>"
    }
}

function submitOnEnterKeyPress(d, b) {
    var a = -1;
    var c;
    if (window.event) {
        a = window.event.keyCode;
        c = window.event
    } else {
        a = d.which;
        c = d
    }
    if (a == 13) {
        doSubmitOnEnterKeyPress(c, b)
    }
}

function doSubmitOnEnterKeyPress(c, a) {
    var b = document.getElementById(a);
    if (b == null) {
        return
    }
    try {
        b.click()
    } catch (d) {
        b.onclick()
    }
    try {
        c.returnValue = false;
        if (c.preventDefault) {
            c.preventDefault()
        }
    } catch (d) {
    }
}

function doNavigateInputboxKeyDown(c, d) {
    var a = -1;
    var b;
    if (window.event) {
        a = window.event.keyCode;
        b = window.event
    } else {
        a = c.which;
        b = c
    }
    if ((a >= 37 && a <= 40) || (a >= 48 && a <= 57) || a == 8 || a == 46 || a == 13) {
        if (a == 13) {
            doSubmitOnEnterKeyPress(b, d)
        }
        return true
    }
    if (a >= 96 && a <= 105) {
        try {
            if (navigator.userAgent.toLowerCase().indexOf("opera") < 0) {
                return true
            }
        } catch (c) {
            return true
        }
    }
    return false
}

function gotoPageNo(a, b, f, d) {
    if (d <= 0) {
        return
    }
    var c = document.getElementById(f);
    if (c == null || c.value == null) {
        return
    }
    var e = parseInt(c.value, 10);
    if (e < 1) {
        e = 1
    }
    if (e > d) {
        e = d
    }
    refreshData(a + "&" + b + "=" + e)
}

function gotoReportPageNoByTextBox(d, a, g, c, f) {
    if (c <= 0) {
        return
    }
    var b = document.getElementById(g);
    if (b == null || b.value == null) {
        return
    }
    var e = parseInt(b.value, 10);
    if (e < 1) {
        e = 1
    }
    if (e > c) {
        e = c
    }
    gotoReportPageNo(d, a, e, c, f)
}

function gotoReportPageNo(d, b, f, c, e) {
    if (f > c || f < 1 || e < 1 || c < 2) {
        return
    }
    var a = getCatalogUrl(d);
    a = replaceUrlParamValue(a, b + "PAGENO", f, true);
    a = replaceUrlParamValue(a, b + "PAGECOUNT", c, true);
    a = replaceUrlParamValue(a, b + "RECORDCOUNT", e, true);
    a = replaceUrlParamValue(a, "REPORT_ACTION", "navigate", true);
    refreshData(a)
}

function doReportInputboxClick(d, g, b) {
    var c = document.getElementById(g + "_" + b + "_btn");
    var a = -1;
    if (window.event) {
        a = window.event.keyCode
    } else {
        a = d.which
    }
    if (a == 13 && c != null) {
        try {
            c.click()
        } catch (f) {
            c.onclick()
        }
        d.cancelBubble = true;
        d.returnValue = false
    }
}

function submitTextContent(b, a) {
    var f = document.getElementById("textfiledate_id");
    if (f == null) {
        alert("没有取到查询框对象，加载文本文件数据失败");
        return
    }
    var d = f.value;
    if (d == null || d == "") {
        d = f.getAttribute("defaultvalue")
    }
    if (d == null || d == "") {
        var c = document.getElementById("REPORT_ID");
        if (c) {
            c.innerHTML == "没有找到符合条件的文本"
        }
        return
    }
    if (!isDate(d)) {
        return
    }
    var e = d.split("-");
    e[0] = e[0].substring(2);
    if (e[1].length == 1) {
        e[1] = "0" + e[1]
    }
    if (e[2].length == 1) {
        e[2] = "0" + e[2]
    }
    showTextContent(b + a + e[0] + e[1] + e[2] + ".txt")
}

function showTextContent(a) {
    var b = document.getElementById("REPORT_ID");
    if (b) {
        b.innerHTML = "<span class='link1'>正在加载，请稍候...</span>"
    }
    XMLHttpREPORT.sendReq("Get", a, "", textCallBackMethod, onTextErrorMethod)
}

function textCallBackMethod(c) {
    var b = document.getElementById("REPORT_ID");
    if (b == null) {
        return
    }
    var a = c.responseText;
    if (a == null) {
        a = ""
    }
    if (a.indexOf("<html>") > 0 && a.indexOf("<head>") > 0 && a.indexOf("<title>") > 0) {
        b.innerHTML = "没有找到符合条件的文本"
    } else {
        b.innerHTML = "<pre>" + c.responseText + "</pre>"
    }
    window.status = ""
}

function onTextErrorMethod(b) {
    var a = document.getElementById("REPORT_ID");
    if (a) {
        a.innerHTML = "没有找到符合条件的文本"
    }
    window.status = ""
}

Array.prototype.max = function () {
    var b, a = this[0];
    for (b = 1; b < this.length; b++) {
        if (a < this[b]) {
            a = this[b]
        }
    }
    return a
};
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "")
};

function checkExp(b, a) {
    return b.test(a)
}

function isAlphaNumeric(a) {
    return checkExp(/^\w*$/gi, a)
}

function isDate(e) {
    if (isEmpty(e)) {
        return true
    }
    if (!checkExp(/^\d{4}-[01]?\d-[0-3]?\d$/, e)) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    var a = e.split("-");
    var c = a[0];
    var d = a[1];
    var b = a[2];
    if (c < 1900 || c > 2060) {
        alert("日期超出范围.");
        return false
    }
    if (!((1 <= d) && (12 >= d) && (31 >= b) && (1 <= b))) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    if (!((c % 4) == 0) && (d == 2) && (b == 29)) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    if ((d <= 7) && ((d % 2) == 0) && (b >= 31)) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    if ((d >= 8) && ((d % 2) == 1) && (b >= 31)) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    if ((d == 2) && (b >= 30)) {
        alert("请输入正确的日期格式，比如YYYY-MM-DD");
        return false
    }
    return true
}

function isShortDate(e) {
    var d = e;
    if (!checkExp(/^\d{4}-[01]?\d/, d)) {
        alert("请输入正确的日期格式，比如YYYY-MM");
        return false
    }
    var a = d.split("-");
    var b = a[0];
    var c = a[1];
    if (b < 1753) {
        alert("日期年份超出范围.");
        return false
    }
    if (a.length == 3) {
        alert("非法的日期格式，必须为yyyy-MM");
        return false
    }
    if (!((1 <= c) && (12 >= c))) {
        alert("月份不能小于1并且大于12");
        return false
    }
    return true
}

function isDate_en(e) {
    if (isEmpty(e)) {
        return true
    }
    if (!checkExp(/^\d{4}-[01]?\d-[0-3]?\d$/, e)) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    var a = e.split("-");
    var c = a[0];
    var d = a[1];
    var b = a[2];
    if (!((1 <= d) && (12 >= d) && (31 >= b) && (1 <= b))) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    if (!((c % 4) == 0) && (d == 2) && (b == 29)) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    if ((d <= 7) && ((d % 2) == 0) && (b >= 31)) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    if ((d >= 8) && ((d % 2) == 1) && (b >= 31)) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    if ((d == 2) && (b >= 30)) {
        alert("Input date: YYYY-MM-DD etc");
        return false
    }
    return true
}

function isEmail(b) {
    if (isEmpty(b)) {
        return true
    }
    var a = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return checkExp(a, b)
}

function isEmpty(a) {
    if (a == "") {
        return true
    } else {
        return false
    }
}

function isNumeric(a) {
    if (!checkExp(/^[+-]?\d+(\.\d+)?$/g, a)) {
        alert("请输入正确的数字");
        return false
    }
    return true
}

function isMoney(a) {
    if (isEmpty(a)) {
        return true
    }
    return checkExp(/^[+-]?\d+(,\d{3})*(\.\d+)?$/g, a)
}

function isPhone(a) {
    if (isEmpty(a)) {
        return true
    }
    return checkExp(/(^\(\d{3,5}\)\d{6,8}(-\d{2,8})?$)|(^\d+-\d+$)|(^(130|131|135|136|137|138|139)\d{8}$)/g, a)
}

function isPostalCode(a) {
    if (!checkExp(/(^$)|(^\d{6}$)/, a)) {
        alert("公司代码必须是六位的数字");
        return false
    }
    return true
}

function isURL(b) {
    if (isEmpty(b)) {
        return true
    }
    var a = /^(http|https|ftp):\/\/(\w+\.)+[a-z]{2,3}(\/\w+)*(\/\w+\.\w+)*(\?\w+=\w*(&\w+=\w*)*)*/gi;
    return checkExp(a, b)
}

function checkLength(c, a) {
    if (isEmpty(c)) {
        return true
    }
    if (a.charAt(0) != "L") {
        return false
    }
    var b = c.length;
    var d = parseInt(a.substr(2));
    switch (a.charAt(1)) {
        case"<":
            if (b >= d) {
                return false
            }
            break;
        case"=":
            if (b != d) {
                return false
            }
            break;
        case">":
            if (b <= d) {
                return false
            }
            break;
        default:
            return false
    }
    return true
}

function ValidateMaxLength(c, b, d) {
    var a = "";
    var f = document.all(c).value.trim();
    var e = "L<" + d;
    if (!checkLength(f, e)) {
        a = '"' + b + '" 必须小于' + d + "个字符\n"
    }
    return a
}

function ValidateMinLength(c, b, d) {
    var a = "";
    var f = document.all(c).value.trim();
    var e = "L>" + d;
    if (!checkLength(f, e)) {
        a = '"' + b + '" 必须大于' + (parseInt(d) + 1) + "个字符\n"
    }
    return a
}

function ValidateEquLength(c, b, d) {
    var a = "";
    var f = document.all(c).value.trim();
    var e = "L=" + d;
    if (!checkLength(f, e)) {
        a = '"' + b + '" 必须等于' + d + "个字符\n"
    }
    return a
}

function CheckValid(d, b, c) {
    var a = "";
    var e = d.value.trim();
    switch (c) {
        case"AlphaNumeric":
            if (!isAlphaNumeric(e)) {
                a = '"' + b + '" 必须是字母或数字！\n'
            }
            break;
        case"Date":
            if (!isDate(e)) {
                a = '"' + b + '" 必须具有正确的日期格式，如 2001-10-01\n'
            }
            break;
        case"Email":
            if (!isEmail(e)) {
                a = '"' + b + '" 必须具有正确的邮件格式，如 xx@yy.com\n'
            }
            break;
        case"NotEmpty":
            if (isEmpty(e)) {
                a = '"' + b + '" 不能为空！\n'
            }
            break;
        case"Numeric":
            if (!isNumeric(e)) {
                a = '"' + b + '" 必须是数字！\n'
            }
            break;
        case"Money":
            if (!isMoney(e)) {
                a = '"' + b + '" 必须具有正确的货币格式，如 -123,456.789\n'
            }
            break;
        case"Phone":
            if (!isPhone(e)) {
                a = '"' + b + '" 必须具有正确的电话格式，如 (0755)1234567-999\n'
            }
            break;
        case"PostalCode":
            if (!isPostalCode(e)) {
                a = '"' + b + '" 必须是6位数字！\n'
            }
            break;
        case"URL":
            if (!isURL(e)) {
                a = '"' + b + '" 必须是正确的URL格式！\n'
            }
            break;
        default:
            if (arrType[i].charAt(0) == "L") {
                if (!checkLength(e, arrType[i])) {
                    a = '"' + b + '" 的长度必须 ' + arrType[i].substr(1) + "\n"
                }
            } else {
                a = '错误："' + b + '" 的类型 "' + c + '" 不能识别！\n'
            }
    }
    if (a != "") {
        window.alert(a);
        d.focus()
    }
    return
}

function ValidateKernel(f, d, e) {
    var c = "";
    var a = e.split(" ");
    for (var b = 0; b < a.length; b++) {
        switch (a[b]) {
            case"AlphaNumeric":
                if (!isAlphaNumeric(f)) {
                    c = '"' + d + '" 必须是字母或数字！\n'
                }
                break;
            case"Date":
                if (!isDate(f)) {
                    c = '"' + d + '" 必须具有正确的日期格式，如 2001-10-1\n'
                }
                break;
            case"Email":
                if (!isEmail(f)) {
                    c = '"' + d + '" 必须具有正确的邮件格式，如 webmaster@yysoft.com\n'
                }
                break;
            case"NotEmpty":
                if (isEmpty(f)) {
                    c = '"' + d + '" 不能为空！\n'
                }
                break;
            case"Numeric":
                if (!isNumeric(f)) {
                    c = '"' + d + '" 必须是数字！\n'
                }
                break;
            case"Money":
                if (!isMoney(f)) {
                    c = '"' + d + '" 必须具有正确的货币格式，如 -123,456.789\n'
                }
                break;
            case"Phone":
                if (!isPhone(f)) {
                    c = '"' + d + '" 必须具有正确的电话格式，如 (0755)1234567-999\n'
                }
                break;
            case"PostalCode":
                if (!isPostalCode(f)) {
                    c = '"' + d + '" 必须是6位数字！\n'
                }
                break;
            case"URL":
                if (!isURL(f)) {
                    c = '"' + d + '" 必须是正确的URL格式！\n'
                }
                break;
            default:
                if (a[b].charAt(0) == "L") {
                    if (!checkLength(f, a[b])) {
                        c = '"' + d + '" 的长度必须 ' + a[b].substr(1) + "\n"
                    }
                } else {
                    c = '错误："' + d + '" 的类型 "' + e + '" 不能识别！\n'
                }
        }
    }
    return c
}

function Validate(c, b, d) {
    var a = "";
    var e = document.all(c).value.trim();
    a = ValidateKernel(e, b, d);
    return a
}

function ValidateFld(a, c, d) {
    var b = "";
    var e = a;
    b = ValidateKernel(e, c, d);
    return b
}

function checkExp(b, a) {
    return b.test(a)
}

function isEmpty(a) {
    if (a == "") {
        return true
    } else {
        return false
    }
}

function isNumeric(a) {
    if (isEmpty(a)) {
        return true
    }
    if (!checkExp(/^[+-]?\d+(\.\d+)?$/g, a)) {
        alert("请输入正确的数字");
        return false
    }
    return true
}

function isPostalCode(a) {
    if (isEmpty(a)) {
        return true
    }
    if (!checkExp(/(^$)|(^\d{6}$)/, a)) {
        alert("公司代码必须是六位的数字");
        return false
    }
    return true
}

function getUrlParamValue(d, b) {
    if (d == null || d == "" || b == null || b == "") {
        return null
    }
    var a = d.indexOf("?" + b + "=");
    if (a < 0) {
        a = d.indexOf("&" + b + "=")
    }
    if (a < 0) {
        return null
    }
    var c = d.substring(a + ("&" + b + "=").length);
    a = c.indexOf("&");
    if (a >= 0) {
        c = c.substring(0, a)
    }
    return c
}

function addParamToUrl(d, b, c) {
    if (d == null || d == "" || b == null || b == "") {
        return d
    }
    var a = d.indexOf("?" + b + "=");
    if (a < 0) {
        a = d.indexOf("&" + b + "=")
    }
    if (a >= 0) {
        var f = d.substring(0, a);
        d = d.substring(a + ("&" + b + "=").length);
        var e = f;
        a = d.indexOf("&");
        if (a >= 0) {
            d = d.substring(a + 1);
            if (d != null && d != "" && d != " ") {
                if (f.indexOf("?") < 0) {
                    e = f + "?" + d
                } else {
                    e = f + "&" + d
                }
            }
        }
        d = e
    }
    if (c != null) {
        if (d.indexOf("?") < 0) {
            d += "?" + b + "=" + c
        } else {
            d += "&" + b + "=" + c
        }
    }
    return d
}

function getTextBoxValue(a) {
    var b = document.getElementById(a);
    if (b == null) {
        return ""
    }
    return b.value
}

function getSelectBoxValue(a) {
    var b = document.getElementById(a);
    if (b == null || b.options.length == 0) {
        return ""
    }
    return b.options[b.options.selectedIndex].value
}

function getCheckBoxValue(a, e) {
    var d = document.getElementsByName(a);
    if (d == null || d.length == 0) {
        return ""
    }
    if (e == null || e == "") {
        e = ","
    }
    var c = "";
    for (var b = 0; b < d.length; b++) {
        if (d[b].checked == true) {
            c += d[b].value + e
        }
    }
    if (c.endsWith(e)) {
        c = c.subString(0, c.lenth - e.length)
    }
    return c
}

function getRadioBoxValue(b) {
    var a = document.getElementsByName(b);
    if (a == null || a.length == 0) {
        return ""
    }
    for (var c = 0; c < a.length; c++) {
        if (a[c].checked == true) {
            return a[c].value
        }
    }
    return ""
}

function getLabelSelectValue(b) {
    var c = document.getElementById(b);
    if (c == null) {
        return ""
    }
    var d = c.getElementsByTagName("SPAN");
    if (d == null || d.length == 0) {
        return ""
    }
    for (var a = 0; a < d.length; a++) {
        if (d[a].className == "cls-labelselectbox-selected") {
            return d[a].getAttribute("value")
        }
    }
}

function changeLabelSelectBoxStyle(b) {
    var c = b.parentNode.getElementsByTagName("SPAN");
    for (var a = 0; a < c.length; a++) {
        c[a].className = "cls-labelselectbox-deselected"
    }
    b.className = "cls-labelselectbox-selected"
}

function replaceUrlParamValue(d, a, c, b) {
    if (d == null || d == "") {
        return d
    }
    if (a == null || a == "") {
        return d
    }
    d = removeSubStr(d, "?" + a + "=", "&", "?");
    d = removeSubStr(d, "&" + a + "=", "&", "&");
    if (c != null) {
        if (d.indexOf("?") > 0) {
            d = d + "&"
        } else {
            d = d + "?"
        }
        if (b !== true) {
            c = encodeURIComponent(c)
        }
        d = d + a + "=" + c
    }
    return d
}

function getParamValueFromUrl(c, a) {
    if (c == null || c == "") {
        return ""
    }
    if (a == null || a == "") {
        return ""
    }
    var b = getSubStrValue(c, "?" + a + "=", "&");
    if (b == "") {
        b = getSubStrValue(c, "&" + a + "=", "&")
    }
    return b
}

function getSubStrValue(e, d, c) {
    if (e == null || e == "" || d == null || d == "" || c == null || c == "") {
        return ""
    }
    var b = e.indexOf(d);
    if (b < 0) {
        return ""
    }
    var a = e.substring(b + d.length);
    b = a.indexOf(c);
    if (b >= 0) {
        a = a.substring(0, b)
    }
    return a
}

function getCatalogUrl(b) {
    var c = document.getElementById("szseWebReport_pageinfo_" + b);
    if (c == null) {
        return ""
    }
    var a = c.getAttribute("url");
    if (a == null) {
        a = ""
    }
    return a
}

function removeNavigateInfo(d, b) {
    if (b == null || b == "" || d == null || d == "") {
        return d
    }
    var a = b.indexOf(",");
    while (a > 0) {
        var c = b.substring(0, a);
        d = doRemoveNavigateInfo(d, c);
        b = b.substring(a + 1);
        a = b.indexOf(",")
    }
    if (b != null && b != "") {
        d = doRemoveNavigateInfo(d, b)
    }
    return d
}

function doRemoveNavigateInfo(b, a) {
    b = removeSubStr(b, "&" + a + "PAGENO=", "&", "&");
    b = removeSubStr(b, "&" + a + "PAGECOUNT=", "&", "&");
    b = removeSubStr(b, "&" + a + "RECORDCOUNT=", "&", "&");
    return b
}

function removeSubStr(g, f, e, d) {
    if (g == null || g == "" || f == null || f == "" || e == null || e == "") {
        return g
    }
    if (d == null) {
        d = ""
    }
    var b = g.indexOf(f);
    while (b >= 0) {
        var c = g.substring(0, b);
        g = g.substring(b + f.length);
        b = g.indexOf(e);
        if (b < 0) {
            g = c;
            break
        }
        var a = g.substring(b + e.length);
        if (a == "") {
            g = c;
            break
        }
        g = c + d + a;
        b = g.indexOf(f)
    }
    return g
}

function switchTabItem(c, a) {
    var b = getCatalogUrl(c);
    b = replaceUrlParamValue(b, "TABKEY", a, true);
    refreshData(b)
};