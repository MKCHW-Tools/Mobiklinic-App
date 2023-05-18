package com.awesomeproject;

import android.app.Activity;
import android.content.Intent;
import android.text.TextUtils;

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
import com.simprints.libsimprints.Constants;
import com.simprints.libsimprints.Identification;
import com.simprints.libsimprints.SimHelper;

import java.util.ArrayList;

public class IdentificationModule extends ReactContextBaseJavaModule {
    private static final int REQUEST_CODE_IDENTIFY = 1;

    private ReactApplicationContext reactContext;
    private SimHelper simHelper;
    private String moduleId;
    private String userId;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(int requestCode, int resultCode, Intent data) {
            super.onActivityResult(requestCode, resultCode, data);

            if (resultCode == Activity.RESULT_OK) {
                if (requestCode == REQUEST_CODE_IDENTIFY) {
                    handleIdentificationSuccess(data);
                }
            } else {
                handleIdentificationFailure();
            }
        }
    };

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
    public void startIdentification(String projectId, String moduleId, String userId) {
        this.moduleId = moduleId;
        this.userId = userId;

        if (TextUtils.isEmpty(this.userId)) {
            this.userId = userId; // Use the provided userId parameter
        }

        simHelper = new SimHelper(projectId, this.userId);
        Intent intent = simHelper.identify(this.moduleId);

        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.startActivityForResult(intent, REQUEST_CODE_IDENTIFY);
        }
    }

    private void handleIdentificationSuccess(Intent data) {
        boolean biometricsComplete = data.getBooleanExtra(Constants.SIMPRINTS_BIOMETRICS_COMPLETE_CHECK, false);
        ArrayList<Identification> identifications = data
                .getParcelableArrayListExtra(Constants.SIMPRINTS_IDENTIFICATIONS);
        String sessionId = data.getStringExtra(Constants.SIMPRINTS_SESSION_ID);

        if (biometricsComplete && identifications != null && identifications.size() > 0) {
            WritableArray identificationResults = processIdentificationResults(identifications);
            sendEvent("identificationSuccess", identificationResults, sessionId);
        } else {
            sendEvent("identificationFailure", null, sessionId);
        }
    }

    private WritableArray processIdentificationResults(ArrayList<Identification> identifications) {
        WritableArray results = Arguments.createArray();

        for (Identification identification : identifications) {
            WritableMap result = Arguments.createMap();
            result.putString("guid", identification.getGuid());
            result.putString("tier", identification.getTier().name()); // Use the name() method to get the string representation of the Tier enum
            result.putDouble("confidence", identification.getConfidence());
            results.pushMap(result);
        }

        return results;
    }

    private void handleIdentificationFailure() {
        sendEvent("identificationFailure", null, null);
    }

    private void sendEvent(String eventName, @Nullable WritableArray identificationResults,
            @Nullable String sessionId) {
        WritableMap params = Arguments.createMap();

        if (!TextUtils.isEmpty(sessionId)) {
            params.putString("sessionId", sessionId);
        }

        if (identificationResults != null) {
            params.putArray("identificationResults", identificationResults);
        }

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
