package com.awesomeproject;

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


public class OpenActivityModule extends ReactContextBaseJavaModule implements ActivityEventListener {
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
            activity.startActivityForResult(intent, 1);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == 1) { // Check if this is the result from the Simprints ID registration
            if (resultCode == Activity.RESULT_OK) { // Check if the registration was successful
                Registration registration =  data.getParcelableExtra("registration"); // Get the registration object
                String guid = registration.getGuid(); // Get the GUID returned from Simprints ID

                // Store the GUID or perform any desired actions
                // For example, you can emit an event to your React Native code
                WritableMap params = Arguments.createMap();
                params.putString("guid", guid);
                getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("SimprintsRegistrationSuccess", params);
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
