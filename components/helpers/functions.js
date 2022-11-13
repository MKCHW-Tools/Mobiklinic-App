import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import axios from "axios";
import { URLS } from "../constants/API";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

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

export const RETRIEVE_LOCAL_USER = async () => {
	try {
		let user = await AsyncStorage.getItem("@user");
		let theUser = user !== null ? user : null;
		return theUser;
	} catch (err) {
		new Error(err);
	}
};
export const SAVE_LOCAL_USER = async (user = {}) => {
	try {
		// let storedUser = await RETRIEVE_LOCAL_USER();

		const HASH = cyrb53(user.password);

		/*if (HASH && users !== null) {
			console.log(users);
			users = JSON.parse(users);
			users.push({
				username: user.username,
				hash: HASH,
				tokens: user.tokens,
			});
			await AsyncStorage.setItem(
				"@mobiklinicUsers",
				JSON.stringify(users)
			);
		} else {*/
		await AsyncStorage.setItem(
			"@user",
			JSON.stringify({
				id: user.id,
				username: user.username,
				hash: HASH,
				tokens: user.tokens,
			})
		);
		//}
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
	// await AsyncStorage.removeItem("@doctors");
	// await AsyncStorage.removeItem("@ambulances");
	const { accessToken, items, userId, per_page } = data;
	axios.defaults.baseURL = URLS.BASE;
	axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	axios.defaults.headers.post["Content-Type"] =
		"application/json; charset=UTF-8";
	axios.defaults.headers.post["Accept"] = "application/json";
	const DATA_CATEGORY = ["diagnosis", "chats"];
	for (let i = 0; i < items.length; i++) {
		try {
			const {
				data: { total },
			} = await axios.get(`/${items[i]}`);

			let pages = Math.round(total / per_page);
			pages = pages < 1 ? 1 : pages;
			let _downloaded = 0;
			for (let page = 1; page <= pages; page++) {
				const response = await axios.get(`/${items[i]}?page=${page}`);
				const _items = response.data[items[i]];

				let itemsOnDevice = await AsyncStorage.getItem(`@${items[i]}`);
				itemsOnDevice = JSON.parse(itemsOnDevice) || [];
				const all = uniqWith([..._items, ...itemsOnDevice], isEqual);
				AsyncStorage.setItem(`@${items[i]}`, JSON.stringify(all));
			}
		} catch (error) {
			console.log("Downlod", error);
		}

		if (i >= items.length) {
			return true;
		}
	}
};

export const signIn = async (data) => {
	let { user, setIsLoading, setTokens, setMyUser: setUser } = data;

	if (typeof user === undefined) {
		Alert.alert("Error", "Provide your phone number and password");
		return;
	}

	const { username, password } = user;

	if (username === "" && password === "") {
		Alert.alert("Error", "Provide your phone number and password");
		return;
	}

	let theUser = null;

	try {
		theUser = await RETRIEVE_LOCAL_USER();
		theUser = JSON.parse(theUser);
	} catch (err) {
		console.log(err);
	}

	if (theUser !== null) {
		let hash = cyrb53(password);
		let myUser =
			theUser.username === username && theUser.hash === hash
				? theUser
				: null;

		if (myUser !== undefined && myUser.username === username) {
			setUser({ ...myUser, offline: true });
			setIsLoading(false);
			setTokens({ access: password });
			return;
		} else {
			Alert.alert("Failed to login", "Try again, please!");
			return;
		}
	} else {
		try {
			console.log("Starting network request");
			let response = await fetch(`${URLS.BASE}/users/login`, {
				method: "POST",
				body: JSON.stringify({
					username: username,
					password: password,
				}),
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					Accept: "application/json",
				},
			});

			let json_data = await response.json();
			const { result, id, accessToken, refreshToken } = json_data;

			if (result == "Success") {
				await SAVE_LOCAL_USER({
					id,
					username,
					password,
					tokens: { access: accessToken, refresh: refreshToken },
				});

				const resources = ["ambulances", "doctors", "diagnosis"];

				if (
					DOWNLOAD({
						accessToken,
						items: resources,
						per_page: 10,
					})
				) {
					setUser({ id, username, offline: false });
					setIsLoading(false);
					setTokens({ access: accessToken });
				}
			} else
				Alert.alert(
					"Failed to login",
					"Check your login details",
					[
						{
							text: "Cancel",
							onPress: () => setIsLoading(false),
						},
					],

					{
						cancelable: true,
						onDissmiss: () => {
							setIsLoading(false);
						},
					}
				);
		} catch (err) {
			err?.message == "Network request failed" &&
				Alert.alert(
					"Oops!",
					"Check your internet connection",
					[
						{
							text: "Cancel",
							onPress: () => setIsLoading(false),
						},
					],
					{
						cancelable: true,
						onDissmiss: () => {
							setIsLoading(false);
						},
					}
				);
			setIsLoading(false);
			console.log(err);
		}
	}
};
export const signOut = () => {
	AsyncStorage.removeItem("tokens");
};
