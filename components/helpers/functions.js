import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { URLS } from "../constants/API";

export const _removeStorageItem = async (key) => {
	return await AsyncStorage.removeItem(key);
};

export const generateRandomCode = (length) => {
	const USABLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

	return new Array(length)
		.fill(null)
		.map(
			() =>
				USABLE_CHARACTERS[
					Math.floor(Math.random() * USABLE_CHARACTERS.length)
				]
		)
		.join("");
};

export const MyDate = () => {
	const myDate = new Date();
	return `${
		myDate.getMonth() + 1
	}-${myDate.getDate()}-${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}:${myDate.getSeconds()}`;
};

export const tokensRefresh = async () => {
	const Tokens = await AsyncStorage.getItem("tokens");
	// console.log(Tokens);
	try {
		const { refreshToken: rToken } = JSON.parse(Tokens);
		console.log(refreshToken);

		const response = await fetch(`${URLS.BASE}/tokens/refresh`, {
			method: "GET",
			headers: {
				Authorization: "Bearer " + rToken,
				"Content-type": "application/json; charset=UTF-8",
				Accept: "application/json",
			},
		});

		const JSON_RESPONSE = await response.json();

		const { accessToken, refreshToken, msg, result } = JSON_RESPONSE;

		if (result === "Failure") return false;

		if (result === "Success") {
			return {
				accessToken,
				refreshToken,
			};
		}
	} catch (e) {
		console.error(e.message);
	}
};

export const RETRIEVE_LOCAL_USERS = async () => {
	try {
		let users = await AsyncStorage.getItem("@theUsers");
		let theUsers = users !== null ? users : null;
		return theUsers;
	} catch (err) {
		new Error(err);
	}
};
export const SAVE_LOCAL_USERS = async (username, password) => {
	try {
		let users = await RETRIEVE_LOCAL_USERS();

		const HASH = cyrb53(password);

		if (HASH && users !== null) {
			console.log(users);
			users = JSON.parse(users);
			users.push({ username, hash: HASH });
			await AsyncStorage.setItem("@theUsers", JSON.stringify(users));
		} else {
			await AsyncStorage.setItem(
				"@theUsers",
				JSON.stringify([{ username, hash: HASH }])
			);
		}
	} catch (err) {
		new Error(err);
	}
};

export const cyrb53 = function (str, seed = 0) {
	let h1 = 0xdeadbeef ^ seed,
		h2 = 0x41c6ce57 ^ seed;

	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}

	h1 =
		Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
		Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 =
		Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
		Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const DOWNLOAD = async (data) => {
	const items = ["doctors", "ambulances", "diagnosis", "messages"];

	if (items?.length > 0) {
		items.forEach((item) => {
			switch (item) {
				case "doctors":
					DOWNLOAD("ambulances");
					break;
				case "ambulances":
					DOWNLOAD("diagnosis");
					break;
				case "diagnosis":
					DOWNLOAD("messages");
					break;
				case "messages":
					DOWNLOAD("doctors");
					break;
				default:
					DOWNLOAD("doctors");
					break;
			}
		});
	} else {
		return false;
	}
};

let downloader = async (URL) => {
	try {
		await fetch();
	} catch (error) {
		console.log(error);
	}
};
