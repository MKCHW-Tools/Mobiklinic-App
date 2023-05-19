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
import com.awesomeproject.Beneficiary;

import java.util.ArrayList;

public class IdentificationModule extends ReactContextBaseJavaModule {
    private static final String EVENT_IDENTIFICATION_SUCCESS = "identificationSuccess";
    private static final String EVENT_IDENTIFICATION_FAILURE = "identificationFailure";
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
            this.userId = userId;
        }

        simHelper = new SimHelper(projectId, this.userId);
        Intent intent = simHelper.identify(this.moduleId);

        Activity currentActivity = getCurrentActivity();
        if (currentActivity != null) {
            currentActivity.startActivityForResult(intent, REQUEST_CODE_IDENTIFY);

        }
    }

    private void handleIdentificationSuccess(Intent data) {
        boolean biometricsCompleted = data.getBooleanExtra(Constants.SIMPRINTS_BIOMETRICS_COMPLETE_CHECK, false);
        String sessionId = data.getStringExtra(Constants.SIMPRINTS_SESSION_ID);
        ArrayList<Identification> identifications = data
                .getParcelableArrayListExtra(Constants.SIMPRINTS_IDENTIFICATIONS);


        ArrayList<Beneficiary> beneficiaries = new ArrayList<>();
        for (Identification identification : identifications) {
            String beneficiaryId = identification.getGuid();
            Beneficiary beneficiary = retrieveBeneficiary(beneficiaryId);
            if (beneficiary != null) {
                beneficiaries.add(beneficiary);
            }
        }

        if (beneficiaries.size() > 0) {
            sendBeneficiariesToReactNative(beneficiaries, sessionId);
        } else {
            sendEvent(EVENT_IDENTIFICATION_FAILURE, null, null);
        }
        

    }

    private Beneficiary retrieveBeneficiary(String beneficiaryId) {
        // Implement the logic to retrieve the beneficiary based on the beneficiaryId
        // For example, you can query a local database or make an API request to fetch
        // the beneficiary
        // Return the retrieved beneficiary object or null if not found
        // ...

        return null;
    }

    private void sendBeneficiariesToReactNative(ArrayList<Beneficiary> beneficiaries, String sessionId) {
        WritableArray beneficiaryArray = Arguments.createArray();
        for (Beneficiary beneficiary : beneficiaries) {
            WritableMap beneficiaryMap = Arguments.createMap();
            beneficiaryMap.putString("id", beneficiary.getId());
            beneficiaryMap.putString("name", beneficiary.getName());
            beneficiaryArray.pushMap(beneficiaryMap);
        }

        WritableMap params = Arguments.createMap();
        params.putString("sessionId", sessionId);
        params.putArray("beneficiaries", beneficiaryArray);

        sendEvent("identificationSuccess", params, null);
    }

    private WritableArray processIdentificationResults(ArrayList<Identification> identifications) {
        WritableArray results = Arguments.createArray();

        for (Identification identification : identifications) {
            WritableMap result = Arguments.createMap();
            result.putString("guid", identification.getGuid());
            result.putString("tier", identification.getTier().name());
            result.putDouble("confidence", identification.getConfidence());
            results.pushMap(result);
        }

        return results;
    }

    private void handleIdentificationFailure() {
        sendEvent("identificationFailure", null, null);
    }

    private void sendEvent(String eventName, @Nullable WritableMap identificationResults, @Nullable String sessionId) {
        WritableMap params = Arguments.createMap();

        if (!TextUtils.isEmpty(sessionId)) {
            params.putString("sessionId", sessionId);
        }

        if (identificationResults != null) {
            params.putMap("identificationResults", identificationResults);
        }

        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

}
