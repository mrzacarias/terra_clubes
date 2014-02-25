//http://esportes.terra.com.br/rss/Controller?channelid=9e4d5f485f29a310VgnVCM5000009ccceb0aRCRD&ctName=atomo-noticia&lg=pt-br

var good_status = 2;

var teams = {
	"atletico-mg" : { id : 'a15a5c528898a310VgnVCM20000099cceb0aRCRD'},
	"atletico-pr" : { id : 'afe1c2779a39a310VgnVCM5000009ccceb0aRCRD'},
	"bahia" : { id : '0c7a5c511b98a310VgnVCM20000099cceb0aRCRD'},
	"botafogo" : { id : '00231566d998a310VgnVCM20000099cceb0aRCRD'},
	"corinthians" : { id : '006f2f079b98a310VgnVCM20000099cceb0aRCRD'},
	"coritiba" : { id : '7d3732dd9c29a310VgnVCM5000009ccceb0aRCRD'},
	"criciuma" : { id : 'c2a464ba4a39a310VgnVCM20000099cceb0aRCRD'},
	"cruzeiro" : { id : '38763c149d29a310VgnVCM5000009ccceb0aRCRD'},
	"flamengo" : { id : '3c3c17ea2b98a310VgnVCM20000099cceb0aRCRD'},
	"fluminense" : { id : 'ba4a93c47a98a310VgnVCM20000099cceb0aRCRD'},
	"goias" : { id : '1495e30dfa39a310VgnVCM20000099cceb0aRCRD'},
	"gremio" : { id : '9e4d5f485f29a310VgnVCM5000009ccceb0aRCRD'},
	"inter" : { id : '69fe1fc53b29a310VgnVCM5000009ccceb0aRCRD'},
	"nautico" : { id : 'b83d7e147de8a310VgnVCM4000009bcceb0aRCRD'},
	"ponte-preta" : { id : '5ab15745ba29a310VgnVCM5000009ccceb0aRCRD'},
	"portuguesa" : { id : '109ef419c039a310VgnVCM5000009ccceb0aRCRD'},
	"santos" : { id : '7c679e9aff29a310VgnVCM5000009ccceb0aRCRD'},
	"sao-paulo" : { id : '555dd69f2139a310VgnVCM5000009ccceb0aRCRD'},
	"vasco" : { id : '6c88e1db2939a310VgnVCM5000009ccceb0aRCRD'},
	"vitoria" : { id : '9680d4628d39a310VgnVCM20000099cceb0aRCRD'}
}

var news = {
	requestNews: function(channel) {
		var req = new XMLHttpRequest();
		
		req.open("GET", 'http://esportes.terra.com.br/rss/Controller?channelid=' + channel + '&ctName=atomo-noticia&lg=pt-br', true);
		req.onload = this.showNews.bind(this);
		req.send(null);
	},
	
	requestTicker: function() {
		var req = new XMLHttpRequest();

		req.open("GET", 'http://esportes.terra.com.br/contentAPI/get?prd=live_guadalajara&srv=getListTickerElements&navigation_code=esp-futb&country_code=br&contentType=xml&jsonp=false', true);
		req.onload = this.showLive.bind(this);
		req.send(null);
	},
	
	// Funcao chamada ao abrir a extensao e que tenta gerar o ticker para cada um dos grupos de eventos
	showLive: function (e) {
		var live = e.target.responseXML.querySelectorAll('GROUP');
		this.makeTickerSoccer(live, "esp-futb", "Futebol ao vivo");
	},
	
	makeTickerSoccer: function(live, channel, title) {
		// template para jogos de futebol
		var template_game = '\
			<li class="list_game">\
				<a href="{{_link}}" target="_new">\
					<p class="championship"><b>{{_match_status}}</b></p>\
					<div class="details">\
						<img src="{{_shield_home}}" alt="{{_team_home}}" width="24" height="24" class="ticker-shield">\
						<span class="result">{{_score_home}} x {{_score_away}}</span>\
						<img src="{{_shield_away}}" alt="{{_team_away}}" width="24" height="24" class="ticker-shield">\
					</div><br/>\
					<p class="status">{{_champ}}</p>\
				</a>\
			</li>\
		';
		
		//template para ticker
		var carousel_template = '<h4 class="ticker-title">' + title + ':</h4>\
		<ul id="ticker" class="ruler ' + channel + '">\
		</ul>\
		<span class="prev ' + channel + '">Anterior</span>\
		<span class="next ' + channel + '">Próximo</span>\
		<br/>';		
		
		//Removendo tudo que tem dentro do container do canal
		var main = document.getElementById('live-'+channel);
		main.innerHTML = '';
		
		// Variaveis de controle
		var loop = 0;
		var events = 0;
		var visible_events = 3;
		
		for (var i = 0; i < live.length; i++) {
			if (live[i].getElementsByTagName('TAG')[0].childNodes[0].nodeValue.indexOf(channel) != -1) {
				contents = live[i].getElementsByTagName('CONTENT')[0].childNodes;
				for (var j = 0; j < contents.length; j++) {
					if (contents[j].getElementsByTagName('STATUS')[0].childNodes[0].nodeValue == good_status) {
						try {
							var _team_home = contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[0].getElementsByTagName('NAME_PT')[0].childNodes[0].nodeValue
							$('#live-'+channel).append(carousel_template);
							loop = 1
							break;
						} catch(err) {}
					}
				}
				if (loop == 1) {break;}
			}
		}
		if (loop == 0) {$('#live-'+channel).append("<!-- Sem Eventos ao vivo para "+ channel + " no momento -->"); return} 
		
		for (var i = 0; i < live.length; i++) {
			if (live[i].getElementsByTagName('TAG')[0].childNodes[0].nodeValue.indexOf(channel) != -1) {
				contents = live[i].getElementsByTagName('CONTENT')[0].childNodes;
				for (var j = 0; j < contents.length; j++) {
					if (contents[j].getElementsByTagName('STATUS')[0].childNodes[0].nodeValue == good_status) {
						var tag = contents[j].getElementsByTagName('TAG')[0].childNodes[0].nodeValue;						
						var coverage = contents[j].getElementsByTagName('COVERAGE')[0].childNodes[0].nodeValue
						if (coverage.length > 30) { coverage = coverage.substring(0,30) + "..."	}
						var live_data = null;
						
						try
						{
							live_data = {
								_link : contents[j].getElementsByTagName('URL')[0].childNodes[0].nodeValue,
								_champ : coverage,
								_match_status : contents[j].getElementsByTagName('GAME_INFO')[0].getElementsByTagName('GAME_TIME')[0].getElementsByTagName('NAME_PT')[0].childNodes[0].nodeValue,						
								_team_home : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[0].getElementsByTagName('NAME_PT')[0].childNodes[0].nodeValue,
								_shield_home : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[0].getElementsByTagName('SHIELD')[0].childNodes[0].nodeValue,
								_score_home : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[0].getElementsByTagName('SCORE')[0].getElementsByTagName('GOALS')[0].childNodes[0].nodeValue,
								_team_away : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[1].getElementsByTagName('NAME_PT')[0].childNodes[0].nodeValue,
								_shield_away : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[1].getElementsByTagName('SHIELD')[0].childNodes[0].nodeValue,
								_score_away : contents[j].getElementsByTagName('TEAMS')[0].getElementsByTagName('TEAM')[1].getElementsByTagName('SCORE')[0].getElementsByTagName('GOALS')[0].childNodes[0].nodeValue
							}
							
							var html = Mustache.to_html(template_game, live_data);

							$(".ruler."+channel).append(html);
							events += 1;
						} catch(err) {}
					}
				}
			}
		}
		
		var h = 65;
		var w = 170;
		
		$(".ruler."+channel).simplecarousel({
			width:w,
			height: h,
			visible: visible_events,
			next: $('.next.'+channel),
			prev: $('.prev.'+channel)
		});
		
		if (events <= visible_events) {
			he = 108;
			$('.next.'+channel).remove();
			$('.prev.'+channel).remove();
			$('#live-'+channel).css("height", he);
			$('#live-'+channel).css("width", events*(w+5));
		}
	},

	showNews: function (e) {
		var news = e.target.responseXML.querySelectorAll('item');
		var main = document.getElementById('main');
		main.innerHTML = '';
		
		var template = '\
				<div class="news">\
					<a href="{{_link}}" target="_new">\
						<img alt="{{_title}}" src="{{_img_source}}" class="news_img"></img>\
						<div class="inner_news">\
							<span class="ttl-news">{{_title}}<br/></span>\
							<span class="ttl-desc">{{_desc}}</span>\
						</div>\
						<br/><span class="pubdate">{{_date}}</span>\
					</a>\
				</div>\
		';
		var regex = /(<([^>]+)>)/ig

		for (var i = 0; i < news.length; i++) {
			try { img_source = news[i].getElementsByTagName('thumbnail')[0].childNodes[0].nodeValue.replace("cf/66/66","cf/400/400");}
			catch(err) { img_source = 'icon128.png'; }

			// adjusting date
			date_time = news[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue
			var date = new Date(date_time);
			
			// adjusting description
			desc = news[i].getElementsByTagName('description')[0].childNodes[0].nodeValue.replace(regex, "")
			desc = desc.substring(0, 200) + "..."
			//s.substring(0, s.length - 4)
			
			n = {
				_title: news[i].getElementsByTagName("title")[0].childNodes[0].nodeValue,
				_desc: desc,
				_date : "Publicado em: " + date.toLocaleString("pt-BR"),
				_link: news[i].getElementsByTagName('link')[0].childNodes[0].nodeValue,
				_img_source: img_source
			}
			
			// teste save last article
			if (i == 0 && localStorage.teamId !== null) {
				localStorage.last_article = n._title;
			}
			
			var html = Mustache.to_html(template, n);
			$('#main').append(html);
		}
	}
};

// Comportamento de click
$('.shield').click(function(){
	var rel = $(this).attr('rel'), id  = teams[rel].id;
	localStorage.teamId = teams[rel].id;
	localStorage.teamRel = rel;

	news.requestNews(id);
	try
	{
		news.requestTicker();
	}
	catch(err) { }

	$('#championship-bra-a li a').parent().removeClass('selected-team');
	$('a[rel="' + rel + '"]').parent().addClass('selected-team');
});

// Comportamento de inicio de documento
$(document).ready(function(){
	try
	{
		news.requestTicker();
	}
	catch(err) { }
	
	if (localStorage.teamId !== null && localStorage.teamRel !== null) {
		news.requestNews(localStorage.teamId);
		$('a[rel="' + localStorage.teamRel + '"]').parent().addClass('selected-team');
	}
	
	chrome.browserAction.setBadgeText({text:""});
	
	$('.standings h4').remove();
});