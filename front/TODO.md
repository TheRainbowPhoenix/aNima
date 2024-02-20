open in chrome dbg : http://localhost:5173/a/castor/files/nima/archer check breakpoints
goal is to draw grid and bg stuff :

0.  StageCanvas -> new Nima -> new Stage -> \_AllTools.push... / initializeStageContext -> initializeStageContext -> img.onLoad -> "x()"

1.  x() set progress, that call "checkGraphicsProgress" that do onAppReady()
2.  "onAppReady" set Stagen dispatch events on dom and dispatch("ready")
3.  "ready" call "nimaReady" -> nima.loadFile()
4.  loadFile -> \_RevisionManager.load -> loadStage2 -> setRevisionData -> dispatch("fileLoaded")
5.  "fileLoaded" fire listener like "onFileLoaded" -> setActor -> advance() -> draw()
6.  "draw" : \_Stage.draw() + \_EditorUI.drawRulers() + \_Stage.drawGuides

7.  Stage.draw -> Stage.drawTo -> \_Graphics.drawGrid

if we can get the line to draw ==> "Big Win"

TODO also : \_Brush = new <SomeThing> -> find the smth

===

Work on : EditorUI ? Class + draw() + types
