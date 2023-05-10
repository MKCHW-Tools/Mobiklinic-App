package com.awesomeproject;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class OpenActivityModule extends ReactContextBaseJavaModule {
    public OpenActivityModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "OpenActivity";
    }

    @ReactMethod
    public void open  (){
        //Referencing to the Screen called Android in a Native Android App. 
        //Can we do the same to Simprints ID?
        Intent intent = new Intent(getCurrentActivity(), AndroidActivity.class);
        //This is the actual usuage of the Intent that's derived from the the Android Activity.
        getCurrentActivity().startActivity(intent);
    }
}
