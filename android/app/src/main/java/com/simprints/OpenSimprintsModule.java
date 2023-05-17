package com.simprints;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class OpenSimprintsModule extends ReactContextBaseJavaModule {
    public OpenSimprintsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "OpenActivity";
    }

    @ReactMethod
    public void open(String projectId, String userId, String moduleId){
        Intent intent = new Intent("com.simprints.id.REGISTER");
        intent.putExtra("tZqJnw0ajK04LMYdZzyw", projectId);
        intent.putExtra("test_user", userId);
        intent.putExtra("mpower", moduleId);
        getCurrentActivity().startActivityForResult(intent, 1);

    }
}


