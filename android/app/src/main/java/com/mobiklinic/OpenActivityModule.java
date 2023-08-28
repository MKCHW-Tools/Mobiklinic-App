package com.mobiklinic;

import android.app.Activity;
import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.simprints.libsimprints.Registration;
import com.simprints.libsimprints.Constants;


public class OpenActivityModule extends ReactContextBaseJavaModule implements ActivityEventListener {
    private static final int REGISTER_OR_IDENTIFY_REQUEST_CODE = 1;

    public OpenActivityModule(ReactApplicationContext reactContext) {
        super(reactContext);
        // Register the ActivityEventListener
        reactContext.addActivityEventListener(this);
    }

    @NonNull
    @Override
    public String getName() {
        return "OpenActivity";
    }

    @ReactMethod
    public void open(String projectId, String userId, String moduleId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            Intent intent = new Intent("com.simprints.id.REGISTER");
            intent.putExtra("projectId", projectId);
            intent.putExtra("userId", userId);
            intent.putExtra("moduleId", moduleId);
            activity.startActivityForResult(intent, REGISTER_OR_IDENTIFY_REQUEST_CODE);
        }
    }

    
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == 1) {
            if (resultCode == Activity.RESULT_OK) {
                Registration registration = data.getParcelableExtra("registration");
                if (registration != null) { // Check if the registration object is not null
                    String guid = registration.getGuid();
                    String sessionId = data.getStringExtra(Constants.SIMPRINTS_SESSION_ID);

                    // Store the GUID or perform any desired actions
                    // For example, you can emit an event to your React Native code
                    WritableMap params = Arguments.createMap();
                    params.putString("guid", guid);
                    params.putString("sessionId", sessionId);
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("SimprintsRegistrationSuccess", params);
                } else {
                    // Handle the case when the registration object is null
                    // You can emit an event to your React Native code to handle the error
                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("SimprintsRegistrationError", null);
                }
            } else {
                
                // Handle the case when the registration was not successful
                // You can emit an event to your React Native code to handle the error
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("SimprintsRegistrationError", null);
            }
        }
    }
    

    @Override
    public void onNewIntent(Intent intent) {
        // Do nothing here
    }
}