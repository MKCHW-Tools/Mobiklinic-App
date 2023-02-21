import React from "react";
import Entry from "./components/entry";
import { UserProvider } from "./components/providers/User";
import { DiagnosisProvider } from "./components/providers/Diagnosis";
import { DoctorsProvider } from "./components/providers/Doctors";

export const App = () => {
	return (
		<UserProvider>
			<DiagnosisProvider>
				<DoctorsProvider>
					<Entry />
				</DoctorsProvider>
			</DiagnosisProvider>
		</UserProvider>
	);
};

export default App;
