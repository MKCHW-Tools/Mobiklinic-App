package com.awesomeproject;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.content.Context;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.simprints.libsimprints.Identification;
import com.simprints.libsimprints.Registration;
import com.simprints.libsimprints.SimHelper;
import com.simprints.libsimprints.Metadata;

public class IdentificationPlus {

    private SimHelper simHelper;
    private int confirmIdentityCode;
    private int enrolmentCode;

    public IdentificationPlus(String projectID, String userID) {
        // Initialize SimHelper and other variables
        simHelper = new SimHelper(projectID, userID);
        confirmIdentityCode = 1;
        enrolmentCode = 2;
    }

    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // Your existing code...
    
        if (requestCode == confirmIdentityCode && resultCode == Activity.RESULT_OK) {
            // Handle successful confirmation of identity
            // Your logic here
        } else if (requestCode == enrolmentCode && resultCode == Activity.RESULT_OK) {
            // Handle successful enrolment
            // Your logic here
        } else {
            // Handle other checks for biometrics completed successfully and the resultCode is okay
    
            // Check if there were possible identified matches
            if (data.hasExtra("SIMPRINTS_IDENTIFICATIONS")) {
                // Your existing code...
            } else if (data.hasExtra("SIMPRINTS_REGISTRATION")) {
                // Your existing code...
            }
        }
    }
    

    private void onSelectBeneficiary(Context context, Intent data, String selectedUserUniqueId) {
        // Get the session ID from the resulting intent
        String sessionId = data.getStringExtra("SIMPRINTS_SESSION_ID");
    
        // Create an intent using the selected beneficiary's uniqueId and sessionId
        Intent intent = simHelper.confirmIdentity(context, sessionId, selectedUserUniqueId);
        // Start the activity with startActivityForResult
        // Pass the confirmIdentityCode as the request code
        // Make sure to handle the result in onActivityResult
        // Your logic here
    }
    
    

    private void noMatchFound(Intent data) {
        // In a case where the user chooses to register the captured biometric as a unique one,
        // you can get the session ID from the resulting intent and then trigger an enrolment
        String sessionId = data.getStringExtra("SIMPRINTS_SESSION_ID");

        // Create an intent, using sessionId, to enrol last captured biometrics
        Intent intent = simHelper.registerLastBiometrics("MODULE_ID", sessionId);
        // Start the activity with startActivityForResult
        // Pass the enrolmentCode as the request code
        // Make sure to handle the result in onActivityResult
        // Your logic here
    }
}
