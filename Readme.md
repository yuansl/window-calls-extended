# Window Calls extended version

This extension is based on teh "Window Calls" extension by ickyicky (https://github.com/ickyicky), extended by a few methods to provide the focused window's title, window class, and pid.

This extension allows you to list current windows with some of their properties from command line, super usefull for Wayland to get current focused window.

Credit to [dceee](https://github.com/dceee) for providing example code in [this discussion](https://gist.github.com/rbreaves/257c3edfa301786e66e964d7ac036269).

## Usage

Install extension from [gnome extensions page](https://extensions.gnome.org/extension/4724/window-calls/).

To get all active windows simply run from terminal:

```sh
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/Windows --method org.gnome.Shell.Extensions.Windows.List
```

To get the title of the window with focus:
```sh
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/Windows --method org.gnome.Shell.Extensions.Windows.FocusTitle
```

Available methods are:
* org.gnome.Shell.Extensions.Windows.List
* org.gnome.Shell.Extensions.Windows.FocusTitle
* org.gnome.Shell.Extensions.Windows.FocusPID
* org.gnome.Shell.Extensions.Windows.FocusClass

## Using from C++
If using from C++, it requires the dbus-1 library. Parameters for the call to `dbus_message_new_method_call` would be
```
#define DB_INTERFACE    "org.gnome.Shell.Extensions.Windows"
#define DB_DESTINATION  "org.gnome.Shell"
#define DB_PATH         "/org/gnome/Shell/Extensions/Windows"
#define DB_METHOD       "List"
```
