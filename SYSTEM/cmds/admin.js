const { config } = global.NeroBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "ادمن",
		version: "1.5",
		author: "SIFO ANTER ",
		countDown: 5,
		role: 2,
		shortDescription: {
			
			ar: "إ المسؤول إضافة وإزالة وتحرير دور"
		},
		longDescription: {
			
			ar: "إضافة وإزالة وتحرير دور المسؤول"
		},
		category: "المالك",
		guide: {
			
			ar: '   {pn} [إضافة | -a] <آيدي | @تاغ>: قم بإضافة دور المسؤول للمستخدم'
				+ '\n	  {pn} [إزالة | -r] <آيدي | @تاغ>: إزالة دور المسؤول للمستخدم'
				+ '\n	  {pn} [قائمة | -l]: قائمة جميع المسؤولين'
		}
	},

	langs: {
		
		ar: {
			added: "✅ | تمت إضافة دور المشرف لـ %1 المستخدمين:\n%2",
			alreadyAdmin: "\n⚠️ | %1 لدى المستخدمين بالفعل دور المسؤول:\n%2",
			missingIdAdd: "⚠️ | الرجاء إدخال المعرف أو علامة المستخدم لإضافة دور المشرف",
			removed: "✅ | تمت إزالة دور المسؤول لـ %1 من المستخدمين:\n%2",
			notAdmin: "⚠️ | %1 ليس لدى المستخدمين دور المسؤول:\n%2",
			missingIdRemove: "⚠️ | الرجاء إدخال المعرف أو علامة المستخدم لإزالة دور المشرف",
			listAdmin: "👑 | قائمة المشرفين:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "إضافة":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.adminBot.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "إزالة":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.adminBot.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.adminBot.splice(config.adminBot.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "قائمة":
			case "-l": {
				const getNames = await Promise.all(config.adminBot.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.SyntaxError();
		}
	}
};