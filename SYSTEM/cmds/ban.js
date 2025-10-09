const { findUid } = global.utils;
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "حظر",
		version: "1.2",
		author: "SIFOANTER ",
		aliases:["باند","بانكاي"],
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "قم بحظر المستخدم من المجموعة"
		},
		longDescription: {
			en: "قم بحظر المستخدم من المجموعة"
		},
		category: "المجموعة",
		guide: {

			ar: "   {pn} [@تاغ|آيدي|رابط فيسبوك|قم بالرد] [<السبب>|أتركها غارغة إذا لم يكن هناك أي سبب]: حظر المستخدم من المجموعة"
				+ "\n   {pn} تفقد: التحقق من الأعضاء المحظورين وطردهم من الدردشة"
				+ "\n   {pn} إلغاء_الحظر [@تاغ|آيدي|رابط فيسبوك|قم بالرد]:.إلغاء الحظر عن المستخدم في المجموعة"
				+ "\n   {pn} قائمة: عرض قائمة الأعضاء المحظورين"
		}
	},

	langs: {
		
		ar: {
			notFoundTarget: "⚠️ | يرجى الإشارة إلى الشخص المراد حظره أو إدخال رابط آيدي أو فيسبوك أو الرد على رسالة الشخص المراد حظره",
			notFoundTargetUnban: "⚠️ | يرجى الإشارة إلى الشخص الذي يريد رفع الحظر عنه أو إدخال رابط آيدي أو فيسبوك أو الرد على رسالة الشخص الذي يريد رفع الحظر عنه",
			userNotBanned: "⚠️ | الشخص ذو الآيدي %1 لم يتم حظره من المجموعة",
			unbannedSuccess: "✅ | غير محظور %1 من المجموعة!",
			cantSelfBan: "⚠️ | لا يمكنك حظر نفسك!",
			cantBanAdmin: "❌ | لا يمكنك حظر المسؤول!",
			existedBan: "❌ | لقد تم حظر هذا الشخص من قبل!",
			noReason: "لا يوجد سبب",
			bannedSuccess: "✅ | محظور %1 من المجموعة!",
			needAdmin: "⚠️ | يحتاج البوت إلى إذن المسؤول لطرد الأعضاء المحظورين",
			noName: "مستخدم فيسبوك",
			noData: "📑 | لايوجد أي شخص محظور في المجموعة",
			listBanned: "📑 | قائمة الأعضاء المحظورين في المجموعة (صفحة %1/%2)",
			content: "%1/ %2 (%3)\nالسبب: %4\nوقت الحظر: %5\n\n",
			needAdminToKick: "⚠️ | العضو %1 (%2) قد تم حظره من المجموعة, لكن البوت ليس لديه إذن المسؤول لطرد هذا العضو، يرجى منح إذن المسؤول للبوت لطرد هذا العضو",
			bannedKick: "⚠️ | %1 لقد تم حظره من قبل في المجموعة!\nآيدي: %2\nالسبب: %3\nوقت الحظر: %4\n\nقام البوت بطرد هذا العضو تلقائيًا"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang, usersData, api }) {
		const { members, adminIDs } = await threadsData.get(event.threadID);
		const { senderID } = event;
		let target;
		let reason;

		const dataBanned = await threadsData.get(event.threadID, 'data.banned_ban', []);

		if (args[0] == 'إلغاء_الحظر') {
			if (!isNaN(args[1]))
				target = args[1];
			else if (args[1]?.startsWith('https'))
				target = await findUid(args[1]);
			else if (Object.keys(event.mentions || {}).length)
				target = Object.keys(event.mentions)[0];
			else if (event.messageReply?.senderID)
				target = event.messageReply.senderID;
			else
				return api.sendMessage(getLang('notFoundTargetUnban'), event.threadID, event.messageID);

			const index = dataBanned.findIndex(item => item.id == target);
			if (index == -1)
				return api.sendMessage(getLang('userNotBanned', target), event.threadID, event.messageID);

			dataBanned.splice(index, 1);
			await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
			const userName = members[target]?.name || await usersData.getName(target) || getLang('noName');

			return api.sendMessage(getLang('unbannedSuccess', userName), event.threadID, event.messageID);
		}
		else if (args[0] == "تفقد") {
			if (!dataBanned.length)
				return;
			for (const user of dataBanned) {
				if (event.participantIDs.includes(user.id))
					api.removeUserFromGroup(user.id, event.threadID);
			}
		}

		if (event.messageReply?.senderID) {
			target = event.messageReply.senderID;
			reason = args.join(' ');
		}
		else if (Object.keys(event.mentions || {}).length) {
			target = Object.keys(event.mentions)[0];
			reason = args.join(' ').replace(event.mentions[target], '');
		}
		else if (!isNaN(args[0])) {
			target = args[0];
			reason = args.slice(1).join(' ');
		}
		else if (args[0]?.startsWith('https')) {
			target = await findUid(args[0]);
			reason = args.slice(1).join(' ');
		}
		else if (args[0] == 'list') {
			if (!dataBanned.length)
				return message.reply(getLang('noData'));
			const limit = 20;
			const page = parseInt(args[1] || 1) || 1;
			const start = (page - 1) * limit;
			const end = page * limit;
			const data = dataBanned.slice(start, end);
			let msg = '';
			let count = 0;
			for (const user of data) {
				count++;
				const name = members[user.id]?.name || await usersData.getName(user.id) || getLang('noName');
				const time = user.time;
				msg += getLang('content', start + count, name, user.id, user.reason, time);
			}
			return message.reply(getLang('listBanned', page, Math.ceil(dataBanned.length / limit)) + '\n\n' + msg);
		}

		if (!target)
			return message.reply(getLang('notFoundTarget'));
		if (target == senderID)
			return message.reply(getLang('cantSelfBan'));
		if (adminIDs.includes(target))
			return message.reply(getLang('cantBanAdmin'));

		const banned = dataBanned.find(item => item.id == target);
		if (banned)
			return message.reply(getLang('existedBan'));

		const name = members[target]?.name || (await usersData.getName(target)) || getLang('noName');
		const time = moment().tz(global.NeroBot.config.timeZone).format('HH:mm:ss DD/MM/YYYY');
		const data = {
			id: target,
			time,
			reason: reason || getLang('noReason')
		};

		dataBanned.push(data);
		await threadsData.set(event.threadID, dataBanned, 'data.banned_ban');
		message.reply(getLang('bannedSuccess', name), () => {
			if (members.some(item => item.userID == target)) {
				if (adminIDs.includes(api.getCurrentUserID()))
					api.removeUserFromGroup(target, event.threadID);
				else
					message.send(getLang('needAdmin'), (err, info) => {
						global.NeroBot.onEvent.push({
							messageID: info.messageID,
							onStart: ({ event }) => {
								if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
									const { TARGET_ID } = event.logMessageData;
									if (TARGET_ID == api.getCurrentUserID()) {
										api.removeUserFromGroup(target, event.threadID, () => global.NeroBot.onEvent = global.NeroBot.onEvent.filter(item => item.messageID != info.messageID));
									}
								}
							}
						});
					});
			}
		});
	},

	onEvent: async function ({ event, api, threadsData, getLang, message }) {
		if (event.logMessageType == "log:subscribe") {
			const { threadID } = event;
			const dataBanned = await threadsData.get(threadID, 'data.banned_ban', []);
			const usersAdded = event.logMessageData.addedParticipants;

			for (const user of usersAdded) {
				const { userFbId, fullName } = user;
				const banned = dataBanned.find(item => item.id == userFbId);
				if (banned) {
					const reason = banned.reason || getLang('noReason');
					const time = banned.time;
					return api.removeUserFromGroup(userFbId, threadID, err => {
						if (err)
							return message.send(getLang('needAdminToKick', fullName, userFbId), (err, info) => {
								global.NeroBot.onEvent.push({
									messageID: info.messageID,
									onStart: ({ event }) => {
										if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
											const { TARGET_ID } = event.logMessageData;
											if (TARGET_ID == api.getCurrentUserID()) {
												api.removeUserFromGroup(userFbId, event.threadID, () => global.NeroBot.onEvent = global.NeroBot.onEvent.filter(item => item.messageID != info.messageID));
											}
										}
									}
								});
							});
						else
							message.send(getLang('bannedKick', fullName, userFbId, reason, time));
					});
				}
			}
		}
	}
};
