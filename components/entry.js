import * as React from "react";
import { AuthProvider } from "./contexts/auth";

import AppNav from "./navigators/AppNav";

const Entry = () => {
	React.useEffect(() => {
		//clearStorage();
		//autoLogin()
	}, []);
	return (
		<AuthProvider>
			<AppNav />
		</AuthProvider>
	);
};

export default Entry;
