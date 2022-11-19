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
	const user = JSON.parse(await AsyncStorage.getItem("@user"));
	const refresh = user.tokens.refresh;
	try {
		const response = await fetch(`${URLS.BASE}/tokens/refresh`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${refresh}`,
				"Content-type": "application/json; charset=UTF-8",
				Accept: "application/json",
			},
		});

		const JSON_RESPONSE = await response.json();

		const { accessToken, refreshToken, msg, result } = JSON_RESPONSE;
		// console.log(result);
		// console.log(msg);
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
		return JSON.parse(user) || null;
	} catch (err) {
		new Error(err);
	}
};
export const SAVE_LOCAL_USER = async (user = {}) => {
	try {
		const HASH = cyrb53(user.password);

		await AsyncStorage.setItem(
			"@user",
			JSON.stringify({
				id: user.id,
				username: user.username,
				hash: HASH,
				tokens: user.tokens,
			})
		);
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
	//clearStorage();
	let { user, setIsLoading, setMyUser: setUser } = data;

	if (typeof user === undefined) {
		Alert.alert("Error", "Provide your phone number and password");
		return;
	}

	const { username, password } = user;
	let hash = cyrb53(password);

	if (username === "" && password === "") {
		Alert.alert("Error", "Provide your phone number and password");
		return;
	}

	let theUser = null;

	try {
		theUser = await RETRIEVE_LOCAL_USER();
		// theUser = JSON.parse(theUser);
	} catch (err) {
		console.log(err);
	}

	if (theUser !== null) {
		let myUser =
			theUser.username === username && theUser.hash === hash
				? theUser
				: null;

		if (myUser) {
			setUser({
				id: myUser.id,
				username: myUser.username,
				tokens: myUser.tokens,
				offline: true,
			});
			setIsLoading(false);
			// console.log(myUser);
			// setTokens({ access: hash });
			return;
		} else {
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
                    onDismiss: () => {
                        setIsLoading(false);
                    },
                }
            );
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
					setUser({
						id,
						username,
						tokens: { access: accessToken, refresh: refreshToken },
						offline: false,
					});
					setIsLoading(false);
					// setTokens({ access: accessToken });
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
						onDismiss: () => {
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

export const signUp = async (data) => {
	// In a production app, we need to send user data to server and get a token
	// We will also need to handle errors if sign up failed
	// After getting token, we need to persist the token using `AsyncStorage`
	// In the example, we'll use a dummy token
	const {
		firstname,
		lastname,
		theemail,
		thephone,
		thepassword,
		thepassword2,
	} = data.errors;

	if (
		firstname ||
		lastname ||
		theemail ||
		thephone ||
		thepassword ||
		thepassword2
	) {
		Alert.alert("Fail", "Errors, Fix errors in the form, and try again!");
		return;
	}

	const { firstName, lastName, phone, password, password2, email } = data;

	if (
		firstName == "" ||
		lastName == "" ||
		phone.length < 12 ||
		password == "" ||
		password2 == ""
	) {
		Alert.alert("Fail", "Fix errors in the form, and try again!");
		console.log(firstName, lastName, phone, email, password, password2);
		return;
	}

	userContext.setIsRegistering("yes");

	try {
		await fetch(`${URLS.BASE}/register`, {
			method: "POST",
			body: JSON.stringify({
				phone: phone,
				fname: firstName,
				lname: lastName,
				email: email,
				role_id: 2,
				password: password,
				password_confirmation: password2,
			}),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				Accept: "application/json",
			},
		})
			.then((res) => res.json())
			.then((response) => {
				if (response.result == "success") {
					try {
						userContext.setIsRegistering("complete");
					} catch (err) {
						console.error(err);
					}
				} else if (response.result == "failure") {
					const { email, phone } = response.message;

					if (typeof email != "undefined")
						Alert.alert(
							"Registration failed!",
							"The email address you entered was used by another member."
						);
					else if (typeof phone != "undefined")
						Alert.alert(
							"Registration failed!",
							"The phone number you entered was used by another member."
						);
					else Alert.alert("Ooops!", "Try again!");

					console.log(response);
				} else {
					Alert.alert("Ooops!", "Try again!");
				}
			})
			.catch((err) => {
				console.log(err);
				Alert.alert(
					"Failure",
					"Something wrong happened. Check your internet and try again!"
				);
			});
	} catch (err) {
		console.error(err);
	}
};

export const signOut = (callback) => {
	callback();
};

export const clearStorage = async () => {
	await AsyncStorage.clear();
};

export const autoLogin = async () => {
	let accessToken = null;

	try {
		let tokenString = await AsyncStorage.getItem("tokens");

		let tokens = tokenString !== null && JSON.parse(tokenString);
		accessToken = tokens.accessToken;
	} catch (e) {
		// Restoring token failed
		console.log(e);
		console.log("Restoring token failed");
		console.log("acessToken ", accessToken);
	}
};

export const getKeys = async () => {
	const keys = await AsyncStorage.getAllKeys();
	console.log(keys);
};

const processMessage = async () => {};
