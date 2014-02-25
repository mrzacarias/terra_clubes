var count = 0;

window.setInterval(function(){
	var views = chrome.extension.getViews({ type: "popup" });
	
	if (views.length == 0) { 
		try {
			if (localStorage.last_article !== null && localStorage.teamId !== null) {
				count = 0;
				news.requestNewsBG(localStorage.teamId);
			} else {
				chrome.browserAction.setBadgeText({text:""});
			}
		} catch(err) {
			chrome.browserAction.setBadgeText({text:""});
		}
	}
}, 60000);

var news = {
	requestNewsBG: function(channel) {
		var req = new XMLHttpRequest();
		
		req.open("GET", 'http://esportes.terra.com.br/rss/Controller?channelid=' + channel + '&ctName=atomo-noticia&lg=pt-br', true);
		req.onload = this.showNewsBG.bind(this);
		req.send(null);
	},

	showNewsBG: function (e) {
		var news = e.target.responseXML.querySelectorAll('item');
		for (var i = 0; i < news.length; i++) {
			_title = news[i].getElementsByTagName("title")[0].childNodes[0].nodeValue
			title = localStorage.last_article;
			
			if (title == _title) { break; }
			
			count += 1;
		}
		if (count !== 0) {
			chrome.browserAction.setBadgeText({text:count.toString()});
			chrome.browserAction.setBadgeBackgroundColor({color:"#FF9900"});
		}
		else { chrome.browserAction.setBadgeText({text:""}); }
	}
};
	
	