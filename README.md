# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Android APK build

Build from the repository root after dependencies are installed:

```bash
npm install
```

The Android project uses `android/gradle.properties` to control native CPU architectures. The default value is:

```properties
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
```

### Windows PowerShell

Universal release APK:

```powershell
.\android\gradlew.bat -p android assembleRelease
```

arm64-v8a release APK:

```powershell
.\android\gradlew.bat -p android assembleRelease -PreactNativeArchitectures=arm64-v8a
```

Debug APK:

```powershell
.\android\gradlew.bat -p android assembleDebug
```

### macOS / Linux

Universal release APK:

```bash
./android/gradlew -p android assembleRelease
```

arm64-v8a release APK:

```bash
./android/gradlew -p android assembleRelease -PreactNativeArchitectures=arm64-v8a
```

Debug APK:

```bash
./android/gradlew -p android assembleDebug
```

### Output paths

Release APK:

```text
android/app/build/outputs/apk/release/app-release.apk
```

Debug APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

### Android App Bundle

For Play Store upload:

```bash
./android/gradlew -p android bundleRelease
```

Windows PowerShell:

```powershell
.\android\gradlew.bat -p android bundleRelease
```

Output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

### EAS cloud build

Internal preview build:

```bash
npx eas-cli@latest build -p android --profile preview
```

Production build:

```bash
npx eas-cli@latest build -p android --profile production
```

Note: local release builds currently use the debug signing config from `android/app/build.gradle`. Configure a real release keystore before distributing outside internal testing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
