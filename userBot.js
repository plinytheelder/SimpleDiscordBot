const Discord=require('discord.js');
const bot=new Discord.Client();
const config=require('./files/config.json');
const sql = require("sqlite");
sql.open("./files/dataBase.sqlite");

bot.on('ready', () => {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(timeStampSys+'-- DISCORD HELPBOT [USERS] IS READY --');console.log(console.error);
});



// ##########################################################################
// ############################## TEXT MESSAGE ##############################
// ##########################################################################
bot.on('message', message => {
	
	// STOP SCRIPT IF TEXT IS PRIVATE MESSAGE
	if(message.channel.type=="dm"){ return }
	
	// 
	// UNOWN DETECTION
	//
	if(message.channel.id=="CHANNEL-TO-SCAN") { // Unown
		
		let etitle = message.embeds[0].title;
			etitle = etitle.split(" ");
		let eurl = message.embeds[0].url;
		let edescription = message.embeds[0].description; edescription=edescription.slice(0, -27);
		let eimg = message.embeds[0].thumbnail.url;
		
		let txt="Hey @everyone quick! \nA wild **Unown** has just __spawned__! <(^.^<)\n"
			+"**Letter**: "+ etitle[2] +"\n" + edescription + "\n**GoogleMaps**: " + eurl;
		bot.channels.get(config.mainChannelID).send(txt).catch(console.error); // SPM+
	}
	
	
	// MAKE SURE ITS A COMMAND
	if(!message.content.startsWith(config.cmdPrefix)) { return }
	
	// COMMON VARIABLES
	let g=message.guild; let c=message.channel; let m=message.member; let msg=message.content; let cmds="";
	let mentioned=""; if(message.mentions.users.first()){mentioned=message.mentions.users.first();}
	
	// GET ROLES FROM CONFIG
	let AdminR=g.roles.find("name", config.adminRoleName);
	let ModR=g.roles.find("name", config.modRoleName);
	
	// REMOVE LETTER CASE (MAKE ALL LOWERCASE)
	let command=msg.toLowerCase(); command=command.split(" ")[0]; command=command.slice(config.cmdPrefix.length);
	
	// GET ARGUMENTS
	let args=msg.split(" ").slice(1);
	
		
		
// ######################### COMMANDS #############################
	if(command==="commands" || command==="help") {
		if(args[0]==="mods") {
			if(m.roles.has(ModR.id) || m.roles.has(AdminR.id)) {
				cmds="--- ** COMMANDS FOR MODS ** ---\n"
					+"`!info server`   \\\u00BB   to display server's info\n"
					+"`!info @mention`   \\\u00BB   to display user's info\n"
					+"`!roles`   \\\u00BB   ROLES multiple options\n"
					+"`!role @mention <ROLE-NAME>`   \\\u00BB   to assign roles\n"
					+"`!temprole`   \\\u00BB   ROLES multiple options\n"
					+"`!temprole <ROLE-NAME> @mention <DAYS>`   \\\u00BB   to assign temporary roles\n"
					+"`!warn @mention REASON`   \\\u00BB   for custom reasons\n"
					+"`!mute @mention REASON`   \\\u00BB   to mute an user\n"
					+"`!unmute @mention`   \\\u00BB   to unmute an user\n"
					+"`!kick @mention REASON`   \\\u00BB   to kick an user\n"
					+"`!ban @mention REASON`   \\\u00BB   to ban an user";
				return c.send(cmds).catch(console.error);
			}
			else {
				return message.reply("you are **NOT** allowed to use this command! \ntry using: `!commads` or `!commands devs`").catch(console.error); 
			}
		}
		if(c.id!==config.botsupportChannelID){
			return message.reply("this command can only be used at: <#"+config.botsupportChannelID+">");
		}
		if(!args[0]) { 
			cmds="";
			if(config.mapMain.enabled==="yes"){ cmds+="`!map`   \\\u00BB   a link to our **Live Web Map** [much cooler]\n" }
			if(config.mapRaids.enabled==="yes"){ cmds+="`!raids`   \\\u00BB   a link to our **Raids Web Map** [with RSVP]\n" }
			cmds+="`!invite`   \\\u00BB   for our **invite** link and code\n";
			if(config.patreon.enabled==="yes"){ cmds+="`!subscribe`/`!patreon`   \\\u00BB   for a link to our **Patreon** [to subscribe]\n" }
			if(config.paypal.enabled==="yes"){ cmds+="`!donate`/`!paypal`   \\\u00BB   for a link to our **PayPal** [to show extra support]\n" }
			if(config.mapHoods.enabled==="yes"){ cmds+="`!hoods`   \\\u00BB   for a map with **Neighborhoods**\n" }
			if(config.mapCoverage.enabled==="yes"){ cmds+="`!coverage`   \\\u00BB   for a map of our **coverage/zones**\n" }
			if(config.mapCoverage.enabled==="yes"){ cmds+="`!willowhelp`   \\\u00BB   for help setting up Willow notifications\n" }
			if(config.mapCoverage.enabled==="yes"){ cmds+="`!pvphelp`   \\\u00BB   for help setting up PvP notifications\n" };
		}
		return c.send(cmds).catch(console.error);
	}
	
	
	
// ######################### RULES #############################
	if(command==="rules") {
		message.delete();
		if(!mentioned) {
			return c.send("Please __READ__ our **RULES** at \\\u00BB <#"+config.rulesChannelID+">").catch(console.error);
		} 
		else {
			return c.send("Hey "+mentioned+", Please __READ__ the **RULES** at \\\u00BB <#"+config.rulesChannelID+"> in order to avoid **MUTE** <(^.^<)").catch(console.error);
		}
	}
	
	
	
// ######################### SUBSCRIPTION #############################
	if(command==="patreon" || command==="subscribe") {
		if(config.patreon.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to Subscribe \u00AB\u00AB',
				'url': config.patreon.url,
				'description': ':beers: Thank you :beers:\nYour support is greatly appreciated'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	}
	
	if(command==="patreonrewards" || command==="rewards") {
		if(config.patreon.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to Link Your Account \u00AB\u00AB',
				'url': config.patreonrewards.url,
				'description': ':beers: Thank you for your support via Patreon :beers:\nBe sure to link your account so you can get started!'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	}	
	
// ######################### DONATE #############################
	if(command==="paypal" || command==="donate") {
		if(config.paypal.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to Donate \u00AB \u00AB',
				'url': config.paypal.url,
				'description': ':beers: Thank you :beers:\nYour support is greatly appreciated'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	}
	
	
	
// ######################### SERVER STATUS #############################
	if(command==="ptc") {
		return c.send("PokemonTrainerClub Server Status: http://cmmcd.com/PokemonTrainerClub/ ").catch(console.error);
	}
	
// ######################### OTHER LINKS #############################
	if(command==="map") {
		if(config.mapMain.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to See \u00AB \u00AB',
				'url': config.mapMain.url,
				'description': ':map: Click above to see our webmap :map:\nType `!subscribe` to gain access'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	}        
    	if(command==="raids" || command==="raidmap" || command==="raid") {
		if(config.mapRaids.enabled==="yes"){
			return c.send("Our official **raids webmap**: \n"+config.mapRaids.url).catch(console.error);
		}
	}
	if(command==="coverage") {
		if(config.mapCoverage.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to See \u00AB \u00AB',
				'url': config.mapCoverage.url,
				'description': ':map: Click above to see our **Coverage** :map:'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	} 
    	if(command==="zones") {
		if(config.mapZones.enabled==="yes"){
			return c.send("Map of the **Zones** and Servers: \n "+config.mapZones.url+" \n"
				+"...and for Coverage map: `!coverage`").catch(console.error);
		}
	}
	if(command==="hoods") {
		if(config.mapHoods.enabled==="yes"){
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Click HERE to See \u00AB \u00AB',
				'url': config.mapHoods.url,
				'description': ':map: Click to see our **Neighborhoods** :map:'
			};
			return c.send({embed: embedMSG}).catch(console.error);
		}
	}
	if(command==="invite") {
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Invite Link \u00AB\u00AB',
				'description': ':iphone: [Share me with friends](https://discord.gg/q3vSWc8) :iphone:'
			};
			return c.send({embed: embedMSG}).catch(console.error);
	}
	if(command==="slack") {
			let embedMSG={
				'color': 0xFF0000,
				'title': '\u00BB\u00BB Slack Info \u00AB\u00AB',
				'description': ':iphone: [Share me with friends](https://valleypogo.com/slack/) :iphone:'
			};
			return c.send({embed: embedMSG}).catch(console.error);
	}	
	if(command==="restart"){
		if(m.id===config.ownerID){
			if(args[0]==="user"){
				message.reply("Restarting **User** (`userBot.js`) branch... please wait `5` to `10` seconds").then(()=>{ process.exit(1) }).catch(console.error);
			}
		}
	}

// ######################### WILLOW COMMANDS #############################
	if(command==="monhelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR MON ** ---\n"
					+"`!track pikachu`   \\\u00BB   mon tracking within an area you've registered\n"
					+"`!track pikachu d750`   \\\u00BB   tracks mon within 750m of the location registered\n"
					+"`!track pikachu iv90`   \\\u00BB   tracks 90%+ mon\n"
					+"`!track pikachu maxiv0 iv0`   \\\u00BB   tracks 0% mon\n"
					+"`!track shuckle cp300`   \\\u00BB   track mon CP300+\n"
					+"`!track shuckle maxcp300`   \\\u00BB   tracks mon <CP300\n"
					+"`!track shuckle level20`   \\\u00BB   tracks mon Level 20+\n"
					+"`!track shuckle maxlevel20`   \\\u00BB   tracks mon <Level 20\n"
					+"`!track snorlax atk13`   \\\u00BB   tracks mon 13atk+\n"
					+"`!track snorlax def13`   \\\u00BB   tracks mon 13def+\n"
					+"`!track snorlax sta13`   \\\u00BB   tracks mon 13sta+\n"
					+"`!track swablu maxatk0 atk15 sta15`   \\\u00BB   Max can also be used in style above\n"
					+"`!untrack pikachu`   \\\u00BB   remove mon tracking\n"
					+"`!untrack everything`   \\\u00BB   remove all mon tracking";
				return c.send(cmds).catch(console.error);
		}
	}
	if(command==="raidhelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR RAIDS ** ---\n"
					+"`!raid shinx`   \\\u00BB   raid tracking within an area you've registered\n"
					+"`!raid shinx d750`   \\\u00BB   tracks raid within 750m of the location registered\n"
					+"`!raid marowak formaloa`   \\\u00BB   tracks the Alolan form\n"
					+"`!raid level5`   \\\u00BB   tracks Level 5 raids\n"
					+"`!raid level5 ex`   \\\u00BB   tracks Level 5, EX-Eligible raids\n"
					+"`!raid level1 mystic`   \\\u00BB   track Level 1 raids at Mystic gyms\n"
					+"`!egg level5...`   \\\u00BB   use `egg` in place of `raid` in commands above\n"
					+"`!raid remove shinx` or `!egg remove level1`   \\\u00BB   remove tracking\n"
					+"`!raid remove everything` or `!egg remove everything`   \\\u00BB   removes all tracking";
				return c.send(cmds).catch(console.error);
		}
	}
	if(command==="questhelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR QUESTS ** ---\n"
					+"`!quest spinda`   \\\u00BB   quest tracking within an area you've registered\n"
					+"`!quest spinda d750`   \\\u00BB   tracks quests within 750m of the location registered\n"
					+"`!quest all pokemon`   \\\u00BB   tracks all pokemon quests\n"
					+"`!quest all item`   \\\u00BB   tracks all item quests\n"
					+"`!quest stardust`   \\\u00BB   tracks stardust quests\n"
					+"`!quest silver pinap`   \\\u00BB   tracks select item quests\n"
					+"`!quest remove stardust`   \\\u00BB   remove select quest tracking\n"
					+"`!quest remove everything`   \\\u00BB   removes all quest tracking\n";
				return c.send(cmds).catch(console.error);
		}
	}
	if(command==="rockethelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR ROCKET ** ---\n"
					+"`!rocket psychic`   \\\u00BB   tracking psychic invasions within an area you've registered\n"
					+"`!rocket everything d750`   \\\u00BB   tracks all invasions within 750m of the location registered\n"
					+"`!rocket mixed female`   \\\u00BB   tracks female invasions with mixed typing\n"
					+"`!rocket remove everything`   \\\u00BB   removes all rocket tracking\n";
				return c.send(cmds).catch(console.error);
		}
	}
	if(command==="pvphelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR PVP ** ---\n"
					+"<:type_fighting:553663995345764352> Do you even PvP, bro? <:type_fighting:553663995345764352>\n"
					+"To start, type `@pvp` in <#542779336374091826> to initialize the PvP module\n"
					+"Ranking finds mon that have the highest _potential_ level and maximizes CP for each league\n"
					+"Choose a low ranking to prevent getting spammed, at least under 20\n"
					+"Percentage isn't relevant. Just add all\n"
					+"For areas, be sure and add neighborhoods near you!\n"
					+"<:type_fighting:553663995345764352> With that, you're good to go! <:type_fighting:553663995345764352>\n";
				return c.send(cmds).catch(console.error);
		}
	}	
	if(command==="willowhelp") {
		if(!args[0]) { 
			cmds="--- ** COMMANDS FOR WILLOW ** ---\n"
					+"`!willow`   \\\u00BB   type in #willow-register to register\n"
					+"`!unregister`   \\\u00BB   type in #willow-register to delete all info\n"
					+"** \u00BB\u00BB Direct Message Willow **\n"
					+"`!stop`   \\\u00BB   temporarily stops alarms\n"
					+"`!start`   \\\u00BB   resume if previously stopped\n"
					+"`!location sherman oaks`   \\\u00BB   register your location. can be city, coords, address, etc.\n"
					+"`!area add sherman_oaks`   \\\u00BB   adds tracking in area. do not use spaces. type !hoods to see availablity\n"
					+"`!area remove sherman_oaks`   \\\u00BB   remove tracking in that area\n"
					+"`!list`   \\\u00BB   gives a list of user's current notifications\n"
					+"** \u00BB\u00BB For help with other commands **\n"
					+"`!monhelp`   \\\u00BB   for help with mon notifications\n"
					+"`!raidhelp`   \\\u00BB   for help with raid notifications\n"
					+"`!questhelp`   \\\u00BB   for help with raid notifications\n"
					+"`!rockethelp`   \\\u00BB   for help with raid notifications\n";
				return c.send(cmds).catch(console.error);
		}
	}
});

// log our bot in
bot.login(config.token);

bot.on('disconnected', function () {
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	let timeStamp="`"+yr+"/"+mo+"/"+da+"` **@** `"+hr+":"+min+":"+sec+"`";let timeStampSys="["+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+"] ";
	console.info(timeStampSys+'-- Disconnected --');console.log(console.error);
	process.exit(1);
});
