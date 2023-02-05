# Mac: run via `zsh -i ./mac-appicon-assets.sh` if using an alias

# Requires inkscape to be in your PATH or aliased, e.g. on Mac:
# alias inkscape="/Applications/Inkscape.app/Contents/MacOS/inkscape"
inkscape -w 16 -h 16 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon16.png
inkscape -w 32 -h 32 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon32.png
inkscape -w 64 -h 64 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon64.png
inkscape -w 128 -h 128 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon128.png
inkscape -w 256 -h 256 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon256.png
inkscape -w 512 -h 512 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon512.png
inkscape -w 1024 -h 1024 ../icons/icon.svg -o ../safari/Shared\ \(App\)/Assets.xcassets/AppIcon.appiconset/appicon1024.png