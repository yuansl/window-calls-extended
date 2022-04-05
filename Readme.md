# Window Calls extended version

This extension is based on teh "Window Calls" extension by ickyicky (https://github.com/ickyicky), extended by a few methods to provide the focused window's title, window class, and pid.

This extension allows you to list current windows with some of their properties from command line, super usefull for Wayland to get current focused window. The additional information on focused window are also for use with Wayland and espanso (https://github.com/federico-terzi/espanso), which – hopefully – jointly with this extension will be able to provide app-specific keyboard expansions.

Credit to [dceee](https://github.com/dceee) for providing example code in [this discussion](https://gist.github.com/rbreaves/257c3edfa301786e66e964d7ac036269).

## Usage

Install extension from [gnome extensions page](https://extensions.gnome.org/extension/4974/window-calls-extended/).

To manually install, copy `extension.js` and `metadata.json` into a folder by (exactly!! Gnome will not load the extension if the folder name does not match the uuid from the metadata) name of `window-calls-extended@hseliger.eu` under your `~/.local/share/gnome-shell/extensions` folder.

To get all active windows simply run from terminal:

```sh
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/WindowsExt --method org.gnome.Shell.Extensions.WindowsExt.List
```

To get the title of the window with focus:
```sh
gdbus call --session --dest org.gnome.Shell --object-path /org/gnome/Shell/Extensions/WindowsExt --method org.gnome.Shell.Extensions.WindowsExt.FocusTitle
```

Available methods are:
* org.gnome.Shell.Extensions.WindowsExt.List
* org.gnome.Shell.Extensions.WindowsExt.FocusTitle
* org.gnome.Shell.Extensions.WindowsExt.FocusPID
* org.gnome.Shell.Extensions.WindowsExt.FocusClass

## Using from C++
If using from C++, it requires the dbus-1 library. Parameters for the call to `dbus_message_new_method_call` would be
```
#define DB_INTERFACE    "org.gnome.Shell.Extensions.Windows"
#define DB_DESTINATION  "org.gnome.Shell"
#define DB_PATH         "/org/gnome/Shell/Extensions/Windows"
#define DB_METHOD       "List"
```
