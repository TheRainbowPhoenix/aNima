# Export to Flutter Tutorial

The objective of this tutorial is to show how to export, animate, and display a Nima file with Flutter.

![[Pasted image 20231015040636.png]]

## Meet Hop

For the purposes of this tutorial I thought we'd use one of our favorite little robots: Hop. He's got a great looping idle animation over which we can layer an attack and jump sequence.

The source of our character file is [available to fork and modify](https://www.2dimensions.com/a/JuanCarlos/files/nima/hop/preview).

![[Pasted image 20231015040609.png]]

Click on the [Open in Nima](https://www.2dimensions.com/s/281-robot/nima) button and then on the Fork button in the notification. This will make a copy of JCToon's character in your 2Dimensions files and Nima will start saving your own [Revision History](https://www.2dimensions.com/learn/manual/revision_history) from this new start point.

First make a small tweak to the attack and jump animations. They are currently set to loop, which is nice for demoing the character in a shot, but we want the character to attack/jump and then return to idle once the animation is complete.

Switch Nima to [Animate mode](/nima/core-concepts#setup-and-animate-mode), select the jump animation in the animation list and turn off looping.

![[Pasted image 20231015040557.png]]
##  Export Hop for Flutter

The next step is to [export the character](/nima/export/export-to-engine) for Flutter. Click on the export/share menu and select the Export to Engine button.

![[Pasted image 20231015040547.png]]

In the [Export to Engine](/nima/export/export-to-engine) menu, select Generic as the engine option. Leave the other settings to default and press export. This will generate and download a zip file with a Robot.nima file and a Robot.png file. Keep these handy as we'll be using them in the next step.

## Make a Flutter app

If you've already got some experience with Flutter, you can skip straight to the next section.

Install Flutter by following the official [instructions for your system](https://flutter.io/get-started/install/).

Create a sample app by typing the following in your command line/terminal:

```
flutter create nima_hop
```

This will make a folder called nima_hop containing an example app that's ready to be deployed to either iOS or Android.

Start an iOS Simulator or Android Emulator. Change directory to the nima_hop folder and run the app:

```
cd nima_hop

flutter run
```

This will build the example app and deploy it to your emulator. Note that if you have multiple devices/emulators running you will need to specify which one to deploy to with the -d argument.

## Add Nima Dependency

The next step is to add the [nima package](https://pub.dartlang.org/packages/nima) (our Flutter Runtime) as a dependency to your app. Open the pubspec.yaml and add `nima` as a dependency. If you are new to this, you can read more about how to manage [Flutter dependencies](https://flutter.io/platform-plugins/) here.

Your pubspec.yaml should look something like this:
```
name: example

description: A new Flutter project.

dependencies:

flutter:

sdk: flutter

nima: ^1.0.0
```

## Add the Nima files to your Assets

We need to add the two files we generated earlier to the assets for this application. Make an assets folder in nima_hop and copy the Robot.nima and Robot.png files in there. Your directory structure should look like this:

```
nima_hop/
|- assets/
| |- Robot.nima
| |- Robot.png
|- lib/
| |- main.dart
|- pubspec.yaml
|- [..]
```

The next step is to let your app know it needs to package those assets with your application when it builds it. Do this by adding them to the assets section of pubspec.yaml:

```
name: example
description: A new Flutter project.

dependencies:
	flutter:
		sdk: flutter
	nima: ^1.0.0

flutter:
	uses-material-design: true
	
	assets:
		- assets/Robot.nima
		- assets/Robot.png
```

## Integrate

Flutter's power and simplicity relies on making all the UI components of an app as widgets. The next step is to use a widget exposed by the [nima package](https://pub.dartlang.org/packages/nima) to display and control Hop in our application.

First include the nima_actor.dart in your lib/main.dart file:

```
import 'package:nima/nima_actor.dart';
```

The generated example creates a Scaffold which provides you with a title bar, a main body, and a floating button. You can find the Scaffold in the build method of the MyHomePageState class. Delete the default content the example sets up in the body and replace it with a NimaActor widget.

```
return new Scaffold(
	appBar: ...,
	body: new NimaActor("assets/Robot", alignment:Alignment.center, fit:BoxFit.contain, animation:"idle"),
	floatingActionButton: ...
);
```

Note that you specify the Nima asset path by its base name without the extension. This is because the loader will look for .nima and required .png files (larger characters can have multiple image files) and load them for you.

If you call `flutter run` again you'll notice that Hop will be idling in the middle of your screen.

Next, we can wire up the floatingActionButton to making Hop jump.

Add an animation name variable to the HomePageState which will store the currently playing animation.

```
String _currentAnimatioName = "idle";
```

Change our NimaActor widget to use this variable and tell it to mix animations over the course of 0.2 seconds:

```
return new Scaffold(
	appBar: ...,
	body: new NimaActor("assets/Robot", alignment:Alignment.center, fit:BoxFit.contain, animation:_currentAnimationName, mixSeconds:0.2),
	floatingActionButton: ...
);
```

The mixSeconds are used when changing from one animation to another. The next animation is mixed over the previous one (imagine cranking the fader on a mixer or a volume dial) over the course of mixSeconds. Set this to 0.0 to make it pop to the next animation.

The next step is to change the value of our current animation whenever we press the floating action button. This is what will actually change the current animation.

```
floatingActionButton: new FloatingActionButton(
	onPressed: () {
		setState(() {
			_currentAnimationName = "jump";
		});
	},
	tooltip: 'Jump',
	child: new Icon(Icons.arrow_upward),
),
```

Call `flutter run` now and press on the floating button on the bottom right, you'll notice that Hop jumps but after he jumps he just stands there! We need to return him to idle. The NimaWidget provides a callback for whenever an animation completes which we can use for this purpose.

```
body: new NimaActor("assets/Hop", alignment:Alignment.center, fit:BoxFit.contain, animation:_currentAnimationName, mixSeconds:0.2, completed: (String animationName) {
	setState(() {
		_currentAnimationName = "idle";
	});
}),
```

Call `flutter run` again and you'll see that Hop returns to idle after the jump completes.

This wraps up the tutorial. If you want to take it a tiny bit further, explore adding a second button that lets Hop fire his primary weapon (via the "attack" animation). You can also look over [the complete example code](https://github.com/2d-inc/Nima-Flutter/blob/master/example/lib/main.dart) included in the runtime which implements the same animations and functionality described above.