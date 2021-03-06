// Description:
//   listens for trigger words to identify a user as away.
//   when a user is mentioned while considered away, the bot mentions the user is away.
//   when a user speaks again, they are considered no longer away.
//
//   inspired by the 'brb.coffee' script in the old scripts repo.
//
// Dependencies:
//   none beyond hubot
//
// Configuration:
//   none
//
// Commands:
//   brb - when seen, will put you on the away list (any other comment removes you)
//   afk - when seen, will put you on the away list (any other comment removes you)
//   lunch - when seen, will put you on the away list (any other comment removes you)
//
// Notes:
//   trigger words: lunch, brb, afk, bbl, bbiab, bbiaf
//
// Author:
//   Joel Kleier <joel@kleier.us>

module.exports = function(robot) {
    var awayre1 = /\b(brb|afk|bbl|bbiab|bbiaf)\b/i;
    var awayre2 = /^(lunch|dinner|night|good night|back later|away|out)$/i;
    var tracked = [];
    var respond_when_away = function(msg) {
        var username = msg.message.user.name,
            txt = msg.message.text,
            idx = tracked.indexOf(username),
            is_tracked = idx >= 0,
            is_going_away_again = awayre1.test(txt) || awayre2.test(txt),
            numtracked,
            mention,
            curname;
        if(is_tracked) {
	    if(!is_going_away_again) {
		tracked.splice(idx, 1);
	    }
	    else {
		msg.send("see you soon, " + username + "!");
	    }
        }
        else {
            numtracked = tracked.length;
            for(var i = 0; i < numtracked; i++) {
                curname = tracked[i];
                mention = '@' + curname;
                if(txt.indexOf(mention) >= 0) {
                    msg.send(curname + " may currently be AFK and unable to respond quickly.");
                    break;
                }
            }
        }
    };
    var handle_away = function(msg) {
        tracked.push(msg.message.user.name);
    };

    robot.hear(/./i, respond_when_away);
    robot.hear(awayre1, handle_away);
    robot.hear(awayre2, handle_away);
};
