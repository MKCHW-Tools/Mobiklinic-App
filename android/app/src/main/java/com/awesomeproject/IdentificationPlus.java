package com.awesomeproject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import androidx.annotation.Nullable;

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
import com.simprints.libsimprints.Constants;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;

public class IdentificationPlus extends ReactContextBaseJavaModule{
    private static final int IDENTIFY_REQUEST_CODE = 1;
    private static final String EVENT_IDENTIFICATION_RESULT = "onIdentificationResult";

    private ReactApplicationContext reactContext;

    public IdentificationPlus(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(activityEventListener);
    }
    @Override
    public String getName() {
        return "IdentificationPlus";
    }

    @ReactMethod
    public void registerOrIdentify(String projectID, String moduleID, String userID){
        Activity activity = getCurrentActivity();
        if(activity != null){
            Intent intent = new Intent("com.simprints.id.REGISTER");
            intent.putExtra("projectId", projectID);
            intent.putExtra("userId", userID);
            intent.putExtra("moduleId", moduleID);
            activity.startActivityForResult(intent, 1);
        }
        else{
           SimHelper simHelper = new SimHelper(projectID, userID);
           Intent identifyIntent = simHelper.identify(moduleID);
           getCurrentActivity().startActivityForResult(identifyIntent, IDENTIFY_REQUEST_CODE);
        }
    }

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
           if (requestCode == 1){
                if (resultCode == Activity.RESULT_OK){
                     Registration registration = data.getParcelableExtra("registration");
                     if (registration != null){
                          String guid = registration.getGuid();
                          WritableMap params = Arguments.createMap();
                          params.putString("guid", guid);
                          getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                 .emit("SimprintsRegistrationSuccess+", params);
                     }
                }
              }
              else if (requestCode == IDENTIFY_REQUEST_CODE){
                if (resultCode == Activity.RESULT_OK){
                    handleIdentification(data);
                }
                else {
                    WritableMap params = Arguments.createMap();
                    params.putString("error", "Identification failed");
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("SimprintsIdentificationFailed", params);
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
                String topMatchId = topMatch.getGuid();
    
               
                WritableArray resultArray = Arguments.createArray();
    
                for (Identification identification : identifications) {
                    WritableMap identificationMap = Arguments.createMap();
                    identificationMap.putString("tier", identification.getTier().toString());
                    identificationMap.putDouble("confidenceScore", identification.getConfidence());
                    identificationMap.putString("guid", identification.getGuid());
                    resultArray.pushMap(identificationMap);
                }
    
                // Emit an event to the React Native app with the identification results
                sendEvent(EVENT_IDENTIFICATION_RESULT, resultArray);
            }
        }
    }

    private void sendEvent(String eventName, @Nullable WritableArray params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}