package com.mobiklinic;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.ArrayList;

import com.simprints.libsimprints.Constants;
import com.simprints.libsimprints.Identification;
import com.simprints.libsimprints.SimHelper;
import com.simprints.libsimprints.RefusalForm;

public class IdentificationModule extends ReactContextBaseJavaModule {
    private static final int IDENTIFY_REQUEST_CODE = 1;
    private static final String EVENT_IDENTIFICATION_RESULT = "onIdentificationResult";
    private static final int CONFIRM_IDENTITY_REQUEST_CODE = 2;

    private ReactApplicationContext reactContext;
    private SimHelper simHelper;

    public IdentificationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(activityEventListener);
    }

    @Override
    public String getName() {
        return "IdentificationModule";
    }

    @ReactMethod
    public void triggerIdentification(String projectID, String moduleID, String userID) {
        SimHelper simHelper = new SimHelper(projectID, userID);
        Intent identifyIntent = simHelper.identify(moduleID);
        getCurrentActivity().startActivityForResult(identifyIntent, IDENTIFY_REQUEST_CODE);
    }

    @ReactMethod
    public void confirmSelectedBeneficiary(String sessionId, String selectedUserUniqueId) {
        Intent intent = simHelper.confirmIdentity(getReactApplicationContext(), sessionId, selectedUserUniqueId);
        getCurrentActivity().startActivityForResult(intent, CONFIRM_IDENTITY_REQUEST_CODE);
    }

    @ReactMethod
    public void noMatch(String sessionId, String selectedUserUniqueId) {
        Intent intent = simHelper.confirmIdentity(getReactApplicationContext(), sessionId, "none_selected");
        getCurrentActivity().startActivityForResult(intent, CONFIRM_IDENTITY_REQUEST_CODE);
    }

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);

            if (requestCode == IDENTIFY_REQUEST_CODE) {
                if (resultCode == Activity.RESULT_OK) {
                    handleIdentification(data);
                } else {
                    // Handle identification error
                }
            }
        }
    };

    private void handleIdentification(Intent data) {
        boolean biometricsCompleted = data.getBooleanExtra(Constants.SIMPRINTS_BIOMETRICS_COMPLETE_CHECK, false);
    
        if (biometricsCompleted) {
            String sessionId = data.getStringExtra(Constants.SIMPRINTS_SESSION_ID);
            ArrayList<Identification> identifications = data.getParcelableArrayListExtra(Constants.SIMPRINTS_IDENTIFICATIONS);
    
            if (identifications != null && identifications.size() > 0) {
                Identification topMatch = identifications.get(0);
                // String topMatchId = topMatch.getGuid();
                
    
               
                WritableArray resultArray = Arguments.createArray();
    
                for (Identification identification : identifications) {
                    WritableMap identificationMap = Arguments.createMap();
                    identificationMap.putString("tier", identification.getTier().toString());
                    identificationMap.putDouble("confidenceScore", identification.getConfidence());
                    identificationMap.putString("guid", identification.getGuid());
                    identificationMap.putString("sessionId", sessionId);
                    resultArray.pushMap(identificationMap);
                }
    
                // Emit an event to the React Native app with the identification results
                sendEvent(EVENT_IDENTIFICATION_RESULT, resultArray);
            }

            else{
                // if(data.hasExtra(Constants.SIMPRINTS_REFUSAL_FORM)){
                //     RefusalForm refusalForm = data.getParcelableExtra(Constants.SIMPRINTS_REFUSAL_FORM);
                //     String reason = refusalForm.getReason();
                //     String extra = refusalForm.getExtra();
                //     WritableMap errorParams = Arguments.createMap();
                //     errorParams.putString("reason", reason);
                //     errorParams.putString("extra", extra);
                //     getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                //             .emit("SimprintsIdentificationError", errorParams);
                // }
                // else{
                //     WritableMap errorParams = Arguments.createMap();
                //     errorParams.putString("reason", "No identification results");
                //     errorParams.putString("extra", "No identification results");
                //     getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                //             .emit("SimprintsIdentificationError", errorParams);                }

            }
        }
    }
    

    private void sendEvent(String eventName, @Nullable WritableArray params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}