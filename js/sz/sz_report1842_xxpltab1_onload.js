function init() {
    var a = document.getElementById("idtxtDMorJC");
    if (a) {
        var b = window.location.href.split("?");
        if (b.length == 2) {
            var c = b[1].split("=");
            if (c.length == 2) {
                a.value = c[1]
            }
            refreshData("/szseWeb/FrontController.szse?ACTIONID=7&AJAX=AJAX-TRUE&CATALOGID=1842_xxpl&TABKEY=tab1&txtDMorJC=" + c[1])
        }
    }
};