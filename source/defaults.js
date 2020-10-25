/* jshint esversion:6 */

var names = [
// https://github.com/t-davidson/hate-speech-and-offensive-language
'Tarrant, Brenton Harrison', 'Lahouaiej-Bouhlel, Mohamed Salmene', 'Breivik, Anders Behring', 'Mateen, Omar Mir Seddique', 'Masharipov, Abdulkadir', 'Yacoubi, Seifeddine Rezgui',
'Ibragimov, Ahmed', 'Farooq, Ashraf Ali Mohammed', 'Morral Roca, Mateu', 'Goldstein, Baruch Kappel', 'Abbas al-Baqir Abbas', 'Fieschi, Giuseppe Marco', 'Kurbanjan Hemit', 'Abdurahman Azat',
'Farook, Syed Rizwan', 'Malik, Tashfeen', 'Lardanchet, Jean-Pierre', 'Friedli, André', 'Amri, Anis Ben Othman', 'Kouachi, Saïd', 'Kouachi, Chérif', 'Bowers, Robert Gregory',
'Kulikbayev, Ruslan Alpysbayuly', 'Tha\'ir Kayid Hamad', 'Sarkissian, Zohra', 'Zhou Lanpu', 'Essex, Mark James Robert', 'Roof, Dylann Storm', 'Strydom, Barend Hendrik', 'Punchi Banda Kandegedera',
'Wang Xiwen', 'Popper, Ami', 'Merah, Mohammed', 'Smith, Roland James', 'Kariyev, Maksat Kokshkinbaevich', 'Omar Rub', 'Yousef Rub', 'Abdul Salaam Sadek Hassouneh', 'Ferguson, Colin', 'Bissonnette, Alexandre',
'Melod Najah', 'Uday Abu Jamal', 'Ghassan Muhammad Abu Jamal', 'Page, Wade Michael', 'Shadi Sa\'id as-Su’ayida', 'Da\'oud al-Haj', 'Tsarnaev, Dzhokhar Anzorovich', 'Tsarnaev, Tamerlan Anzorovich', 'Talal Khantourah',
'Masood, Khalid', 'Ansari, Aftab', 'Nasir, Jamiluddin', 'Ahmed Jassim Ibrahim', 'Coulibaly, Amedy', 'Johnson, Micah Xavier', 'Chekatt, Chérif', 'Shuja al-Dosari', 'Elosegi, José Javier Zabaleta', 'Irujo, Juan María Tapia', 'Lakdim, Redouane',
'Natan-Zada, Eden', 'Nel, Johan', 'Khalid al-Mahmara', 'Muhammad Ahmad Moussa Mahmara', 'Stone, Michael', 'Ibrahim Mohammed Hasuna', 'Lortie, Denis', 'Ibrahim al-Akri', 'Dear, Robert Lewis', 'Marwen Hasan', 'Hesham Mohammed Rajeh', 'Raed Muhammed al-Rifi', 'Hatem Shweikeh',
'Princip, Gavrilo', 'Čabrinović, Nedeljko', 'Saeed Ibrahim Ramadan', 'Smith, Benjamin Nathaniel',
//
'allah, akbar', 'allahu, akbar', 'blacks', 'chink', 'chinks', 'dykes', 'faggot', 'faggots', 'fags', 'homo', 'inbred', 'nigger', 'niggers', 'queers', 'raped', 'savages', 'slave', 'spic', 'wetback', 'wetbacks', 'whites', 'nigger', 'all niggers',
'all white', 'ass white', 'beat', 'him', 'biggest',  'faggot', 'butt ugly', 'chink', 'chink eyed', 'chinks in', 'coon shit', 'dumb monkey', 'dumb nigger',  'nigger', 'fag and', 'fag but', 'faggot', 'faggot and', 'faggot ass', 'faggot bitch', 'faggot for',
'faggot smh', 'faggot that', 'faggots and', 'faggots like', 'faggots usually', 'faggots who',  'faggots', 'fags are', 'fuckin faggot', 'fucking faggot', 'fucking gay', 'fucking hate', 'fucking nigger', 'fucking queer', 'gay ass', 'get raped', 'hate all', 'hate faggots',
'hate fat', 'hate you', 'here faggot', 'is white', 'jungle bunny', 'kill all', 'kill yourself', 'little, faggot', 'many niggers', 'me faggot', 'my coon', 'nigga ask',  'nigga', 'niggas like', 'nigger ass', 'nigger is', 'nigger music', 'niggers are', 'of fags',
'of white', 'raped and', 'raped by', 'sand nigger', 'savages that', 'shorty bitch', 'spear chucker', 'spic cop', 'stupid nigger', 'that fag', 'that faggot', 'that nigger', 'the faggots', 'the female', 'the niggers', 'their heads', 'them white', 'then faggot',
'this nigger', 'to rape', 'trailer park', 'trash with', 'u fuckin', 'ugly dyke', 'up nigger', 'white ass', 'white boy', 'white person', 'white trash', 'with niggas', 'you fag', 'you nigger', 'you niggers', 'your faggot', 'your nigger', 'a bitch made', 'a fag and', 'a fag but',
'a faggot and', 'a faggot for', 'a fucking queer', 'a nigga ask', 'a white person', 'a white trash', 'all these fucking', 'are all white', 'be killed for', 'bitch made nigga', 'faggots like you', 'faggots usually have', 'fuck outta here', 'fuck u talking', 'fuck you too',
'fucking hate you', 'full of white', 'him a nigga', 'his shorty bitch', 'how many niggers', 'is a fag', 'is a faggot', 'is a fuckin', 'is a fucking', 'is a nigger', 'like a faggot', 'like da colored', 'many niggers are', 'nigga and his', 'niggers are in', 'of white trash',
'shut up nigger', 'still a faggot', 'the biggest faggot', 'the faggots who', 'the fuck do', 'they all look', 'what a fag', 'white bitch in', 'white trash and', 'you a fag', 'you a lame', 'you a nigger', 'you fuck wit', 'you fucking faggot', 'your a cunt', 'your a dirty', 'your bitch in',
'a bitch made nigga', 'a lame nigga you', 'faggot if you ever', 'full of white trash', 'how many niggers are', 'is full of white', 'lame nigga you a', 'many niggers are in', 'nigga you a lame', 'niggers are in my', 'wit a lame nigga', 'you a lame bitch', 'you fuck wit a'
];



var make_default_config = function(namelist) {
    var o = {
	    run_info: {
		    count: 5,
		    startTimeout: 1000,
		    timeMultiplier: 1.8,
		    maxTimeout: 12000
	    },
        match_style: "background-color: black; color: black",
        replacement: 'XXXXXXXX',
        actions: {},
    };

    namelist.forEach((name) => {
        var bycomma = name.split(/,\s/), byspace;
        var sur = null; 
        var therest = [];
        if (bycomma.length == 2) {
            sur = bycomma[0];
            therest = bycomma[1].split(' ');
        } else {
            byspace = name.split(' ');
            sur = byspace.slice(-1)[0];
            therest = byspace.slice(0,-1);
        }


        var first = null;
        var middles = [];
        if (therest.length > 1) {
            first = therest[0];
            middles = therest.slice(1);
        } else if (therest.length) {
            first = therest[0];
            middles = [];
        }

        var re_chunks = [];
        var img_re_chunks = [];

        if (false) {
            console.log('first',first);
            console.log('middles',middles);
            console.log('sur',sur);
            console.log('therest',therest);
            console.log('----');
        }

        if (first) {
            re_chunks.push(["((",first,')\\s)'].join(''));
            img_re_chunks.push(['(',first,'\\s)?'].join(''));
        }
        if (middles.length) {
            middles.forEach((middle) => {
                re_chunks.push(["((",middle,')\\s)?'].join(''));
                img_re_chunks.push(['(',middle,')\\s)?'].join(''));
            });
        }
        if (sur) {
            re_chunks.push(["(",sur,')(?!\\w)'].join(''));
            img_re_chunks.push(['(',sur,')(?!\\w)'].join(''));
        }

        var action = {
            default_enabled: true,
            find_regex: [re_chunks.join(''), 'gi'],
            img_find_regex: [img_re_chunks.join(''), 'gi'],
        };
        o.actions[sur] = action;
    });
    
    return o;
};

export var default_config = make_default_config(names);

// console.log(JSON.stringify(default_config,null,2));

export var defaults = {
    // classname for all insult styles
    insult_classname: 'blackedout',

    // run on any page or just whitelist
    site_filter: 'use_blacklist',

    // use the mutation approach or timer approach
    track_mutations: false,

    // should we try to replace images?
    replace_images: false,
    //
    // some pages never to run on
    user_blacklist: "mail.google.com mail.yahoo.com",

    // some pages to run on
    user_whitelist: [
	    "www.foxnews.com", "cnn.com", "www.bbc.com/news",
	    "www.bbc.co.uk/news", "www.theguardian.com",
	    "www.theguardian.co.uk", "nytimes.com", "facebook.com",
	    "washingtonpost.com", "salon.com", "slate.com", "buzzfeed.com",
	    "vox.com", "huffingtonpost.com", "wsj.com", "economist.com",
	    "latimes.com", "dallasnews.com", "usatoday.com", "denverpost.com",
	    "insidedenver.com", "philly.com", "chron.com", "detroitnews.com",
	    "freep.com", "boston.com", "newsday.com", "startribune.com",
	    "nypost.com", "ajc.com", "nj.com", "sfgate.com",
	    "sfchronicle.com", "azcentral.com", "chicagotribune.com",
	    "cleveland.com", "oregonlive.com", "tampatribune.com",
	    "signonsandiego.com", "mercurynews.com", "contracostatimes.com",
	    "insidebayarea.com", "feedly.com", "reddit.com",
	    "drudgereport.com", "theblaze.com", "breitbart.com","ijreview.com",
	    "newsmax.com", "wnd.com", "dailycaller.com", "washingtontimes.com",
	    "nationalreview.com", "townhall.com", "freerepublic.com",
	    "pjmedia.com", "hotair.com", "cnsnews.com",
	    "westernjournalism.com", "washingtonexaminer.com", "tpnn.com",
	    "newsbusters.org", "twitchy.com", "news.google.com",
	    "npr.org", "cnbc.com", "reuters.com", "tvnz.co.nz",
        "nzherald.co.nz", "press.co.nz", "stuff.co.nz"
    ].join(' '),
};
