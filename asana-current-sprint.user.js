// ==UserScript==
// @name         Asana Current (month's) Sprint Quick-Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  wow asana should really have this feature already
// @author       Lucas Estienne
// @grant        none
// @match        https://app.asana.com/*
// @run-at       document-end
// ==/UserScript==

var new_sb_section = (function() {
    'use strict';

    var asana_team_id = "477007513906053"; // Dyspatch team (contains sprints)
    var squad = "SSC";
    var projects_api_url = "https://app.asana.com/api/1.0/teams/" +asana_team_id+ "/projects"

    var today = new Date()

    function httpGet(url)
    {
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open( "GET", url, false );
        req.send( null );
        return JSON.parse(req.responseText);
    }

    var sprint_identifiers = [
        String(today.getFullYear()),
        squad,
        today.toLocaleString('default', { month: 'long' }).substring(0,3)
    ]

    var projects = httpGet(projects_api_url);

    var squad_projects = projects["data"].filter(function (el) {
        return sprint_identifiers.every(si => el.name.includes(si));
    })



    var new_sb_section = document.createElement('div');
    new_sb_section.setAttribute("class", "SidebarCollapsibleSection--isExpanded SidebarCollapsibleSection SidebarTopNavLinks")

    for (var el of squad_projects){
        var pa = document.createElement('a')
        pa.setAttribute("class", "SidebarItemRow BaseLink")
        pa.setAttribute("href", "https://app.asana.com/0/"+ el.gid +"/list")

        var pn = document.createElement('div')
        pn.setAttribute("class", "SidebarItemRow-name")
        pn.setAttribute("title", el.name)
        pn.innerHTML = el.name

        pa.appendChild(pn)
        new_sb_section.appendChild(pa)
    }
    return new_sb_section
})();

while(!document.querySelector(".CustomScrollbarScrollable-content")) {
    await new Promise(r => setTimeout(r, 500));
}

var sidebar = document.querySelector(".CustomScrollbarScrollable-content")
sidebar.insertBefore(new_sb_section, sidebar.firstChild);