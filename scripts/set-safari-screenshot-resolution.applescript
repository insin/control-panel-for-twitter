(*
Sets Safari dimensions for 2880 x 1800 px screenshots - including the drop shadow - at scale=2.
This only works when not connected to an external display.
*)
tell application "Safari"
	activate
	set bounds of window 1 to {0, 0, 1328, 788}
end tell